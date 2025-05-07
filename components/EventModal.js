import React, { useEffect, useState } from "react";

// Load templates and configurations from localStorage
const getTemplates = () => JSON.parse(localStorage.getItem("templates")) || [];
const getConfigurations = () => JSON.parse(localStorage.getItem("configurations")) || [];

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  eventData,
  isPreview,
}) => {
  const [data, setData] = useState(eventData || {});
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
      setData(eventData || {});
      setTemplates(getTemplates());
      setConfigurations(getConfigurations());
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen, eventData]);

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const handleSubmit = () => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          zIndex: 1001
        }}
      >
        <h2>{isPreview ? "Event Preview" : data.id ? "Edit Event" : "New Event"}</h2>

        <label>Category:</label>
        <select
          value={data.category || ""}
          onChange={(e) => handleChange("category", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="Offer">Offer</option>
          <option value="Mission">Mission</option>
        </select>

        <label>Offer Type:</label>
        <select
          value={data.offerType || ""}
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
          value={data.templateName || ""}
          onChange={(e) => handleChange("templateName", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Template</option>
          {templates
            .filter((t) => t.type === data.offerType)
            .map((tpl) => (
              <option key={tpl.name} value={tpl.name}>
                {tpl.name}
              </option>
            ))}
        </select>

        <label>Configuration:</label>
        <select
          value={data.configurationName || ""}
          onChange={(e) => handleChange("configurationName", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Configuration</option>
          {configurations
            .filter((c) => c.offerType === data.offerType)
            .map((cfg) => (
              <option key={cfg.name} value={cfg.name}>
                {cfg.name}
              </option>
            ))}
        </select>

        <label>Title:</label>
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Start:</label>
        <input
          type="datetime-local"
          value={data.start || ""}
          onChange={(e) => handleChange("start", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>End:</label>
        <input
          type="datetime-local"
          value={data.end || ""}
          onChange={(e) => handleChange("end", e.target.value)}
          disabled={isPreview}
          style={{ width: "100%", marginBottom: "1.5rem" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
            Close
          </button>

          {!isPreview && (
            <>
              <button
                onClick={handleSubmit}
                style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "#fff" }}
              >
                Save
              </button>
              {data.id && (
                <button
                  onClick={() => onDelete(data.id)}
                  style={{ padding: "0.5rem 1rem", background: "red", color: "#fff" }}
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;


