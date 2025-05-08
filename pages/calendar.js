import { useState, useEffect } from "react";
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
  const [newEvent, setNewEvent] = useState({ id: null, title: "", start: "", end: "" });

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setEvents(stored);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  // Add or update event
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;

    if (newEvent.id) {
      setEvents((prev) =>
        prev.map((e) => (e.id === newEvent.id ? newEvent : e))
      );
    } else {
      const newId = Date.now().toString();
      setEvents((prev) => [...prev, { ...newEvent, id: newId }]);
    }

    setNewEvent({ id: null, title: "", start: "", end: "" });
    setIsModalOpen(false);
  };

  // Drag event
  const handleEventDrop = (info) => {
    const updated = events.map((evt) =>
      evt.id === info.event.id
        ? {
            ...evt,
            start: info.event.startStr,
            end: info.event.endStr,
          }
        : evt
    );
    setEvents(updated);
    localStorage.setItem("calendarEvents", JSON.stringify(updated)); // Persist immediately
  };

  // Double-click to edit
  const handleEventDidMount = (info) => {
    info.el.addEventListener("dblclick", () => {
      const matched = events.find((e) => e.id === info.event.id);
      if (matched) {
        // Reformat start/end as valid datetime-local strings
        const formatDateTimeLocal = (date) => {
          const d = new Date(date);
          const offset = d.getTimezoneOffset() * 60000;
          const localISOTime = new Date(d - offset).toISOString().slice(0, 16);
          return localISOTime;
        };
  
        const withFormattedDates = {
          ...matched,
          start: formatDateTimeLocal(matched.start),
          end: formatDateTimeLocal(matched.end),
        };
  
        setNewEvent(withFormattedDates);
        setIsModalOpen(true);
      }
    });
  };
  

  return (
    <>
      <button
        onClick={() => {
          setNewEvent({ id: null, title: "", start: "", end: "" });
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "10px", padding: "10px 20px", fontWeight: "bold" }}
      >
        New Event
      </button>

      <FullCalendar
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
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
      />
    </>
  );
}


















