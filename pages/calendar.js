import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState("Offers");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

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
    setShowModal(false);
  };

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1>LiveOps Calendar</h1>

      <button
        onClick={() => setShowModal(true)}
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
      />

      {/* Custom Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 30,
              borderRadius: 8,
              maxWidth: 400,
              width: "90%",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>Create New Event</h2>

            <label style={{ display: "block", marginBottom: 10 }}>
              Event Type:
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
                style={{ width: "100%" }}
              />
            </label>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 12px",
                  background: "#ccc",
                  color: "black",
                  border: "none",
                  borderRadius: 4,
                  marginRight: 10,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                style={{
                  padding: "8px 16px",
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



