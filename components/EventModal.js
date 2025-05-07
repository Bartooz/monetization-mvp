import React, { useEffect } from "react";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  eventData,
  setEventData,
  templates = [],
  configurations = [],
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const safeData = eventData || {};

  const handleChange = (field, value) => {
    setEventData({ ...safeData, [field]: value });
  };

  const handleTemplateSelect = (id) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setEventData((prev) => ({
        ...prev,
        templateId: id,
        templateTitle: template.name,
        offerType: template.type || prev.offerType,
        category: "Offer",
      }));
    }
  };

  const handleConfigurationSelect = (id) => {
    const config = configurations.find((c) => c.id === id);
    if (config) {
      setEventData((prev) => ({
        ...prev,
        configurationId: id,
        configurationName: config.name,
      }));
    }
  };

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
        <h2>{safeData?.id ? "Edit Event" : "New Event"}</h2>

        <label>Category:</label>
        <select
          value={safeData.category || ""}
          onChange={(e) => handleChange("category", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="Offer">Offer</option>
          <option value="Mission">Mission</option>
        </select>

        <label>Offer Type:</label>
        <select
          value={safeData.offerType || ""}
          onChange={(e) => handleChange("offerType", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select type</option>
          <option value="Triple Offer">Triple Offer</option>
          <option value="Timer">Timer</option>
          <option value="Endless">Endless</option>
          <option value="Surprise Offer">Surprise Offer</option>
        </select>

        <label>Template:</label>
        <select
          value={safeData.templateId || ""}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <label>Configuration:</label>
        <select
          value={safeData.configurationId || ""}
          onChange={(e) => handleConfigurationSelect(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Configuration</option>
          {configurations
            .filter((c) => c.offerType === safeData.offerType)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>

        <label>Title:</label>
        <input
          type="text"
          value={safeData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Start:</label>
        <input
          type="datetime-local"
          value={safeData.start || ""}
          onChange={(e) => handleChange("start", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>End:</label>
        <input
          type="datetime-local"
          value={safeData.end || ""}
          onChange={(e) => handleChange("end", e.target.value)}
          style={{ width: "100%", marginBottom: "1.5rem" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
            Cancel
          </button>
          <button onClick={() => onSave(safeData)} style={{ padding: "0.5rem 1rem" }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;




