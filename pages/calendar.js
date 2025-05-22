import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "", start: "", end: "", category: "", templateName: ""
  });
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [selectedEventForPreview, setSelectedEventForPreview] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEvents(JSON.parse(localStorage.getItem("calendarEvents") || "[]"));
      setTemplates(JSON.parse(localStorage.getItem("liveops-templates") || "[]"));
      setConfigurations(JSON.parse(localStorage.getItem("liveops-configurations") || "[]"));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;

    const fullTemplate = templates.find(t => t.templateName === newEvent.templateName) || null;

    const eventToSave = {
      ...newEvent,
      template: fullTemplate,
    };

    const updatedEvents = newEvent.id
      ? events.map(evt => (evt.id === newEvent.id ? eventToSave : evt))
      : [...events, { ...eventToSave, id: Date.now() }];

    setEvents(updatedEvents);
    setIsModalOpen(false);
    setNewEvent({ title: "", start: "", end: "", category: "", templateName: "" });
  };

  const handleEventDrop = (info) => {
    const updated = events.map(evt =>
      evt.id == info.event.id
        ? { ...evt, start: info.event.startStr, end: info.event.endStr }
        : evt
    );
    setEvents(updated);
  };

  const handleEventClick = (info) => {
    const matched = events.find(e => e.id == info.event.id);
    if (matched) setSelectedEventForPreview(matched);
  };

  const handleEditFromPreview = () => {
    setNewEvent(selectedEventForPreview);
    setIsModalOpen(true);
    setSelectedEventForPreview(null);
  };

  const handleDeleteFromPreview = () => {
    if (!selectedEventForPreview) return;
    setEvents(events.filter(e => e.id !== selectedEventForPreview.id));
    setSelectedEventForPreview(null);
  };

  const handleEventDidMount = (info) => {
    info.el.addEventListener("dblclick", () => {
      const matched = events.find(e => e.id == info.event.id);
      if (matched) {
        setNewEvent({ ...matched }); // ensures latest date
        setIsModalOpen(true);
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".fc-event")) {
        setSelectedEventForPreview(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() => {
          setNewEvent({ title: "", start: "", end: "", category: "", templateName: "" });
          setIsModalOpen(true);
        }}
        style={{ marginBottom: 12 }}
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
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        eventDidMount={handleEventDidMount}
      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        templates={templates}
        configurations={configurations}
        showPreview={true}
        setShowPreview={() => {}}
      />

      {selectedEventForPreview && (
        <div style={{
          position: "fixed", top: "100px", right: "20px",
          background: "#fff", border: "1px solid #ccc", padding: "16px",
          width: 300, borderRadius: 8, zIndex: 1000
        }}>
          <h3>{selectedEventForPreview.title}</h3>
          <p><strong>Start:</strong> {selectedEventForPreview.start}</p>
          <p><strong>End:</strong> {selectedEventForPreview.end}</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            <button onClick={handleEditFromPreview}>Edit</button>
            <button onClick={handleDeleteFromPreview}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}























