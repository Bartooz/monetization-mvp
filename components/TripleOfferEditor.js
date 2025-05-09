import React, { useState, useEffect } from "react";

const tripleLayouts = [
  "layout-vertical",
  "layout-horizontal",
  "layout-stepped"
];

const layoutStyles = {
  "layout-vertical": { flexDirection: "column", alignItems: "center" },
  "layout-horizontal": { flexDirection: "row", justifyContent: "space-between" },
  "layout-stepped": { flexDirection: "column", alignItems: "center" } // Will fake "stepped" for now
};

const TripleOfferEditor = ({ configurations = [], offerType = "Triple Offer", onSave, template }) => {
  const [templateName, setTemplateName] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [layoutIndex, setLayoutIndex] = useState(0);

  useEffect(() => {
    if (template) {
      setTemplateName(template.name);
      setOfferTitle(template.title);
      setLayoutIndex(tripleLayouts.indexOf(template.layout) || 0);
      const configMatch = configurations.find(c =>
        JSON.stringify(c.slots) === JSON.stringify(template.slots)
      );
      setSelectedConfig(configMatch || null);
    }
  }, [template, configurations]);

  const filteredConfigs = configurations.filter((c) => c.offerType === offerType);

  const currentLayout = tripleLayouts[layoutIndex];

  const handleSave = () => {
    if (!templateName || !offerTitle || !selectedConfig) return;
    const newTemplate = {
      name: templateName,
      title: offerTitle,
      type: offerType,
      layout: currentLayout,
      slots: selectedConfig.slots,
    };
    onSave(newTemplate);
    setTemplateName("");
    setOfferTitle("");
    setSelectedConfig(null);
    setLayoutIndex(0);
  };
  

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* LEFT: Form */}
      <div style={{ flex: 1 }}>
        <h3>Create Triple Offer Template</h3>

        <label>Configuration:</label>
        <select
          value={selectedConfig?.name || ""}
          onChange={(e) => {
            const config = filteredConfigs.find((c) => c.name === e.target.value);
            setSelectedConfig(config || null);
          }}
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
          placeholder="Enter visible title"
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <label>Template Name:</label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Internal name"
          style={{ width: "100%", marginBottom: "1rem" }}
        />

        <button onClick={handleSave} disabled={!templateName || !selectedConfig}>
          Save Template
        </button>
      </div>

      {/* RIGHT: Layout Preview */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <h4>Preview: {currentLayout.replace("layout-", "").toUpperCase()}</h4>

        {/* Arrows */}
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setLayoutIndex((layoutIndex - 1 + tripleLayouts.length) % tripleLayouts.length)}>
            ◀
          </button>
          <button onClick={() => setLayoutIndex((layoutIndex + 1) % tripleLayouts.length)} style={{ marginLeft: "1rem" }}>
            ▶
          </button>
        </div>

        {/* Template Layout */}
        <div
          style={{
            display: "flex",
            ...layoutStyles[currentLayout],
            gap: "1rem",
            padding: "1rem",
            background: "#f4f4f4",
            border: "1px solid #ccc",
            borderRadius: 8,
            minHeight: "200px",
            justifyContent: "center"
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
                minWidth: "120px",
                textAlign: "center"
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 6 }}>{slot.label}</div>
              <div
                style={{
                  background: "#2ecc71",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: 4,
                  fontSize: "0.9rem"
                }}
              >
                {slot.cta}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripleOfferEditor;



