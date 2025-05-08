import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import EventModal from "../components/EventModal";

Modal.setAppElement("#__next");

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [calendarKey, setCalendarKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ top: 0, left: 0 });
  const previewRef = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (previewRef.current && !previewRef.current.contains(e.target)) {
        setPreviewEvent(null); // Close the preview
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const [newEvent, setNewEvent] = useState({
    id: null,
    title: "",
    start: "",
    end: "",
    category: "Mission",
    template: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setEvents(stored);

    const storedTemplates = JSON.parse(localStorage.getItem("liveops-templates")) || [];
    setTemplates(storedTemplates);
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    const updatedEvent = {
      ...newEvent,
      start: newEvent.start,
      end: newEvent.end,
      title: newEvent.title,
      category: newEvent.category,
      template: newEvent.template,
    };

    if (!updatedEvent.title || !updatedEvent.start || !updatedEvent.end) return;

    let updated;
    if (updatedEvent.id) {
      updated = events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
    } else {
      updated = [...events, { ...updatedEvent, id: Date.now().toString() }];
    }

    setEvents(updated);
    localStorage.setItem("calendarEvents", JSON.stringify(updated));
    setCalendarKey((prev) => prev + 1);

    setNewEvent({ title: "", start: "", end: "", category: "", template: "" });
    setIsModalOpen(false);
  };



  const handleEventDrop = (info) => {
    const updated = events.map((evt) =>
      evt.id === info.event.id
        ? { ...evt, start: info.event.startStr, end: info.event.endStr }
        : evt
    );
    setEvents(updated);
    localStorage.setItem("calendarEvents", JSON.stringify(updated));
  };

  const handleDeleteEvent = () => {
    if (!newEvent.id) return;
    const updated = events.filter((e) => e.id !== newEvent.id);
    setEvents(updated);
    localStorage.setItem("calendarEvents", JSON.stringify(updated));
    setIsModalOpen(false);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const { id, title, start, end, extendedProps } = event;

    const previewData = {
      id,
      title,
      start: new Date(start).toLocaleString(),
      end: new Date(end).toLocaleString(),
      category: extendedProps.category,
      template: extendedProps.template,
    };

    const rect = clickInfo.el.getBoundingClientRect();
    setPreviewPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    setPreviewEvent(previewData);
  };


  const handleEventDidMount = (info) => {
    info.el.addEventListener("dblclick", () => {
      const { id, title, start, end, extendedProps } = info.event;

      const formatDateTimeLocal = (date) => {
        const d = new Date(date);
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d - offset).toISOString().slice(0, 16);
      };

      const formattedEvent = {
        id,
        title,
        start: formatDateTimeLocal(start),
        end: formatDateTimeLocal(end),
        category: extendedProps.category || "Mission",
        template: extendedProps.template || "",
      };

      setNewEvent(formattedEvent);
      setIsModalOpen(true);
    });
  };

  return (
    <>
      <button
        onClick={() => {
          setNewEvent({
            id: null,
            title: "",
            start: "",
            end: "",
            category: "Mission",
            template: "",
          });
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "10px", padding: "10px 20px", fontWeight: "bold" }}
      >
        New Event
      </button>

      <FullCalendar
        key={calendarKey}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events.map((e) => ({
          ...e,
          extendedProps: {
            category: e.category,
            template: e.template,
          },
        }))}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventDidMount={handleEventDidMount}
        eventClick={handleEventClick}
      />

      {previewEvent && (
        <div
        ref={previewRef}
          style={{
            position: "absolute",
            top: previewPosition.top,
            left: previewPosition.left,
            background: "#fff",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            minWidth: "250px"
          }}
        >
          <strong>{previewEvent.title}</strong>
          <div>Start: {previewEvent.start}</div>
          <div>End: {previewEvent.end}</div>
          {previewEvent.category === "Offer" && (
            <div>Template: {previewEvent.template || "None"}</div>
          )}

          <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              onClick={() => {
                const found = events.find((e) => e.id === previewEvent.id);
                if (found) {
                  const formatDateTimeLocal = (date) => {
                    const d = new Date(date);
                    const offset = d.getTimezoneOffset() * 60000;
                    return new Date(d - offset).toISOString().slice(0, 16);
                  };
                  setNewEvent({
                    ...found,
                    start: formatDateTimeLocal(found.start),
                    end: formatDateTimeLocal(found.end),
                  });
                  setIsModalOpen(true);
                  setPreviewEvent(null);
                }
              }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                const updated = events.filter((e) => e.id !== previewEvent.id);
                setEvents(updated);
                localStorage.setItem("calendarEvents", JSON.stringify(updated));
                setPreviewEvent(null);
              }}
              style={{ background: "#c0392b", color: "white" }}
            >
              Delete
            </button>
          </div>
        </div>
      )}


      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        handleDeleteEvent={handleDeleteEvent}
        templates={templates}
      />
    </>
  );
}



















