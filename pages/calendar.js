// pages/calendar.js
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

import '@fullcalendar/core/index.css';
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';


export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState({ start: null, end: null });

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(savedEvents);
  }, []);

  const handleDateSelect = (arg) => {
    setSelectedDate({ start: arg.startStr, end: arg.endStr });
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      extendedProps: event.extendedProps
    });
    setShowModal(true);
  };

  const handleEventDrop = (changeInfo) => {
    const updatedEvents = events.map((evt) =>
      evt.id === changeInfo.event.id
        ? {
            ...evt,
            start: changeInfo.event.startStr,
            end: changeInfo.event.endStr,
          }
        : evt
    );
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  };

  const handleSave = (eventData) => {
    let updatedEvents;
    if (eventData.id) {
      updatedEvents = events.map((evt) =>
        evt.id === eventData.id ? eventData : evt
      );
    } else {
      const newEvent = {
        ...eventData,
        id: String(Date.now()),
      };
      updatedEvents = [...events, newEvent];
    }
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setShowModal(false);
  };

  const handleDelete = (eventId) => {
    const updatedEvents = events.filter((evt) => evt.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setShowModal(false);
  };

  const handleNewEventClick = () => {
    setSelectedDate({ start: new Date().toISOString(), end: new Date().toISOString() });
    setSelectedEvent(null);
    setShowModal(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleNewEventClick} style={{ marginBottom: 10 }}>
        ➕ New Event
      </button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        editable={true}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        height="auto"
      />
      {showModal && (
        <EventModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          onDelete={handleDelete}
          initialData={selectedEvent}
          defaultDate={selectedDate}
        />
      )}
    </div>
  );
}







