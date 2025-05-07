import React, { useEffect } from "react";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  eventData,
  setEventData,
  templates,
  configurations,
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

  const handleChange = (field, value) => {
    setEventData({ ...eventData, [field]: value });
  };

  const filteredConfigs =
    configurations?.filter(
      (conf) =>
        conf.category === eventData.category &&
        conf.offerType === eventData.offerType
    ) || [];

  const filteredTemplates =
    templates?.filter((tpl) => tpl.type === eventData.offerType) || [];

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
        <h2>Event Details</h2>

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
          <option value="">-- Select Type --</option>
          <option value="Triple Offer">Triple Offer</option>
          <option value="Timer">Timer</option>
          <option value="Endless">Endless</option>
          <option value="Surprise Offer">Surprise Offer</option>
          <option value="Multi-Sale">Multi-Sale</option>
          <option value="Mystery Offer">Mystery Offer</option>
          <option value="Buy-All">Buy-All</option>
          <option value="Regular Offer">Regular Offer</option>
        </select>

        <label>Template:</label>
        <select
          value={eventData.template || ""}
          onChange={(e) => handleChange("template", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">-- Select Template --</option>
          {filteredTemplates.map((tpl) => (
            <option key={tpl.id} value={tpl.name}>
              {tpl.name}
            </option>
          ))}
        </select>

        <label>Configuration:</label>
        <select
          value={eventData.configuration || ""}
          onChange={(e) => handleChange("configuration", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">-- Select Configuration --</option>
          {filteredConfigs.map((cfg) => (
            <option key={cfg.id} value={cfg.name}>
              {cfg.name}
            </option>
          ))}
        </select>

        <label>Title:</label>
        <input
          type="text"
          value={eventData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Start Date/Time:</label>
        <input
          type="datetime-local"
          value={eventData.start}
          onChange={(e) => handleChange("start", e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>End Date/Time:</label>
        <input
          type="datetime-local"
          value={eventData.end}
          onChange={(e) => handleChange("end", e.target.value)}
          style={{ width: "100%", marginBottom: "1.5rem" }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose} style={{ padding: "0.5rem 1rem" }}>
            Cancel
          </button>
          <button onClick={onSave} style={{ padding: "0.5rem 1rem" }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;


