// components/EventModal.js
import { useEffect, useState } from "react";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  eventData,
  setEventData,
  isPreview,
  isEditing,
}) => {
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      const savedTemplates = JSON.parse(localStorage.getItem("templates")) || [];
      const savedConfigs = JSON.parse(localStorage.getItem("configurations")) || [];
      setTemplates(savedTemplates);
      setConfigurations(savedConfigs);
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  const handleChange = (field, value) => {
    setEventData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          zIndex: 1001,
        }}
      >
        <h2>{isPreview ? "📄 Event Preview" : isEditing ? "✏️ Edit Event" : "➕ New Event"}</h2>

        <label>Title:</label>
        <input
          type="text"
          value={eventData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Category:</label>
        <select
          value={eventData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="Offer">Offer</option>
          <option value="Mission">Mission</option>
        </select>

        <label>Offer Type:</label>
        <select
          value={eventData.offerType || ""}
          onChange={(e) => handleChange("offerType", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="Triple Offer">Triple Offer</option>
          <option value="Timer">Timer</option>
          <option value="Endless">Endless</option>
          <option value="Surprise Offer">Surprise Offer</option>
        </select>

        <label>Template:</label>
        <select
          value={eventData.templateName || ""}
          onChange={(e) => handleChange("templateName", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Template</option>
          {templates.map((t, idx) => (
            <option key={idx} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <label>Configuration:</label>
        <select
          value={eventData.configurationName || ""}
          onChange={(e) => handleChange("configurationName", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Configuration</option>
          {configurations.map((c, idx) => (
            <option key={idx} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Start Time:</label>
        <input
          type="datetime-local"
          value={eventData.start}
          onChange={(e) => handleChange("start", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>End Time:</label>
        <input
          type="datetime-local"
          value={eventData.end}
          onChange={(e) => handleChange("end", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1.5rem" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>Close</button>
          {!isPreview && (
            <>
              {isEditing && (
                <button
                  onClick={() => onDelete(eventData.id)}
                  style={{ backgroundColor: "#ff4d4f", color: "#fff" }}
                >
                  Delete
                </button>
              )}
              <button
                onClick={onSave}
                style={{ backgroundColor: "#4caf50", color: "#fff" }}
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;

