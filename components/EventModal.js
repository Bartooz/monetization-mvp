import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

const EventModal = ({ isOpen, onClose, newEvent, setNewEvent, handleAddEvent }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Event"
      overlayClassName="ReactModal__Overlay"
      className="ReactModal__Content"
    >
      <h2>Create Event</h2>

      <label>Title:</label>
      <input
        type="text"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <label>Start:</label>
      <input
        type="datetime-local"
        value={newEvent.start}
        onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <label>End:</label>
      <input
        type="datetime-local"
        value={newEvent.end}
        onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
        style={{ width: "100%", marginBottom: "1.5rem" }}
      />

<div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
  <button onClick={onClose}>Cancel</button>
  <button onClick={handleAddEvent}>
    {newEvent.id ? "Save" : "Add"}
  </button>
</div>
    </Modal>
  );
};

export default EventModal;







