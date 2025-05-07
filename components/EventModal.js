import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "2rem",
    borderRadius: "8px",
    background: "#fff",
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
};

Modal.setAppElement("#__next");

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
      style={customStyles}
      contentLabel="Event Modal"
    >
      <h2>Create Event</h2>

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



