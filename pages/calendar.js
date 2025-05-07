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
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setEvents(storedEvents);
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleDateClick = (arg) => {
    setSelectedEvent({
      title: "",
      category: "Offer",
      offerType: "Triple Offer",
      start: arg.dateStr,
      end: arg.dateStr,
    });
    setIsPreview(false);
    setShowModal(true);
  };

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
  };

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsPreview(true);
      setShowModal(true);
    }
  };

  const handleEventDoubleClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsPreview(false);
      setShowModal(true);
    }
  };

  const handleSave = (eventData) => {
    if (eventData.id) {
      // Update
      setEvents((prev) =>
        prev.map((evt) => (evt.id === eventData.id ? eventData : evt))
      );
    } else {
      // Create
      setEvents((prev) => [...prev, { ...eventData, id: Date.now().toString() }]);
    }
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => {
          setSelectedEvent({
            title: "",
            category: "Offer",
            offerType: "Triple Offer",
            start: new Date().toISOString().slice(0, 16),
            end: new Date().toISOString().slice(0, 16),
          });
          setIsPreview(false);
          setShowModal(true);
        }}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
        }}
      >
        New Event
      </button>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={(info) => {
          handleEventClick(info);
          setTimeout(() => {
            info.jsEvent.target.addEventListener("dblclick", () => {
              handleEventDoubleClick(info);
            }, { once: true });
          }, 0);
        }}
        editable={true}
        eventDrop={handleEventDrop}
      />

      {showModal && (
        <EventModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
          eventData={selectedEvent}
          isPreview={isPreview}
        />
      )}
    </div>
  );
};

export default CalendarPage;









