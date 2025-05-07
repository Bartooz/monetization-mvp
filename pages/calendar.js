import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const storedEvents = localStorage.getItem("calendar-events");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  const handleDateClick = (info) => {
    setSelectedEvent({
      start: info.dateStr,
      end: info.dateStr,
      category: "Offer",
      offerType: "Triple Offer",
      title: "",
    });
    setPreviewMode(false);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const clickedEvent = events.find((e) => e.id === clickInfo.event.id);
    if (!clickedEvent) return;

    if (clickInfo.jsEvent.detail === 1) {
      // single click = preview
      setPreviewMode(true);
    } else if (clickInfo.jsEvent.detail === 2) {
      // double click = edit
      setPreviewMode(false);
    }

    setSelectedEvent(clickedEvent);
    setModalOpen(true);
  };

  const handleEventDrop = (dropInfo) => {
    const updatedEvents = events.map((event) => {
      if (event.id === dropInfo.event.id) {
        return {
          ...event,
          start: dropInfo.event.startStr,
          end: dropInfo.event.endStr || dropInfo.event.startStr,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const handleSave = () => {
    if (!selectedEvent.title || !selectedEvent.start || !selectedEvent.end) {
      alert("Please fill all fields.");
      return;
    }

    const updatedEvents = selectedEvent.id
      ? events.map((e) => (e.id === selectedEvent.id ? selectedEvent : e))
      : [...events, { ...selectedEvent, id: Date.now().toString() }];

    setEvents(updatedEvents);
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDelete = () => {
    const updatedEvents = events.filter((e) => e.id !== selectedEvent.id);
    setEvents(updatedEvents);
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Monetization Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />
      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        eventData={selectedEvent}
        setEventData={setSelectedEvent}
        previewMode={previewMode}
      />
    </div>
  );
};

export default CalendarPage;









