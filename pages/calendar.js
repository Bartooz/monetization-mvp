// pages/calendar.js
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  const saveEvents = (updatedEvents) => {
    setEvents(updatedEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
  };

  const handleNewEvent = () => {
    setEventData({
      id: null,
      title: "",
      start: "",
      end: "",
      category: "Offer",
      offerType: "Triple Offer",
      templateName: "",
      configurationName: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const clickedEvent = events.find(e => e.id === clickInfo.event.id);
    if (!clickedEvent) return;

    if (clickInfo.jsEvent.detail === 1) {
      // Single click = preview (can implement preview modal)
      // For now, fallback to open in read-only mode
      setEventData(clickedEvent);
      setIsEditing(false);
      setIsModalOpen(true);
    } else if (clickInfo.jsEvent.detail >= 2) {
      // Double click = edit
      setEventData(clickedEvent);
      setIsEditing(true);
      setIsModalOpen(true);
    }
  };

  const handleEventDrop = (info) => {
    const updated = events.map(e =>
      e.id === info.event.id
        ? { ...e, start: info.event.startStr, end: info.event.endStr || info.event.startStr }
        : e
    );
    saveEvents(updated);
  };

  const handleSave = (newData) => {
    if (!newData.title || !newData.start || !newData.end) {
      alert("Missing required fields.");
      return;
    }

    if (newData.id) {
      const updated = events.map(e => (e.id === newData.id ? newData : e));
      saveEvents(updated);
    } else {
      const newEvent = { ...newData, id: String(Date.now()) };
      saveEvents([...events, newEvent]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (idToDelete) => {
    const updated = events.filter(e => e.id !== idToDelete);
    saveEvents(updated);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Monetization Calendar</h2>
      <button onClick={handleNewEvent} style={{ marginBottom: 20 }}>
        ➕ New Event
      </button>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        droppable={true}
        selectable={true}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        height="auto"
      />

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          isEditing={isEditing}
          eventData={eventData}
          setEventData={setEventData}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}











