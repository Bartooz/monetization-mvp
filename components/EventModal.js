import React, { useEffect, useState } from "react";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  viewMode,
  eventData,
  setEventData,
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

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  const handleChange = (field, value) => {
    if (setEventData) {
      setEventData({ ...eventData, [field]: value });
    }
  };

  if (!isOpen || !eventData) return null;

  const {
    id,
    title,
    category,
    offerType,
    start,
    end,
    templateId,
    configurationId,
  } = eventData;

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
        {viewMode === "preview" ? (
          <>
            <h2>Event Preview</h2>
            <p><strong>Title:</strong> {title}</p>
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Offer Type:</strong> {offerType}</p>
            <p><strong>Start:</strong> {start}</p>
            <p><strong>End:</strong> {end}</p>
            <p><strong>Template:</strong> {templateId}</p>
            <p><strong>Configuration:</strong> {configurationId}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={() => onDelete(id)}>Delete</button>
              <button
                onClick={() => {
                  setEventData(eventData);
                  onClose(); // close preview
                  setTimeout(() => {
                    // open modal in edit mode
                    const editBtn = document.querySelector("#edit-trigger");
                    if (editBtn) editBtn.click();
                  }, 100);
                }}
              >
                Edit
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>{id ? "Edit Event" : "New Event"}</h2>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => handleChange("category", e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <option value="Offer">Offer</option>
              <option value="Mission">Mission</option>
            </select>

            <label>Offer Type:</label>
            <select
              value={offerType || ""}
              onChange={(e) => handleChange("offerType", e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <option value="Triple Offer">Triple Offer</option>
              <option value="Timer">Timer</option>
              <option value="Endless">Endless</option>
              <option value="Surprise Offer">Surprise Offer</option>
            </select>

            <label>Title:</label>
            <input
              type="text"
              value={title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            />

            <label>Start:</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => handleChange("start", e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            />

            <label>End:</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => handleChange("end", e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            />

            <label>Template:</label>
            <select
              value={templateId || ""}
              onChange={(e) => handleChange("templateId", e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <option value="">-- Select Template --</option>
              {templates.map((tpl) => (
                <option key={tpl.name} value={tpl.name}>
                  {tpl.name}
                </option>
              ))}
            </select>

            <label>Configuration:</label>
            <select
              value={configurationId || ""}
              onChange={(e) => handleChange("configurationId", e.target.value)}
              style={{ width: "100%", marginBottom: "1rem" }}
            >
              <option value="">-- Select Configuration --</option>
              {configurations
                .filter((cfg) => cfg.type === offerType)
                .map((cfg) => (
                  <option key={cfg.name} value={cfg.name}>
                    {cfg.name}
                  </option>
                ))}
            </select>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button onClick={onClose}>Cancel</button>
              <button onClick={onSave}>Save</button>
            </div>
          </>
        )}
        <button id="edit-trigger" style={{ display: "none" }} onClick={() => {
          setTimeout(() => {
            setEventData(eventData);
            setIsModalOpen(true);
          }, 0);
        }}>Edit</button>
      </div>
    </div>
  );
};

export default EventModal;
