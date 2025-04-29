// pages/calendar.js
// FINAL fix to remove broken @fullcalendar/common/main.css

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '@fullcalendar/daygrid/index.css';
import '@fullcalendar/timegrid/index.css';

Modal.setAppElement("#__next"); // Needed for accessibility

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventType, setEventType] = useState("Offers");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const openModal = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setEventType("Offers");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAddEvent = () => {
    setEvents([
      ...events,
      {
        title: eventType,
        start: startDate,
        end: endDate,
        allDay: false,
      },
    ]);
    closeModal();
  };

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1>🔥 LiveOps Calendar 🔥</h1>

      <button
        onClick={openModal}
        style={{
          marginBottom: 20,
          padding: "10px 20px",
          fontSize: 16,
          background: "black",
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
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Event"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "30px",
            maxWidth: "400px",
            width: "100%",
          },
        }}
      >
        <h2>Create New Event</h2>

        <label style={{ display: "block", marginBottom: 10 }}>
          Type:
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          >
            <option value="Offers">Offers</option>
            <option value="Missions">Missions</option>
          </select>
        </label>

        <label style={{ display: "block", marginBottom: 10 }}>
          Start Date & Time:
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="date-picker"
            style={{ width: "100%" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 20 }}>
          End Date & Time:
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="date-picker"
            style={{ width: "100%" }}
          />
        </label>

        <button
          onClick={handleAddEvent}
          style={{
            padding: "8px 16px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 5,
            marginRight: 10,
            cursor: "pointer",
          }}
        >
          Add Event
        </button>
        <button
          onClick={closeModal}
          style={{
            padding: "8px 16px",
            background: "#ccc",
            color: "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
}


