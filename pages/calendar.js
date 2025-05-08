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

  const lastClickTimeRef = useRef(null);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;

    if (newEvent.id) {
      // Update existing
      setEvents((prev) =>
        prev.map((evt) => (evt.id === newEvent.id ? newEvent : evt))
      );
    } else {
      // Add new
      setEvents((prev) => [...prev, { ...newEvent, id: Date.now() }]);
    }

    setNewEvent({ title: "", start: "", end: "" });
    setIsModalOpen(false);
  };

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((evt) =>
      evt.id === info.event.id
        ? { ...evt, start: info.event.startStr, end: info.event.endStr }
        : evt
    );
    setEvents(updatedEvents);
  };

  const handleEventClick = (clickInfo) => {
    const now = new Date().getTime();
    if (
      lastClickTimeRef.current &&
      now - lastClickTimeRef.current < 400
    ) {
      // Detected a double-click
      const matched = events.find((e) => e.id === clickInfo.event.id);
      if (matched) {
        setNewEvent(matched);
        setIsModalOpen(true);
      }
    }
    lastClickTimeRef.current = now;
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
        eventClick={handleEventClick}
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
















