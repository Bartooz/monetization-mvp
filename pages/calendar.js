import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";


export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Load saved events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("liveops-events");
    if (stored) {
      setEvents(JSON.parse(stored));
    }
  }, []);

  // Save events to localStorage on change
  useEffect(() => {
    localStorage.setItem("liveops-events", JSON.stringify(events));
  }, [events]);

  const handleDateSelect = (selectInfo) => {
    setSelectedEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find((evt) => evt.id === clickInfo.event.id);
    setSelectedEvent(event);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleEventSave = (data) => {
    const newEvent = {
      ...data,
      id: data.id || Date.now().toString(),
    };

    setEvents((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === newEvent.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newEvent;
        return updated;
      }
      return [...prev, newEvent];
    });
  };

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((evt) =>
      evt.id === info.event.id
        ? {
            ...evt,
            start: info.event.startStr,
            end: info.event.endStr,
          }
        : evt
    );
    setEvents(updatedEvents);
  };

  const handleEventRender = (info) => {
    const { event } = info;
    const config = event.extendedProps.configuration;
    const tooltip = document.createElement("div");
    tooltip.innerHTML = `
      <strong>${event.title}</strong><br/>
      Type: ${event.extendedProps.type}<br/>
      Offer Type: ${event.extendedProps.offerType || "N/A"}<br/>
      Config: ${config?.name || "None"}
    `;
    tooltip.style.padding = "6px";
    tooltip.style.fontSize = "13px";
    info.el.setAttribute("title", tooltip.innerText);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>📅 LiveOps Calendar</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={events}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventContent={handleEventRender}
      />

      <EventModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onSave={handleEventSave}
        eventData={selectedEvent}
        isEdit={isEdit}
      />
    </div>
  );
}







