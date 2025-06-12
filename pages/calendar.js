import { useEffect, useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

console.log("🚀 NEW CALENDAR BUILD", new Date().toISOString());

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "", start: "", end: "", category: "", templateName: "", status: "Draft"
  });
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [selectedEventForPreview, setSelectedEventForPreview] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
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
  }, []);

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

      setEvents([]); // flush stale cache
      setTimeout(() => {
        setEvents(normalized); // inject fresh data
        calendarRef.current?.getApi().refetchEvents(); // tell FullCalendar to re-render
      }, 50);
      console.log("Events received from backend:", normalized);
    } catch (err) {
      console.error("Error saving event", err);
    }

    setIsModalOpen(false);
    setNewEvent({ title: "", start: "", end: "", category: "", templateName: "", status: "Draft" });
  };

  const handleEventDrop = async (info) => {
    const movedEvent = events.find(evt => evt.id == info.event.id);
    if (!movedEvent) return;

    const updated = { ...movedEvent, start: info.event.startStr, end: info.event.endStr };

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
    });

    setIsModalOpen(true);
    setSelectedEventForPreview(null);
  };

  const handleDeleteFromPreview = async () => {
    if (!selectedEventForPreview) return;

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
      console.log("Events received from backend:", normalized);

    } catch (err) {
      console.error("Error deleting event", err);
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
        }}
        style={{ marginBottom: 12 }}
      >
        New Event3
      </button>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={true}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        eventContent={(arg) => {
          const matched = events.find(e => e.id === arg.event.id);

          console.log("🖱 Rendering event content:", arg.event.title);

          return (
            <div
              onDoubleClick={() => {
                if (matched) {
                  console.log("🔥 DOUBLE CLICK detected on", arg.event.title);
                  console.log("🧩 Matched event object:", matched);
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
        showPreview={true}
        setShowPreview={() => setShowPreview(true)}
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
























