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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [previewEvent, setPreviewEvent] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.template) return;

    const fullTemplate = JSON.parse(localStorage.getItem("savedTemplates") || "[]").find(
      (t) => t.name === newEvent.template
    );

    const enrichedEvent = {
      ...newEvent,
      category: fullTemplate?.eventType || "Offer",
      offerType: fullTemplate?.offerType || "Triple Offer",
      configuration: fullTemplate?.configuration || null,
    };

    const updatedEvents = newEvent.id
      ? events.map((evt) => (evt.id === newEvent.id ? enrichedEvent : evt))
      : [...events, { ...enrichedEvent, id: Date.now() }];

    setEvents(updatedEvents);
    setIsModalOpen(false);
    setNewEvent({ title: "", start: "", end: "" });
  };

  const handleEventDrop = (info) => {
    const updated = events.map((evt) =>
      evt.id === info.event.id
        ? { ...evt, start: info.event.startStr, end: info.event.endStr }
        : evt
    );
    setEvents(updated);
  };

  const handleEventClick = (clickInfo) => {
    const evt = events.find((e) => e.id === clickInfo.event.id);
    if (evt) {
      setPreviewEvent(evt);
    }
  };

  const handleEventDidMount = (info) => {
    info.el.addEventListener("dblclick", () => {
      const matched = events.find((e) => e.id === info.event.id);
      if (matched) {
        setNewEvent({
          ...matched,
          start: matched.start?.slice(0, 16),
          end: matched.end?.slice(0, 16),
        });
        setIsModalOpen(true);
      }
    });
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    setPreviewEvent(null);
  };

  return (
    <>
      <button
        onClick={() => {
          setNewEvent({ title: "", start: "", end: "" });
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "10px", padding: "10px 20px", fontWeight: "bold" }}
      >
        New Event
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
        droppable={true}
        eventDrop={handleEventDrop}
        eventDidMount={handleEventDidMount}
        eventClick={handleEventClick}
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
      />

      {previewEvent && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            background: "#fff",
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "8px",
            zIndex: 999,
            width: "280px",
          }}
        >
          <h3>{previewEvent.title}</h3>
          <p><strong>Start:</strong> {previewEvent.start}</p>
          <p><strong>End:</strong> {previewEvent.end}</p>
          <p><strong>Template:</strong> {previewEvent.template}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: 12 }}>
            <button
              onClick={() => {
                setNewEvent({
                  ...previewEvent,
                  start: previewEvent.start?.slice(0, 16),
                  end: previewEvent.end?.slice(0, 16),
                });
                setIsModalOpen(true);
                setPreviewEvent(null);
              }}
            >
              Edit
            </button>
            <button onClick={() => handleDeleteEvent(previewEvent.id)}>Delete</button>
          </div>
        </div>
      )}

      {previewEvent && (
        <div
          onClick={() => setPreviewEvent(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "transparent",
            zIndex: 998,
          }}
        />
      )}
    </>
  );
}
























