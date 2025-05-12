import React, { useState, useEffect } from "react";

const TripleOfferEditor = ({
  configurations = [],
  offerType = "Triple Offer",
  onSave,
  template,
}) => {
  const [templateName, setTemplateName] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [selectedConfigName, setSelectedConfigName] = useState("");

  useEffect(() => {
    if (template) {
      setTemplateName(template.name || "");
      setOfferTitle(template.title || "");
      setSelectedConfigName(template.configName || "");
    }
  }, [template]);

  const filteredConfigs = configurations.filter(
    (c) => c.offerType === offerType
  );
  const selectedConfig = filteredConfigs.find(
    (c) => c.name === selectedConfigName
  );

  const handleSave = () => {
    if (!templateName || !offerTitle || !selectedConfig) return;

    const newTemplate = {
      name: templateName,
      title: offerTitle,
      type: offerType,
      layout: "vertical", // Fixed layout
      configName: selectedConfig.name,
      slots: selectedConfig.slots,
    };

    onSave(newTemplate);
    setTemplateName("");
    setOfferTitle("");
    setSelectedConfigName("");
  };

  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <h3>{template ? "Edit" : "Create"} Triple Offer Template</h3>

        <label>Configuration:</label>
        <select
          value={selectedConfigName}
          onChange={(e) => setSelectedConfigName(e.target.value)}
          style={{ width: "100%", marginBottom: "1rem" }}
        >
          <option value="">Select Configuration</option>
          {filteredConfigs.map((c, i) => (
            <option key={i} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <label>Offer Title:</label>
        <input
          type="text"
          value={offerTitle}
          onChange={(e) => setOfferTitle(e.target.value)}
          placeholder="Displayed in-game"
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Template Name:</label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Internal reference"
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <button onClick={handleSave} disabled={!templateName || !selectedConfig}>
          Save Template
        </button>
      </div>

      {/* Right-side Preview */}
      <div
        style={{
          flex: 1,
          background: "#fafafa",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h4 style={{ textAlign: "center" }}>🔍 Live Preview</h4>
        <div style={{ fontWeight: "bold", marginBottom: "0.5rem", textAlign: "center" }}>
          {offerTitle || "Template Title"}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
            alignItems: "center",
          }}
        >
          {selectedConfig?.slots?.map((slot, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                padding: "1rem",
                border: "1px solid #bbb",
                borderRadius: 6,
                minWidth: "200px",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 6 }}>{slot.label}</div>
              <div
                style={{
                  background: "#2ecc71",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: 4,
                  fontSize: "0.9rem",
                }}
              >
                {slot.cta}
              </div>
            </div>
          )) || (
            <div style={{ opacity: 0.6 }}>No configuration selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripleOfferEditor;









