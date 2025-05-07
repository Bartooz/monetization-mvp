// pages/calendar.js
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [clickTimer, setClickTimer] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("calendar-events")) || [];
    const savedTemplates = JSON.parse(localStorage.getItem("liveops-templates")) || [];
    const savedConfigs = JSON.parse(localStorage.getItem("liveops-configurations")) || [];
    setEvents(savedEvents);
    setTemplates(savedTemplates);
    setConfigurations(savedConfigs);
  }, []);

  const saveEvents = (updatedEvents) => {
    localStorage.setItem("calendar-events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      title: "",
      category: "Offer",
      offerType: "Triple Offer",
    });
    setShowModal(true);
  };

  const handleEventClick = (clickInfo) => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      setClickTimer(null);
      handleEventDoubleClick(clickInfo.event);
    } else {
      const timer = setTimeout(() => {
        setSelectedEvent(clickInfo.event.extendedProps);
        setShowPreview(true);
        setClickTimer(null);
      }, 250);
      setClickTimer(timer);
    }
  };

  const handleEventDoubleClick = (event) => {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      ...event.extendedProps,
    });
    setShowModal(true);
    setShowPreview(false);
  };

  const handleEventDrop = (changeInfo) => {
    const updated = events.map((evt) =>
      evt.id === changeInfo.event.id
        ? {
            ...evt,
            start: changeInfo.event.startStr,
            end: changeInfo.event.endStr,
          }
        : evt
    );
    saveEvents(updated);
  };

  const handleSave = (eventData) => {
    let updatedEvents;
    if (eventData.id) {
      updatedEvents = events.map((evt) => (evt.id === eventData.id ? eventData : evt));
    } else {
      const newEvent = { ...eventData, id: String(Date.now()) };
      updatedEvents = [...events, newEvent];
    }
    saveEvents(updatedEvents);
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDelete = (id) => {
    const updated = events.filter((evt) => evt.id !== id);
    saveEvents(updated);
    setShowPreview(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>LiveOps Calendar</h1>
      <button onClick={() => { setSelectedEvent(null); setShowModal(true); }}>New Event</button>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />

      {showModal && (
        <EventModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          eventData={selectedEvent}
          setEventData={setSelectedEvent}
          templates={templates}
          configurations={configurations}
        />
      )}

      {showPreview && selectedEvent && (
        <div style={{ position: "fixed", bottom: 20, right: 20, background: "#fff", padding: "1rem", boxShadow: "0 0 10px rgba(0,0,0,0.2)", zIndex: 1000 }}>
          <h3>{selectedEvent.title}</h3>
          <p><strong>Category:</strong> {selectedEvent.category}</p>
          <p><strong>Offer Type:</strong> {selectedEvent.offerType}</p>
          <p><strong>Start:</strong> {selectedEvent.start}</p>
          <p><strong>End:</strong> {selectedEvent.end}</p>
          <button onClick={() => handleEventDoubleClick({ event: selectedEvent })}>Edit</button>
          <button onClick={() => handleDelete(selectedEvent.id)} style={{ marginLeft: "10px" }}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;











