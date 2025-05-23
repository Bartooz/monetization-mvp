import React, { useState, useEffect } from "react";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewCarousel from "./TripleOfferPreviewCarousel";


const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
  Carousel: TripleOfferPreviewCarousel,
};

const layouts = Object.keys(layoutComponents);

export default function TripleOfferEditor({ template, onSave }) {
  const [templateName, setTemplateName] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [layout, setLayout] = useState(layouts[0]);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("liveops-configurations") || "[]");
    setConfigurations(saved);
  }, []);

  useEffect(() => {
    if (template) {
      setTemplateName(template.templateName || "");
      setOfferTitle(template.title || "");
      setConfiguration(template.configuration || "");
      setLayout(template.layout || layouts[0]);
      setEventType(template.eventType || "Offer");
      setOfferType(template.offerType || "Triple Offer");
    }
  }, [template]);

  const handleSave = () => {
    const configObj = configurations.find((c) => c.name === configuration);
    const payload = {
      templateName: templateName.trim(),
      title: offerTitle.trim(),
      configuration: configuration || "",
      layout: layout || "Vertical",
      eventType: eventType || "Offer",
      offerType: offerType || "Triple Offer",
      slots: configObj?.slots || [
        { value: "", bonus: "", currency: "Cash", paid: true },
        { value: "", bonus: "", currency: "Cash", paid: true },
        { value: "", bonus: "", currency: "Cash", paid: true }
      ],
    };
    onSave(payload);
    setTemplateName("");
    setOfferTitle("");
    setConfiguration("");
    setLayout(layouts[0]);
    setEventType("Offer");
    setOfferType("Triple Offer");
  };
  const handleLayoutSwitch = (dir) => {
    const index = layouts.indexOf(layout);
    const newIndex = dir === "next" ? (index + 1) % layouts.length : (index - 1 + layouts.length) % layouts.length;
    setLayout(layouts[newIndex]);
  };

  const LayoutPreview = layoutComponents[layout];
  const selectedConfig = configurations.find((c) => c.name === configuration);
  const slots = selectedConfig?.slots || [
    { value: "", bonus: "", currency: "", paid: false },
    { value: "", bonus: "", currency: "", paid: false },
    { value: "", bonus: "", currency: "", paid: false },
  ];

  return (
    <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
      {/* LEFT: Form */}
      <div style={{ flex: 1 }}>
        <h2>Create New Template</h2>

        <div style={{ marginBottom: 10 }}>
          <label>
            Event Type:{" "}
            <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
              <option>Offer</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Offer Type:{" "}
            <select value={offerType} onChange={(e) => setOfferType(e.target.value)}>
              <option>Triple Offer</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Template Name:
            <input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Offer Title:
            <input
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              style={{ width: "100%", marginTop: 4 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>
            Configuration:
            <select
              value={configuration}
              onChange={(e) => setConfiguration(e.target.value)}
              style={{ width: "100%", marginTop: 4 }}
            >
              <option value="">Select</option>
              {configurations.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button onClick={handleSave} disabled={!templateName || !offerTitle || !configuration}>
          Save Template
        </button>
      </div>

      {/* RIGHT: Layout & Preview */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
          <button onClick={() => handleLayoutSwitch("prev")} style={{ marginRight: 12 }}>
            ◀
          </button>
          <strong>{layout} Layout</strong>
          <button onClick={() => handleLayoutSwitch("next")} style={{ marginLeft: 12 }}>
            ▶
          </button>
        </div>
        <div style={{ border: "1px solid #ccc", borderRadius: 6, padding: 16 }}>
          <LayoutPreview title={offerTitle} slots={slots} />
        </div>
      </div>
    </div>
  );
}















