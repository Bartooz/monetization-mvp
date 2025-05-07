// pages/calendar.js
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    start: "",
    end: "",
    category: "Offer",
    offerType: "Triple Offer",
    templateName: "",
    configurationName: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  const saveEvents = (updated) => {
    setEvents(updated);
    localStorage.setItem("calendarEvents", JSON.stringify(updated));
  };

  const handleNewEvent = () => {
    setEventData({
      title: "",
      start: "",
      end: "",
      category: "Offer",
      offerType: "Triple Offer",
      templateName: "",
      configurationName: "",
    });
    setSelectedEvent(null);
    setIsPreview(false);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (!event) return;

    if (clickInfo.jsEvent.detail === 1) {
      setSelectedEvent(event);
      setIsPreview(true);
      setIsModalOpen(true);
    } else if (clickInfo.jsEvent.detail >= 2) {
      setSelectedEvent(event);
      setEventData(event);
      setIsPreview(false);
      setIsModalOpen(true);
    }
  };

  const handleEventDrop = (info) => {
    const updated = events.map((e) =>
      e.id === info.event.id
        ? {
            ...e,
            start: info.event.startStr,
            end: info.event.endStr || info.event.startStr,
          }
        : e
    );
    saveEvents(updated);
  };

  const handleSave = () => {
    if (!eventData.title || !eventData.start || !eventData.end) {
      alert("Missing required fields.");
      return;
    }

    if (selectedEvent) {
      const updated = events.map((e) =>
        e.id === selectedEvent.id ? { ...eventData, id: e.id } : e
      );
      saveEvents(updated);
    } else {
      const newEvent = { ...eventData, id: Date.now().toString() };
      saveEvents([...events, newEvent]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (eventId) => {
    const updated = events.filter((e) => e.id !== eventId);
    saveEvents(updated);
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📅 Monetization Calendar</h2>
      <button onClick={handleNewEvent} style={{ marginBottom: 10 }}>
        ➕ New Event
      </button>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        height="auto"
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        eventData={eventData}
        setEventData={setEventData}
        isPreview={isPreview}
        isEditing={!!selectedEvent}
      />
    </div>
  );
}









