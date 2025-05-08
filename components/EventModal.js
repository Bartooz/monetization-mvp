import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

const overlayStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const contentStyles = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "500px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
  inset: "unset", // override react-modal defaults
  position: "relative",
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
      style={{ overlay: overlayStyles, content: contentStyles }}
      contentLabel="Create Event"
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





