import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState("Offers");
  const [offerType, setOfferType] = useState("Regular Offer");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [editingIndex, setEditingIndex] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedConfig, setSelectedConfig] = useState("");

  const [templateOptions, setTemplateOptions] = useState([]);
  const [configOptions, setConfigOptions] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("liveops-events");
    if (savedEvents) {
      setEvents(
        JSON.parse(savedEvents, (key, value) => {
          if (["start", "end"].includes(key)) return new Date(value);
          return value;
        })
      );
    }

    const savedTemplates = localStorage.getItem("liveops-templates");
    if (savedTemplates) setTemplateOptions(JSON.parse(savedTemplates));

    const savedConfigs = localStorage.getItem("liveops-configurations");
    if (savedConfigs) setConfigOptions(JSON.parse(savedConfigs));
  }, []);

  useEffect(() => {
    localStorage.setItem("liveops-events", JSON.stringify(events));
  }, [events]);

  const openNewModal = () => {
    setEventType("Offers");
    setOfferType("Regular Offer");
    setSelectedTemplate("");
    setSelectedConfig("");
    setStartDate(new Date());
    setEndDate(new Date());
    setEditingIndex(null);
    setShowModal(true);
  };

  const openEditModal = (eventInfo) => {
    const index = events.findIndex(
      (e) => e.start.toString() === eventInfo.event.start.toString()
    );
    if (index !== -1) {
      const e = events[index];
      setEventType(e.type || "Offers");
      setOfferType(e.offerType || "Regular Offer");
      setSelectedTemplate(e.template || "");
      setSelectedConfig(e.configuration || "");
      setStartDate(new Date(e.start));
      setEndDate(new Date(e.end));
      setEditingIndex(index);
      setShowModal(true);
    }
  };

  const handleAddOrUpdateEvent = () => {
    const newEvent = {
      title:
        eventType === "Offers"
          ? `${offerType} (${selectedTemplate?.name || selectedTemplate || "No Template"})`
          : eventType,
      type: eventType,
      offerType: eventType === "Offers" ? offerType : null,
      template: eventType === "Offers" ? selectedTemplate : null,
      configuration: eventType === "Offers" ? selectedConfig : null,
      start: startDate,
      end: endDate,
      allDay: false,
    };

    if (editingIndex !== null) {
      const updated = [...events];
      updated[editingIndex] = newEvent;
      setEvents(updated);
    } else {
      setEvents([...events, newEvent]);
    }

    setShowModal(false);
    setEditingIndex(null);
  };

  const handleEventClick = (eventInfo) => {
    const index = events.findIndex(
      (e) => e.start.toString() === eventInfo.event.start.toString()
    );
    if (index !== -1) {
      setPreviewEvent(events[index]);
      setPreviewIndex(index);
      setTimeout(() => {
        setPreviewEvent(null);
        setPreviewIndex(null);
      }, 3000);
    }
  };

  const handleDelete = () => {
    if (previewIndex !== null) {
      const updated = [...events];
      updated.splice(previewIndex, 1);
      setEvents(updated);
      setPreviewEvent(null);
      setPreviewIndex(null);
    }
  };

  const handleEventDrop = (info) => {
    const index = events.findIndex(
      (e) => e.start.toString() === info.oldEvent.start.toString()
    );
    if (index !== -1) {
      const updated = [...events];
      updated[index] = {
        ...updated[index],
        start: info.event.start,
        end: info.event.end,
      };
      setEvents(updated);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1>LiveOps Calendar</h1>

      <button
        onClick={openNewModal}
        style={{
          marginBottom: 20,
          padding: "10px 20px",
          fontSize: 16,
          background: "#111",
          color: "white",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        ➕ New Event
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
        editable={true}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        eventDidMount={(info) => {
          info.el.addEventListener("dblclick", () => openEditModal(info));
        }}
      />

      {previewEvent && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 20,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            zIndex: 2000,
          }}
        >
          <strong>{previewEvent.title}</strong>
          <div>Start: {previewEvent.start.toLocaleString()}</div>
          <div>End: {previewEvent.end.toLocaleString()}</div>
          {previewEvent.template && (
            <div>
              Template:{" "}
              {typeof previewEvent.template === "object"
                ? previewEvent.template.name
                : previewEvent.template}
            </div>
          )}
          {previewEvent.configuration && (
            <div>Configuration: {previewEvent.configuration}</div>
          )}
          <button
            onClick={handleDelete}
            style={{
              marginTop: 10,
              background: "crimson",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      <EventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddOrUpdateEvent}
        eventType={eventType}
        setEventType={setEventType}
        offerType={offerType}
        setOfferType={setOfferType}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        selectedConfig={selectedConfig}
        setSelectedConfig={setSelectedConfig}
        templateOptions={templateOptions}
        configOptions={configOptions}
        editing={editingIndex !== null}
      />
    </div>
  );
}






