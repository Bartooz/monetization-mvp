import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

export default function CalendarPage() {
  const calendarRef = useRef();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [templateOptions, setTemplateOptions] = useState([]);
  const [configOptions, setConfigOptions] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(stored);

    const templates = JSON.parse(localStorage.getItem("templates")) || [];
    setTemplateOptions(templates);

    const configs = JSON.parse(localStorage.getItem("configurations")) || [];
    setConfigOptions(configs);
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (selectInfo) => {
    const newEvent = {
      id: Date.now(),
      title: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      category: "Offer",
      offerType: "Triple Offer",
      templateId: "",
      configId: "",
    };
    setSelectedEvent(newEvent);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    setPreviewEvent({ ...event, position: clickInfo.jsEvent });
  };

  const handleEventDoubleClick = (clickInfo) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    setSelectedEvent(event);
    setModalOpen(true);
    setPreviewEvent(null);
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
  };

  const handleSave = (updatedEvent) => {
    setEvents((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === updatedEvent.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = updatedEvent;
        return updated;
      }
      return [...prev, updatedEvent];
    });
    setSelectedEvent(null);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    setPreviewEvent(null);
    setSelectedEvent(null);
    setModalOpen(false);
  };

  const handleNewEvent = () => {
    setSelectedEvent({
      id: Date.now(),
      title: "",
      start: new Date().toISOString().slice(0, 16),
      end: new Date().toISOString().slice(0, 16),
      category: "Offer",
      offerType: "Triple Offer",
      templateId: "",
      configId: "",
    });
    setModalOpen(true);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Calendar</h1>
      <button onClick={handleNewEvent} style={{ marginBottom: "10px" }}>
        New Event
      </button>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        select={handleDateSelect}
        events={events}
        eventClick={handleEventClick}
        eventDidMount={(info) => {
          info.el.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            handleEventDoubleClick(info);
          });
        }}
        eventDrop={handleEventDrop}
        height="auto"
      />

      {previewEvent && (
        <div
          style={{
            position: "absolute",
            top: previewEvent.position.pageY + 10,
            left: previewEvent.position.pageX + 10,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "1rem",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <strong>{previewEvent.title || "No Title"}</strong>
          <p>Category: {previewEvent.category}</p>
          <p>Type: {previewEvent.offerType}</p>
          <p>Start: {previewEvent.start}</p>
          <p>End: {previewEvent.end}</p>
          <div style={{ marginTop: "1rem", display: "flex", gap: "8px" }}>
            <button onClick={() => handleDelete(previewEvent.id)}>Delete</button>
            <button
              onClick={() => {
                setSelectedEvent(previewEvent);
                setModalOpen(true);
                setPreviewEvent(null);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}

      {modalOpen && selectedEvent && (
        <EventModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedEvent(null);
          }}
          onSave={handleSave}
          eventData={selectedEvent}
          setEventData={setSelectedEvent}
          templateOptions={templateOptions}
          configOptions={configOptions}
        />
      )}
    </div>
  );
}












