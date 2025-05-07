import React, { useEffect } from "react";

const EventModal = ({ isOpen, onClose, onSave, newEvent, setNewEvent }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setNewEvent({ ...newEvent, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.start && newEvent.end) {
      onSave();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "auto",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          minWidth: "300px",
          zIndex: 1001,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()} // prevent click-through
      >
        <h2>Create Event</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Title:</label>
          <input
            type="text"
            value={newEvent.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Start:</label>
          <input
            type="datetime-local"
            value={newEvent.start || ""}
            onChange={(e) => handleChange("start", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>End:</label>
          <input
            type="datetime-local"
            value={newEvent.end || ""}
            onChange={(e) => handleChange("end", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default EventModal;


