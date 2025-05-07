import Modal from "react-modal";
import React from "react";

const EventModal = ({ isOpen, onClose, onSave, newEvent, setNewEvent }) => {
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Event Modal"
      style={{
        overlay: { zIndex: 1000, backgroundColor: "rgba(0,0,0,0.6)" },
        content: {
          inset: "auto",
          margin: "auto",
          padding: "2rem",
          width: "400px",
          height: "fit-content",
          borderRadius: "8px",
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <h2>Create Event</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>Title:</label>
          <input
            type="text"
            value={newEvent.title}
            onChange={(e) => handleChange("title", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Start:</label>
          <input
            type="datetime-local"
            value={newEvent.start}
            onChange={(e) => handleChange("start", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>End:</label>
          <input
            type="datetime-local"
            value={newEvent.end}
            onChange={(e) => handleChange("end", e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Add</button>
        </div>
      </form>
    </Modal>
  );
};

export default EventModal;



