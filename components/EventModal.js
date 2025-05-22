import React, { useEffect, useState } from "react";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";

const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
};

const EventModal = ({ isOpen, onClose, newEvent, setNewEvent, handleAddEvent }) => {
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const stored = JSON.parse(localStorage.getItem("savedTemplates")) || [];
      setTemplateList(stored);

      const matchedTemplate = stored.find((tpl) => tpl.name === newEvent.template);
      setSelectedTemplateData(matchedTemplate || null);
    }
  }, [isOpen, newEvent.template]);

  const handleChange = (field, value) => {
    setNewEvent((prev) => ({ ...prev, [field]: value }));

    if (field === "template") {
      const selected = templateList.find((tpl) => tpl.name === value);
      setSelectedTemplateData(selected || null);
    }
  };

  if (!isOpen) return null;

  const LayoutComponent =
    selectedTemplateData?.offerType === "Triple Offer"
      ? layoutComponents[selectedTemplateData?.layout || "Horizontal"]
      : null;

  return (
    <div
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
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          width: "90%",
          maxWidth: "700px",
          display: "flex",
          gap: "2rem",
        }}
      >
        {/* LEFT SIDE: Fields */}
        <div style={{ flex: 1 }}>
          <h2>{newEvent?.id ? "Edit Event" : "Create Event"}</h2>

          <label>Template</label>
          <select
            value={newEvent.template || ""}
            onChange={(e) => handleChange("template", e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            <option value="">-- Select Template --</option>
            {templateList.map((tpl, idx) => (
              <option key={idx} value={tpl.name}>
                {tpl.name}
              </option>
            ))}
          </select>

          <label>Event Title</label>
          <input
            type="text"
            value={newEvent.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <label>Start</label>
          <input
            type="datetime-local"
            value={newEvent.start || ""}
            onChange={(e) => handleChange("start", e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          <label>End</label>
          <input
            type="datetime-local"
            value={newEvent.end || ""}
            onChange={(e) => handleChange("end", e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />

          {/* Read-only info from template */}
          {selectedTemplateData && (
            <div style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
              <p>
                <strong>Event Type:</strong> {selectedTemplateData.eventType || "N/A"}
              </p>
              <p>
                <strong>Offer Type:</strong> {selectedTemplateData.offerType || "N/A"}
              </p>
              <p>
                <strong>Configuration:</strong> {selectedTemplateData.configuration || "N/A"}
              </p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button onClick={onClose}>Cancel</button>
            <button onClick={handleAddEvent}>Save</button>
          </div>
        </div>

        {/* RIGHT SIDE: Preview */}
        <div style={{ flex: 1 }}>
          {selectedTemplateData?.slots && LayoutComponent && (
            <>
              <h4>{selectedTemplateData.title}</h4>
              <LayoutComponent slots={selectedTemplateData.slots} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;













