import React, { useEffect, useState } from "react";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  eventData,
  setEventData,
  isEditing,
  onDelete,
}) => {
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      // Load templates and configurations from localStorage
      const savedTemplates = JSON.parse(localStorage.getItem("offerTemplates")) || [];
      const savedConfigurations = JSON.parse(localStorage.getItem("configurations")) || [];
      setTemplates(savedTemplates);
      setConfigurations(savedConfigurations);
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleChange = (field, value) => {
    setEventData({ ...eventData, [field]: value });
  };

  const handleSelectConfiguration = (configName) => {
    const selected = configurations.find(c => c.name === configName);
    if (selected) {
      setEventData({
        ...eventData,
        configurationName: selected.name,
        configurationData: selected,
      });
    }
  };

  const handleSelectTemplate = (templateName) => {
    const selected = templates.find(t => t.name === templateName);
    if (selected) {
      setEventData({
        ...eventData,
        templateName: selected.name,
        templateData: selected,
      });
    }
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
          zIndex: 1001,
        }}
      >
        <h2>{isEditing ? "Edit Event" : "New Event"}</h2>

        <label>Category:</label>
        <select
          value={eventData.category || ""}
          onChange={(e) => handleChange("category", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select category</option>
          <option value="Offer">Offer</option>
          <option value="Mission">Mission</option>
        </select>

        {eventData.category === "Offer" && (
          <>
            <label>Offer Type:</label>
            <select
              value={eventData.offerType || ""}
              onChange={(e) => handleChange("offerType", e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <option value="">Select type</option>
              <option value="Triple Offer">Triple Offer</option>
              <option value="Timer">Timer</option>
              <option value="Endless">Endless</option>
              <option value="Surprise Offer">Surprise Offer</option>
            </select>

            <label>Configuration:</label>
            <select
              value={eventData.configurationName || ""}
              onChange={(e) => handleSelectConfiguration(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <option value="">Select configuration</option>
              {configurations
                .filter(c => c.category === "Offer" && c.offerType === eventData.offerType)
                .map(c => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
            </select>

            <label>Template:</label>
            <select
              value={eventData.templateName || ""}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <option value="">Select template</option>
              {templates
                .filter(t => t.type === eventData.offerType)
                .map(t => (
                  <option key={t.name} value={t.name}>
                    {t.name}
                  </option>
                ))}
            </select>
          </>
        )}

        <label>Title:</label>
        <input
          type="text"
          value={eventData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

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

        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
            Cancel
          </button>
          {isEditing && (
            <button
              onClick={() => onDelete(eventData.id)}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#e74c3c", color: "#fff" }}
            >
              Delete
            </button>
          )}
          <button onClick={onSave} style={{ padding: "0.5rem 1rem", backgroundColor: "#2ecc71", color: "#fff" }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

