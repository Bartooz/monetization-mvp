import React, { useState, useEffect } from "react";

const EventModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    if (isOpen) {
      // Clear inputs every time modal opens
      setTitle("");
      setStart("");
      setEnd("");
    }
  }, [isOpen]);

  const handleAdd = () => {
    if (!title || !start || !end) return;
    onAdd({ title, start, end });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "320px",
        }}
      >
        <h2>Create Event</h2>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Start:</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>End:</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={{ width: "100%", marginBottom: "1.5rem" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

