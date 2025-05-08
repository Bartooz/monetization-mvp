import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next");

const EventModal = ({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  handleAddEvent,
  templates = [],
}) => {
  const handleChange = (field, value) => {
    setNewEvent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Event"
      overlayClassName="ReactModal__Overlay"
      className="ReactModal__Content"
    >
      <h2>{newEvent?.id ? "Edit Event" : "Create Event"}</h2>

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
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <label>Category:</label>
      <select
        value={newEvent.category}
        onChange={(e) => handleChange("category", e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        <option value="Mission">Mission</option>
        <option value="Offer">Offer</option>
      </select>

      {newEvent.category === "Offer" && (
        <>
          <label>Offer Template:</label>
          <select
            value={newEvent.template}
            onChange={(e) => handleChange("template", e.target.value)}
            style={{ width: "100%", marginBottom: "1.5rem" }}
          >
            <option value="">Select a Template</option>
            {templates.map((t, idx) => (
              <option key={idx} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </>
      )}

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







