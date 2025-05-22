import React, { useState, useEffect } from "react";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";

const layoutOptions = ["Horizontal", "Vertical"];
const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
};

export default function TripleOfferEditor({ template, onSave }) {
  const [templateName, setTemplateName] = useState("");
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [layoutIndex, setLayoutIndex] = useState(0);
  const [configuration, setConfiguration] = useState("");
  const [configurations, setConfigurations] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("liveops-configurations") || "[]");
      setConfigurations(saved);
    }
  }, []);

  useEffect(() => {
    if (template) {
      setTemplateName(template.templateName || "");
      setTitle(template.title || "");
      setEventType(template.eventType || "Offer");
      setOfferType(template.offerType || "Triple Offer");
      setLayoutIndex(layoutOptions.indexOf(template.layout) || 0);
      setConfiguration(template.configuration || "");
      setSlots(template.slots || []);
    } else {
      setTemplateName("");
      setTitle("");
      setEventType("Offer");
      setOfferType("Triple Offer");
      setLayoutIndex(0);
      setConfiguration("");
      setSlots([]);
    }
  }, [template]);

  useEffect(() => {
    const config = configurations.find(c => c.name === configuration);
    if (config) {
      setSlots(config.slots || []);
    }
  }, [configuration]);

  const handleSave = () => {
    if (!templateName || !title || !configuration) return;
    onSave({
      templateName,
      title,
      eventType,
      offerType,
      layout: layoutOptions[layoutIndex],
      configuration,
      slots,
    });
  };

  const LayoutPreview = layoutComponents[layoutOptions[layoutIndex]];

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, borderRadius: 8, maxWidth: 900 }}>
      <h3>{template ? "Edit Template" : "Create New Template"}</h3>

      <label>Event Type:</label>
      <select value={eventType} onChange={e => setEventType(e.target.value)} style={{ marginBottom: 10 }}>
        <option value="Offer">Offer</option>
        {/* Add more as needed */}
      </select>

      <label>Offer Type:</label>
      <select value={offerType} onChange={e => setOfferType(e.target.value)} style={{ marginBottom: 10 }}>
        <option value="Triple Offer">Triple Offer</option>
        {/* Add more as needed */}
      </select>

      <label>Template Name:</label>
      <input
        value={templateName}
        onChange={e => setTemplateName(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Offer Title:</label>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Configuration:</label>
      <select value={configuration} onChange={e => setConfiguration(e.target.value)} style={{ width: "100%", marginBottom: 10 }}>
        <option value="">-- Select --</option>
        {configurations
          .filter(cfg => cfg.offerType === offerType)
          .map(cfg => (
            <option key={cfg.name} value={cfg.name}>{cfg.name}</option>
          ))}
      </select>

      {/* Layout Switch */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <button
          onClick={() => setLayoutIndex((layoutIndex - 1 + layoutOptions.length) % layoutOptions.length)}
          style={{ marginRight: 10 }}
        >
          ◀
        </button>
        <strong>{layoutOptions[layoutIndex]} Layout</strong>
        <button
          onClick={() => setLayoutIndex((layoutIndex + 1) % layoutOptions.length)}
          style={{ marginLeft: 10 }}
        >
          ▶
        </button>
      </div>

      {/* Live Preview */}
      <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 12 }}>
        <LayoutPreview title={title} slots={slots} />
      </div>

      <button onClick={handleSave} style={{ padding: "10px 20px", fontWeight: "bold" }}>
        {template ? "Update Template" : "Save Template"}
      </button>
    </div>
  );
}














