import React, { useEffect, useState } from "react";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";

const TripleOfferEditor = ({
  template,
  onSave,
  configurations = [],
  isEditMode = false,
}) => {
  const [templateName, setTemplateName] = useState(template?.templateName || "");
  const [offerTitle, setOfferTitle] = useState(template?.title || "");
  const [configurationName, setConfigurationName] = useState(template?.configuration || "");
  const [configSlots, setConfigSlots] = useState([]);

  // Load slot data from selected configuration
  useEffect(() => {
    const config = configurations.find((c) => c.name === configurationName);
    if (config) {
      setConfigSlots(config.slots || []);
    }
  }, [configurationName, configurations]);

  // Save handler
  const handleSave = () => {
    if (!templateName || !offerTitle || !configurationName) return;

    const updatedTemplate = {
      ...template,
      layout: "Vertical",
      offerType: "Triple Offer",
      templateName,
      title: offerTitle,
      configuration: configurationName,
    };

    onSave(updatedTemplate);
  };

  return (
    <div>
      <h2>{isEditMode ? "✏️ Edit Triple Offer Template" : "➕ Create Triple Offer Template"}</h2>

      <div style={{ display: "flex", gap: 40, marginTop: 20, flexWrap: "wrap" }}>
        {/* Left - Form */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <label style={{ fontWeight: "bold" }}>Configuration:</label>
          <select
            value={configurationName}
            onChange={(e) => setConfigurationName(e.target.value)}
            style={{ width: "100%", marginBottom: 20 }}
          >
            <option value="">Select Configuration</option>
            {configurations.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <label style={{ fontWeight: "bold" }}>Offer Title:</label>
          <input
            type="text"
            value={offerTitle}
            onChange={(e) => setOfferTitle(e.target.value)}
            placeholder="Displayed in-game"
            style={{ width: "100%", marginBottom: 20 }}
          />

          <label style={{ fontWeight: "bold" }}>Template Name:</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Internal reference"
            style={{ width: "100%", marginBottom: 20 }}
          />

          <button
            onClick={handleSave}
            disabled={!templateName || !offerTitle || !configurationName}
            style={{
              padding: "8px 16px",
              background: "#333",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Save Template
          </button>
        </div>

        {/* Right - Live Preview */}
        <div
          style={{
            flex: "1",
            background: "#f9f9f9",
            padding: 20,
            borderRadius: 10,
            border: "1px solid #ccc",
            minWidth: "300px",
          }}
        >
          <h4>🔍 Live Preview</h4>
          <TripleOfferPreviewVertical title={offerTitle} slots={configSlots} />
        </div>
      </div>
    </div>
  );
};

export default TripleOfferEditor;










