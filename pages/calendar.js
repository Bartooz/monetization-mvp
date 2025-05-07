import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("preview"); // 'preview' or 'edit'
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("calendarEvents");
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const handleDateClick = (info) => {
    setEventData({
      start: info.dateStr,
      end: info.dateStr,
      title: "",
      category: "Offer",
      offerType: "Triple Offer",
    });
    setViewMode("edit");
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    setSelectedEvent(event);
    setViewMode("preview");
    setIsModalOpen(true);
  };

  const handleEventDoubleClick = (clickInfo) => {
    const event = events.find((e) => e.id === clickInfo.event.id);
    setEventData(event);
    setViewMode("edit");
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventData.title) return;
    if (eventData.id) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventData.id ? { ...eventData } : e))
      );
    } else {
      setEvents((prev) => [
        ...prev,
        { ...eventData, id: Date.now().toString() },
      ]);
    }
    setIsModalOpen(false);
    setEventData(null);
  };

  const handleDeleteEvent = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDrop = (info) => {
    const updated = events.map((e) =>
      e.id === info.event.id
        ? {
            ...e,
            start: info.event.startStr,
            end: info.event.endStr || info.event.startStr,
          }
        : e
    );
    setEvents(updated);
  };

  return (
    <div>
      <h1>Calendar</h1>
      <button
        onClick={() => {
          setViewMode("edit");
          setEventData({
            start: new Date().toISOString().slice(0, 16),
            end: new Date().toISOString().slice(0, 16),
            title: "",
            category: "Offer",
            offerType: "Triple Offer",
          });
          setIsModalOpen(true);
        }}
      >
        New Event
      </button>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable
        selectable
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventDidMount={(info) => {
          info.el.addEventListener("dblclick", () =>
            handleEventDoubleClick(info)
          );
        }}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
          setEventData(null);
        }}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        viewMode={viewMode}
        eventData={viewMode === "edit" ? eventData : selectedEvent}
        setEventData={setEventData}
      />
    </div>
  );
};

export default CalendarPage;












