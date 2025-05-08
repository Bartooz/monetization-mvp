import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    inset: "unset",
    padding: "2rem",
    borderRadius: "8px",
    backgroundColor: "#fff",
    maxWidth: "500px",
    width: "90%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
};

const EventModal = ({ isOpen, onClose, newEvent, setNewEvent, handleAddEvent }) => {
  const handleChange = (field, value) => {
    setNewEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      contentLabel="Event Modal"
    >
      <h2 style={{ marginTop: 0 }}>Create Event</h2>

      <label>Title:</label>
      <input
        type="text"
        value={newEvent.title}
        onChange={(e) => handleChange("title", e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <label>Start:</label>
      <input
        type="datetime-local"
        value={newEvent.start}
        onChange={(e) => handleChange("start", e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <label>End:</label>
      <input
        type="datetime-local"
        value={newEvent.end}
        onChange={(e) => handleChange("end", e.target.value)}
        style={{ width: "100%", marginBottom: "1.5rem" }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
          Cancel
        </button>
        <button onClick={handleAddEvent} style={{ padding: "0.5rem 1rem" }}>
          Add
        </button>
      </div>
    </Modal>
  );
};

export default EventModal;




