import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import EventModal from "../components/EventModal";
import TripleOfferPreviewHorizontal from "../components/TripleOfferPreviewHorizontal";
import TripleOfferPreviewVertical from "../components/TripleOfferPreviewVertical";

const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
};

Modal.setAppElement("#__next");

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewEvent, setPreviewEvent] = useState(null);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("calendarEvents") || "[]");
    setEvents(storedEvents);

    const savedTemplates = JSON.parse(localStorage.getItem("liveops-templates") || "[]");
    setTemplates(savedTemplates);
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return;

    const updatedEvents = newEvent.id
      ? events.map((evt) => (evt.id === newEvent.id ? newEvent : evt))
      : [...events, { ...newEvent, id: Date.now() }];

    setEvents(updatedEvents);
    setIsModalOpen(false);
    setNewEvent({ title: "", start: "", end: "" });
  };

  const handleEventDrop = (info) => {
    const updated = events.map((evt) =>
      evt.id === info.event.id
        ? { ...evt, start: info.event.startStr, end: info.event.endStr }
        : evt
    );
    setEvents(updated);
  };

  const calendarRef = useRef();

  const handleClickOutside = (e) => {
    if (!e.target.closest(".preview-box")) {
      setPreviewEvent(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setNewEvent({ title: "", start: "", end: "" });
          setIsModalOpen(true);
        }}
        style={{ marginBottom: "10px", padding: "10px 20px", fontWeight: "bold" }}
      >
        New Event
      </button>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        eventDidMount={(info) => {
          info.el.addEventListener("dblclick", () => {
            const match = events.find((e) => e.id === info.event.id);
            if (match) {
              setNewEvent(match);
              setIsModalOpen(true);
              setPreviewEvent(null);
            }
          });

          info.el.addEventListener("click", () => {
            const event = events.find((e) => e.id === info.event.id);
            const template = templates.find((t) =>
              t.templateName === event.template ||
              (event.category === "Offer" && t.templateName === event?.template)
            );
            if (!template) {
              setPreviewEvent(null);
              return;
            }

            const layout = template.layout || "Horizontal";
            const Layout = layoutComponents[layout];

            let slots = template.slots || [];

            if (slots.length === 0 && template.configuration) {
              const configs = JSON.parse(localStorage.getItem("liveops-configurations") || "[]");
              const config = configs.find((c) => c.name === template.configuration);
              if (config) slots = config.slots || [];
            }

            const box = (
              <div className="preview-box" style={{
                position: "absolute",
                top: info.el.getBoundingClientRect().top + 30,
                left: info.el.getBoundingClientRect().left,
                zIndex: 9999,
                background: "#fff",
                border: "1px solid #ccc",
                padding: 10,
                borderRadius: 8,
                boxShadow: "0 0 8px rgba(0,0,0,0.2)",
                minWidth: 300,
              }}>
                <h4>{template.title}</h4>
                <Layout slots={slots} title={template.title} />
                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={() => {
                      setNewEvent(event);
                      setIsModalOpen(true);
                      setPreviewEvent(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const updated = events.filter((e) => e.id !== event.id);
                      setEvents(updated);
                      setPreviewEvent(null);
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );

            setPreviewEvent(box);
          });
        }}
      />

      {previewEvent}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        templates={templates}
      />
    </>
  );
}




















