import React, { useEffect } from "react";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  eventData,
  setEventData,
  templateOptions = [],
  configOptions = [],
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

  if (!isOpen || !eventData) return null;

  const handleChange = (field, value) => {
    setEventData({ ...eventData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(eventData);
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
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "600px",
          zIndex: 1001,
        }}
      >
        <h2>{eventData?.id ? "Edit Event" : "New Event"}</h2>

        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={eventData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
            required
          />

          <label>Category:</label>
          <select
            value={eventData.category || ""}
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
            <option value="">Select Offer Type</option>
            <option value="Triple Offer">Triple Offer</option>
            <option value="Timer">Timer</option>
            <option value="Endless">Endless</option>
            <option value="Surprise Offer">Surprise Offer</option>
          </select>

          <label>Template:</label>
          <select
            value={eventData.templateId || ""}
            onChange={(e) => handleChange("templateId", e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            <option value="">Select Template</option>
            {templateOptions.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name || `Template ${tpl.id}`}
              </option>
            ))}
          </select>

          <label>Configuration:</label>
          <select
            value={eventData.configId || ""}
            onChange={(e) => handleChange("configId", e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            <option value="">Select Configuration</option>
            {configOptions
              .filter((cfg) => cfg.offerType === eventData.offerType)
              .map((cfg) => (
                <option key={cfg.id} value={cfg.id}>
                  {cfg.name || `Config ${cfg.id}`}
                </option>
              ))}
          </select>

          <label>Start:</label>
          <input
            type="datetime-local"
            value={eventData.start || ""}
            onChange={(e) => handleChange("start", e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <label>End:</label>
          <input
            type="datetime-local"
            value={eventData.end || ""}
            onChange={(e) => handleChange("end", e.target.value)}
            style={{ width: "100%", marginBottom: "1.5rem" }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button type="button" onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: "0.5rem 1rem" }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
