import { useEffect, useState } from "react";
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
  const [editingIndex, setEditingIndex] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);

  // 🧠 Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("liveops-events");
    if (saved) {
      setEvents(JSON.parse(saved, (key, value) => {
        if (["start", "end"].includes(key)) {
          return new Date(value);
        }
        return value;
      }));
    }
  }, []);

  // 💾 Save to localStorage
  useEffect(() => {
    localStorage.setItem("liveops-events", JSON.stringify(events));
  }, [events]);

  const openNewModal = () => {
    setEventType("Offers");
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
      setEventType(events[index].title);
      setStartDate(new Date(events[index].start));
      setEndDate(new Date(events[index].end));
      setEditingIndex(index);
      setShowModal(true);
    }
  };

  const handleAddOrUpdateEvent = () => {
    const newEvent = {
      title: eventType,
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
      setPreviewEvent({
        title: eventInfo.event.title,
        start: eventInfo.event.start,
        end: eventInfo.event.end,
      });
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
        eventClick={handleEventClick}
        eventDidMount={(info) => {
          info.el.addEventListener("dblclick", () => openEditModal(info));
        }}
      />

      {/* 🔍 Preview Popup with Delete */}
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

      {/* 🧾 Modal */}
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
            <h2 style={{ marginBottom: 20 }}>
              {editingIndex !== null ? "Edit Event" : "Create New Event"}
            </h2>

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
              />
            </label>

            <label style={{ display: "block", marginBottom: 20 }}>
              End Date & Time:
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                dateFormat="Pp"
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
                onClick={handleAddOrUpdateEvent}
                style={{
                  padding: "8px 16px",
                  background: "black",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                {editingIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





