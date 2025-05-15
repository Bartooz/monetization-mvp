import React, { useEffect, useState } from "react";

const currencyEmoji = {
  Cash: "💵",
  "Gold Bars": "🪙",
  Diamond: "💎",
};

const TripleOfferEditor = ({
  template,
  onSave,
  configurations = [],
  isEditMode = false,
}) => {
  const [templateName, setTemplateName] = useState(template?.templateName || "");
  const [offerTitle, setOfferTitle] = useState(template?.title || "");
  const [configurationName, setConfigurationName] = useState(template?.configuration || "");
  const [configSlots, setConfigSlots] = useState(template?.slots || []);

  useEffect(() => {
    // If template has slots, use them; otherwise, pull from configuration
    if (template?.slots?.length) {
      setConfigSlots(template.slots);
    } else {
      const config = configurations.find((c) => c.name === template?.configuration);
      if (config) {
        setConfigSlots(config.slots || []);
      }
    }
  
    setTemplateName(template?.templateName || "");
    setOfferTitle(template?.title || "");
    setConfigurationName(template?.configuration || "");
  }, [template, configurations]);

  const handleSave = () => {
    if (!templateName || !offerTitle || !configurationName) return;

    const updatedTemplate = {
      templateName,
      title: offerTitle,
      offerType: "Triple Offer",
      layout: "Vertical",
      configuration: configurationName,
      slots: configSlots,
    };

    onSave(updatedTemplate);
  };

  return (
    <div>
      <h2>{isEditMode ? "✏️ Edit Triple Offer Template" : "➕ Create Triple Offer Template"}</h2>

      <div style={{ display: "flex", gap: 40, marginTop: 20, flexWrap: "wrap" }}>
        {/* Form Section */}
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

        {/* Preview Section */}
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
          <h4 style={{ marginBottom: "1rem" }}>🔍 Live Preview</h4>
          <div style={{ fontWeight: "bold", marginBottom: "1rem", textAlign: "center" }}>
            {offerTitle || "Template Title"}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {configSlots.length === 0 && <div>No configuration selected.</div>}
            {configSlots.map((slot, index) => {
              const emoji = currencyEmoji[slot.currency] || "";
              const value = slot.value;
              const bonus = slot.bonus ? ` + ${slot.bonus}` : "";
              const label = `${emoji} ${value}${bonus}`;
              const cta = slot.paid ? `${value} Only!` : "Free!";

              return (
                <div
                  key={index}
                  style={{
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    padding: 16,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: 6 }}>{label}</div>
                  <div
                    style={{
                      background: "#2ecc71",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 4,
                      fontWeight: "bold",
                    }}
                  >
                    {cta}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripleOfferEditor;











