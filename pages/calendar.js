import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    start: "",
    end: "",
    category: "Offer",
    offerType: "Triple Offer",
  });
  const calendarRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("calendarEvents");
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  const handleDateClick = (arg) => {
    setEventData({
      title: "",
      start: arg.dateStr,
      end: arg.dateStr,
      category: "Offer",
      offerType: "Triple Offer",
    });
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setEventData({
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      category: event.extendedProps.category || "Offer",
      offerType: event.extendedProps.offerType || "Triple Offer",
    });
    setModalOpen(true);
  };

  const handleSaveEvent = () => {
    const newEvent = {
      title: eventData.title,
      start: eventData.start,
      end: eventData.end,
      category: eventData.category,
      offerType: eventData.offerType,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
    setModalOpen(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Calendar</h1>
      <button
        onClick={() => {
          setEventData({
            title: "",
            start: new Date().toISOString().slice(0, 16),
            end: new Date().toISOString().slice(0, 16),
            category: "Offer",
            offerType: "Triple Offer",
          });
          setModalOpen(true);
        }}
        style={{ marginBottom: "1rem", padding: "0.5rem 1rem" }}
      >
        New Event
      </button>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        ref={calendarRef}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
      />

      <EventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveEvent}
        eventData={eventData}
        setEventData={setEventData}
      />
    </div>
  );
};

export default CalendarPage;








