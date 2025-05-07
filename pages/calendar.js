import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";
import { loadTemplatesFromStorage } from "../utils/templateStorage";
import { loadConfigurationsFromStorage } from "../utils/configurationStorage";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState({
    title: "",
    category: "Offer",
    offerType: "",
    template: "",
    configuration: "",
    start: "",
    end: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("calendarEvents")) || [];
    setEvents(savedEvents);
    setTemplates(loadTemplatesFromStorage());
    setConfigurations(loadConfigurationsFromStorage());
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleDateClick = (arg) => {
    setEventData({
      title: "",
      category: "Offer",
      offerType: "",
      template: "",
      configuration: "",
      start: arg.dateStr,
      end: arg.dateStr,
    });
    setSelectedEventId(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const { jsEvent, event } = clickInfo;

    // Show preview popup
    setPreview({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      offerType: event.extendedProps.offerType,
      template: event.extendedProps.template,
      configuration: event.extendedProps.configuration,
      x: jsEvent.pageX,
      y: jsEvent.pageY,
    });

    // Automatically hide preview after 4 seconds
    setTimeout(() => setPreview(null), 4000);
  };

  const handleEventDoubleClick = (clickInfo) => {
    const { event } = clickInfo;

    setEventData({
      title: event.title,
      category: event.extendedProps.category,
      offerType: event.extendedProps.offerType,
      template: event.extendedProps.template,
      configuration: event.extendedProps.configuration,
      start: event.startStr,
      end: event.endStr,
    });

    setSelectedEventId(event.id);
    setIsModalOpen(true);
  };

  const handleEventSave = () => {
    const updatedEvent = {
      id: selectedEventId || Date.now().toString(),
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      extendedProps: {
        category: eventData.category,
        offerType: eventData.offerType,
        template: eventData.template,
        configuration: eventData.configuration,
      },
    };

    const updatedEvents = selectedEventId
      ? events.map((evt) => (evt.id === selectedEventId ? updatedEvent : evt))
      : [...events, updatedEvent];

    setEvents(updatedEvents);
    setIsModalOpen(false);
    setSelectedEventId(null);
    setEventData({});
  };

  const handleEventDelete = (id) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    setPreview(null);
  };

  return (
    <div>
      <button onClick={handleDateClick} style={{ margin: "1rem" }}>
        New Event
      </button>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDidMount={(info) => {
          info.el.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            handleEventDoubleClick({ event: info.event });
          });
        }}
        eventDrop={(info) => {
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
        }}
      />

      {preview && (
        <div
          style={{
            position: "absolute",
            top: preview.y,
            left: preview.x,
            background: "#fff",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "6px",
            zIndex: 2000,
            width: "250px",
          }}
        >
          <h4>{preview.title}</h4>
          <p>{preview.offerType}</p>
          <p>
            {preview.start} → {preview.end}
          </p>
          <p>Template: {preview.template}</p>
          <p>Config: {preview.configuration}</p>
          <button onClick={() => handleEventDoubleClick({ event: { ...preview } })}>
            Edit
          </button>
          <button onClick={() => handleEventDelete(preview.id)}>Delete</button>
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleEventSave}
        eventData={eventData}
        setEventData={setEventData}
        templates={templates}
        configurations={configurations}
      />
    </div>
  );
};

export default CalendarPage;










