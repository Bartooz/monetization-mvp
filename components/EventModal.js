import React, { useEffect, useState } from "react";

const EventModal = ({
  isOpen,
  isEditing,
  eventData,
  setEventData,
  onClose,
  onSave,
  onDelete,
}) => {
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");

      // Load from localStorage
      const storedTemplates = JSON.parse(localStorage.getItem("liveops-templates")) || [];
      const storedConfigs = JSON.parse(localStorage.getItem("liveops-configurations")) || [];
      setTemplates(storedTemplates);
      setConfigurations(storedConfigs);
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen || !eventData) return null;

  const handleChange = (field, value) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredConfigurations = configurations.filter(
    (c) => c.category === eventData.category && c.offerType === eventData.offerType
  );

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
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
        }}
      >
        <h2>{isEditing ? "Edit Event" : "New Event"}</h2>

        <label>Title:</label>
        <input
          type="text"
          value={eventData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Category:</label>
        <select
          value={eventData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="Offer">Offer</option>
          <option value="Mission">Mission</option>
        </select>

        <label>Offer Type:</label>
        <select
          value={eventData.offerType || ""}
          onChange={(e) => handleChange("offerType", e.target.value)}
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
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Template</option>
          {templates
            .filter((t) => t.type === eventData.offerType)
            .map((template) => (
              <option key={template.name} value={template.name}>
                {template.name}
              </option>
            ))}
        </select>

        <label>Configuration:</label>
        <select
          value={eventData.configurationName || ""}
          onChange={(e) => handleChange("configurationName", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Configuration</option>
          {filteredConfigurations.map((config) => (
            <option key={config.name} value={config.name}>
              {config.name}
            </option>
          ))}
        </select>

        <label>Start:</label>
        <input
          type="datetime-local"
          value={eventData.start}
          onChange={(e) => handleChange("start", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>End:</label>
        <input
          type="datetime-local"
          value={eventData.end}
          onChange={(e) => handleChange("end", e.target.value)}
          style={{ width: "100%", marginBottom: "1.5rem" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          {isEditing && (
            <button
              onClick={() => onDelete(eventData.id)}
              style={{ backgroundColor: "red", color: "white", padding: "0.5rem 1rem" }}
            >
              Delete
            </button>
          )}
          <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
            Cancel
          </button>
          <button
            onClick={() => onSave(eventData)}
            style={{ backgroundColor: "#0070f3", color: "white", padding: "0.5rem 1rem" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
