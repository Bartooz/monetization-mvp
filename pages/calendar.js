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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    start: "",
    end: "",
    category: "Offer",
    offerType: "Triple Offer",
    template: "",
    configuration: "",
  });

  useEffect(() => {
    const storedEvents = localStorage.getItem("calendarEvents");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  const saveEvents = (updatedEvents) => {
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
  };

  const handleNewEvent = () => {
    setEventData({
      title: "",
      start: "",
      end: "",
      category: "Offer",
      offerType: "Triple Offer",
      template: "",
      configuration: "",
    });
    setSelectedEvent(null);
    setIsModalOpen(true);
    setIsPreview(false);
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    if (!event) return;

    if (clickInfo.jsEvent.detail === 1) {
      setSelectedEvent(event);
      setIsPreview(true);
      setIsModalOpen(true);
    } else if (clickInfo.jsEvent.detail >= 2) {
      setEventData(event);
      setSelectedEvent(event);
      setIsPreview(false);
      setIsModalOpen(true);
    }
  };

  const handleEventDrop = (changeInfo) => {
    const updatedEvents = events.map((e) =>
      e.id === changeInfo.event.id
        ? {
            ...e,
            start: changeInfo.event.startStr,
            end: changeInfo.event.endStr || changeInfo.event.startStr,
          }
        : e
    );
    saveEvents(updatedEvents);
  };

  const handleSave = () => {
    if (!eventData.title || !eventData.start || !eventData.end) {
      alert("Title, start, and end time are required.");
      return;
    }

    if (selectedEvent) {
      const updatedEvents = events.map((e) =>
        e.id === selectedEvent.id ? { ...selectedEvent, ...eventData } : e
      );
      saveEvents(updatedEvents);
    } else {
      const newEvent = {
        ...eventData,
        id: String(Date.now()),
      };
      saveEvents([...events, newEvent]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedEvent) return;
    const updatedEvents = events.filter((e) => e.id !== selectedEvent.id);
    saveEvents(updatedEvents);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Monetization Calendar</h1>
      <button onClick={handleNewEvent} style={{ marginBottom: "1rem" }}>
        New Event
      </button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        events={events}
        eventClick={handleEventClick}
        editable={true}
        droppable={true}
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
      />
    </div>
  );
};

export default CalendarPage;








