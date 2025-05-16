import React, { useState, useEffect } from "react";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";

const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
};

export default function TripleOfferEditor({ template, onSave }) {
  const [templateName, setTemplateName] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [configurationName, setConfigurationName] = useState("");
  const [layout, setLayout] = useState("Horizontal");
  const [configSlots, setConfigSlots] = useState([]);

  useEffect(() => {
    const savedConfigs = JSON.parse(localStorage.getItem("liveops-configurations") || "[]");
    const config = savedConfigs.find((c) => c.name === configurationName);
    if (config) {
      setConfigSlots(config.slots || []);
    }
  }, [configurationName]);

  useEffect(() => {
    if (template) {
      setTemplateName(template.templateName || "");
      setOfferTitle(template.title || "");
      setConfigurationName(template.configuration || "");
      setLayout(template.layout || "Horizontal");
      setConfigSlots(template.slots || []);
    }
  }, [template]);

  const handleSave = () => {
    onSave({
      templateName,
      title: offerTitle,
      configuration: configurationName,
      layout,
      slots: configSlots,
      offerType: "Triple Offer",
    });
  };

  const LayoutPreview = layoutComponents[layout];

  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div style={{ flex: 1 }}>
        <label>Template Name:</label>
        <input value={templateName} onChange={(e) => setTemplateName(e.target.value)} />

        <label>Offer Title:</label>
        <input value={offerTitle} onChange={(e) => setOfferTitle(e.target.value)} />

        <label>Configuration:</label>
        <select value={configurationName} onChange={(e) => setConfigurationName(e.target.value)}>
          <option value="">Select</option>
          {JSON.parse(localStorage.getItem("liveops-configurations") || "[]").map((c, i) => (
            <option key={i} value={c.name}>{c.name}</option>
          ))}
        </select>

        <label>Layout:</label>
        <select value={layout} onChange={(e) => setLayout(e.target.value)}>
          <option value="Horizontal">Horizontal</option>
          <option value="Vertical">Vertical</option>
        </select>

        <button onClick={handleSave} style={{ marginTop: 12 }}>Save Template</button>
      </div>

      <div style={{ flex: 1 }}>
        {LayoutPreview && <LayoutPreview slots={configSlots} title={offerTitle} />}
      </div>
    </div>
  );
}












