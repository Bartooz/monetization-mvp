import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

console.log("🚀 NEW CALENDAR BUILD", new Date().toISOString());

const USE_BACKEND = false;

const LOCAL_EVENTS_KEY = "calendar_events";
const LOCAL_TEMPLATES_KEY = "calendar_templates";
const LOCAL_CONFIGS_KEY = "calendar_configs";

const loadLocal = (key) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const saveLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "", start: "", end: "", category: "", templateName: "", status: "Draft"
  });
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [selectedEventForPreview, setSelectedEventForPreview] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState(["Show All"]);
  const [showPreview, setShowPreview] = useState(true);
  const allStatuses = ["Draft", "Ready for QA", "QA", "Review", "Ready", "Live", "Done"];
  const calendarRef = useRef(null);

  useEffect(() => {
    if (USE_BACKEND) {
      fetch(`${BASE_URL}/api/events`)
        .then((res) => res.json())
        .then((data) => {
          const normalized = data.map((e) => ({
            ...e,
            start: new Date(e.start).toISOString(),
            end: new Date(e.end).toISOString(),
          }));
          console.log("📅 Events fetched:", normalized);
          setEvents(normalized);
        })
        .catch((err) => {
          console.error("Failed to fetch events", err);
          setEvents([]);
        });

      fetch(`${BASE_URL}/api/templates`)
        .then((res) => res.json())
        .then((data) => {
          console.log("📦 Templates fetched:", data);
          setTemplates(data);
        })
        .catch((err) => {
          console.error("Failed to fetch templates", err);
          setTemplates([]);
        });

      fetch(`${BASE_URL}/api/configurations`)
        .then((res) => res.json())
        .then(setConfigurations)
        .catch((err) => {
          console.error("Failed to fetch configurations", err);
          setConfigurations([]);
        });
    } else {
      setEvents(loadLocal(LOCAL_EVENTS_KEY));
      setTemplates(loadLocal(LOCAL_TEMPLATES_KEY));
      setConfigurations(loadLocal(LOCAL_CONFIGS_KEY));
    }
  }, []);


  function getEffectiveStatus(event) {
    const now = new Date();
    if (event.status === "Ready" && new Date(event.start) <= now && new Date(event.end) >= now) {
      return "Live";
    }
    if (event.status === "Ready" && new Date(event.end) < now) {
      return "Done";
    }
    return event.status || "Draft";
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.templateName) return;

    const fullTemplate = templates.find(t => t.templateName === newEvent.templateName) || {};

    const eventToSave = {
      ...newEvent,
      category: newEvent.category || fullTemplate.eventType || "Offer",
      offerType: newEvent.offerType || fullTemplate.offerType || "Triple Offer",
      configuration: newEvent.configuration || fullTemplate.configuration || "",
      template_name: newEvent.templateName,
    };

    if (USE_BACKEND) {
      const isEdit = !!newEvent.id;
      const method = isEdit ? "PUT" : "POST";
      const endpoint = isEdit
        ? `${BASE_URL}/api/events/${newEvent.id}`
        : `${BASE_URL}/api/events`;

      try {
        await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventToSave),
        });
        const refreshed = await fetch(`${BASE_URL}/api/events`);
        const data = await refreshed.json();
        const normalized = data.map(e => ({
          ...e,
          start: new Date(e.start).toISOString(),
          end: new Date(e.end).toISOString(),
        }));

        setEvents([]);
        setTimeout(() => {
          setEvents(normalized);
          calendarRef.current?.getApi().refetchEvents();
        }, 50);
      } catch (err) {
        console.error("Error saving event", err);
      }
    } else {
      const isEdit = !!newEvent.id;
      let current = loadLocal(LOCAL_EVENTS_KEY);

      if (isEdit) {
        current = current.map((e) => (e.id === newEvent.id ? eventToSave : e));
      } else {
        eventToSave.id = Date.now();
        current.push(eventToSave);
      }

      saveLocal(LOCAL_EVENTS_KEY, current);
      setEvents(current);
    }

    setIsModalOpen(false);
    setNewEvent({ title: "", start: "", end: "", category: "", templateName: "", status: "Draft" });
  };


  const handleEventDrop = async (info) => {
    const movedEvent = events.find(evt => evt.id == info.event.id);
    if (!movedEvent) return;

    const updated = { ...movedEvent, start: info.event.startStr, end: info.event.endStr };

    if (USE_BACKEND) {
      try {
        await fetch(`${BASE_URL}/api/events/${updated.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        const refreshed = await fetch(`${BASE_URL}/api/events`);
        const data = await refreshed.json();
        const normalized = data.map(e => ({
          ...e,
          start: new Date(e.start).toISOString(),
          end: new Date(e.end).toISOString(),
        }));
        setEvents(normalized);
      } catch (err) {
        console.error("Error saving dropped event", err);
      }
    } else {
      const current = loadLocal(LOCAL_EVENTS_KEY).map(e =>
        e.id === updated.id ? updated : e
      );
      saveLocal(LOCAL_EVENTS_KEY, current);
      setEvents(current);
    }
  };


  const handleEventClick = (info) => {
    const matched = events.find(e => e.id == info.event.id);
    if (matched) setSelectedEventForPreview(matched);
  };

  const handleEditFromPreview = () => {
    if (!selectedEventForPreview) return;

    setNewEvent({
      title: selectedEventForPreview.title || "",
      start: selectedEventForPreview.start,
      end: selectedEventForPreview.end,
      category: selectedEventForPreview.category || "Offer",
      offerType: selectedEventForPreview.offerType || "Triple Offer",
      templateName: selectedEventForPreview.template_name || selectedEventForPreview.templateName || "",
      status: selectedEventForPreview.status || "Draft",
      id: selectedEventForPreview.id,
      design_data: fullTemplate.design_data || {},
      title: newEvent.title || fullTemplate.title || "Untitled Offer",
    });

    setIsModalOpen(true);
    setSelectedEventForPreview(null);
  };

  const handleDeleteFromPreview = async () => {
    if (!selectedEventForPreview) return;

    if (USE_BACKEND) {
      try {
        await fetch(`${BASE_URL}/api/events/${selectedEventForPreview.id}`, {
          method: "DELETE",
        });
        const refreshed = await fetch(`${BASE_URL}/api/events`);
        const data = await refreshed.json();
        const normalized = data.map(e => ({
          ...e,
          start: new Date(e.start).toISOString(),
          end: new Date(e.end).toISOString(),
        }));
        setEvents(normalized);
      } catch (err) {
        console.error("Error deleting event", err);
      }
    } else {
      const current = loadLocal(LOCAL_EVENTS_KEY).filter(e => e.id !== selectedEventForPreview.id);
      saveLocal(LOCAL_EVENTS_KEY, current);
      setEvents(current);
    }

    setSelectedEventForPreview(null);
  };




  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".fc-event")) {
        setSelectedEventForPreview(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => {
          setNewEvent({
            title: "",
            start: "",
            end: "",
            category: "Offer",
            offerType: "Triple Offer",
            templateName: "",
            status: "Draft",
          });
          setIsModalOpen(true);
          setShowPreview(true);
        }}
        style={{ marginBottom: 12 }}
      >
        New Event3
      </button>

      <div style={{ marginBottom: 12 }}>
        {allStatuses.map((status) => (
          <button
            key={status}
            onClick={() => {
              if (selectedStatuses.includes("Show All")) {
                setSelectedStatuses([status]);
              } else if (selectedStatuses.includes(status)) {
                const filtered = selectedStatuses.filter(s => s !== status);
                setSelectedStatuses(filtered.length > 0 ? filtered : ["Show All"]);
              } else {
                setSelectedStatuses([...selectedStatuses, status]);
              }
            }}
            style={{
              marginRight: 8,
              backgroundColor: selectedStatuses.includes(status) ? "#007bff" : "#e0e0e0",
              color: selectedStatuses.includes(status) ? "#fff" : "#000",
              padding: "6px 12px",
              borderRadius: 4,
              border: "none",
              cursor: "pointer"
            }}
          >
            {status}
          </button>
        ))}
        <button
          onClick={() => setSelectedStatuses(["Show All"])}
          style={{
            backgroundColor: selectedStatuses.includes("Show All") ? "#007bff" : "#e0e0e0",
            color: selectedStatuses.includes("Show All") ? "#fff" : "#000",
            padding: "6px 12px",
            borderRadius: 4,
            border: "none",
            marginLeft: 12,
            cursor: "pointer"
          }}
        >
          Show All
        </button>
      </div>


      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={selectedStatuses.includes("Show All")
          ? events
          : events.filter(e => selectedStatuses.includes(getEffectiveStatus(e)))
        }
        editable={true}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        eventContent={(arg) => {
          const matched = events.find(e => e.id === arg.event.id);

          console.log("🖱 Rendering event content:", arg.event.title);

          return (
            <div
              onDoubleClick={() => {
                const matched = events.find(e => String(e.id) === String(arg.event.id));
                console.log("✅ DOUBLE CLICK triggered on", arg.event.id);
                console.log("🔍 Matched event:", matched);

                if (matched) {
                  setNewEvent({
                    title: matched.title || "",
                    start: matched.start,
                    end: matched.end,
                    category: matched.category || "Offer",
                    offerType: matched.offerType || "Triple Offer",
                    templateName: matched.template_name || matched.templateName || "",
                    status: matched.status || "Draft",
                    id: matched.id
                  });

                  setIsModalOpen(true);
                }
              }}
            >
              <b>{arg.event.title}</b>
            </div>
          );
        }}


      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        templates={templates}
        configurations={configurations}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        designData={selectedEventForPreview?.design_data || {}}
      />

      {selectedEventForPreview && (
        <div style={{
          position: "fixed", top: "100px", right: "20px",
          background: "#fff", border: "1px solid #ccc", padding: "16px",
          width: 300, borderRadius: 8, zIndex: 1000
        }}>
          <h3>{selectedEventForPreview.title}</h3>
          <p><strong>Start:</strong> {selectedEventForPreview.start}</p>
          <p><strong>End:</strong> {selectedEventForPreview.end}</p>
          <p><strong>Status:</strong> {selectedEventForPreview.finalStatus}</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <button onClick={handleEditFromPreview}>Edit</button>
            <button onClick={handleDeleteFromPreview}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
























