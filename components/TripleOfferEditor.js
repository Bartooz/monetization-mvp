import React, { useState, useEffect } from "react";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewCarousel from "./TripleOfferPreviewCarousel";
import TripleOfferPreviewVerticalCarousel from "./TripleOfferPreviewVerticalCarousel";
import PhonePreviewWrapper from "./PhonePreviewWrapper";

const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
  Carousel: TripleOfferPreviewCarousel,
  "Vertical Carousel": TripleOfferPreviewVerticalCarousel,
};

const layouts = Object.keys(layoutComponents);

export default function TripleOfferEditor({ template, onSave, onCancel }) {
  const [templateName, setTemplateName] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [layout, setLayout] = useState(layouts[0]);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${BASE_URL}/api/configurations`)
      .then((res) => res.json())
      .then(setConfigurations)
      .catch((err) => {
        console.error("Failed to fetch configurations", err);
        setConfigurations([]);
      });
  }, []);

  useEffect(() => {
    if (template) {
      setTemplateName(template.template_name || "");
      setOfferTitle(template.title || "");
      setConfiguration(template.configuration || "");
      setLayout(template.layout || layouts[0]);
      setEventType(template.event_type || "Offer");
      setOfferType(template.offer_type || "Triple Offer");
    } else {
      setTemplateName("");
      setOfferTitle("");
      setConfiguration("");
      setLayout("Vertical");
      setEventType("Offer");
      setOfferType("Triple Offer");
    }
  }, [template]);

  const filteredConfigurations = configurations.filter(
    (c) => c.event_type === eventType && c.offer_type === offerType
  );

  const handleSave = () => {
    const configObj = configurations.find((c) => c.config_name === configuration);
    const payload = {
      template_name: templateName.trim(),
      title: offerTitle.trim(),
      configuration: configuration || "",
      layout: layout || "Vertical",
      event_type: eventType || "Offer",
      offer_type: offerType || "Triple Offer",
      slots: configObj?.slots || [
        { value: "", bonus: "", currency: "Cash", paid: true },
        { value: "", bonus: "", currency: "Cash", paid: true },
        { value: "", bonus: "", currency: "Cash", paid: true },
      ],
    };
    onSave(payload);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleLayoutSwitch = (dir) => {
    const index = layouts.indexOf(layout);
    const newIndex = dir === "next" ? (index + 1) % layouts.length : (index - 1 + layouts.length) % layouts.length;
    setLayout(layouts[newIndex]);
  };

  const LayoutPreview = layoutComponents[layout];
  const selectedConfig = configurations.find((c) => c.config_name === configuration);
  const slots = selectedConfig?.slots || [
    { value: "", bonus: "", currency: "", paid: false },
    { value: "", bonus: "", currency: "", paid: false },
    { value: "", bonus: "", currency: "", paid: false },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      alignItems: "flex-start",
      gap: "40px",
      width: "100%",
    }}>
      <div style={{ flex: 1 }}>
        <h2>{template ? "Edit Template" : "Create New Template"}</h2>

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
              disabled={!!template}
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
              {filteredConfigurations.map((c) => (
                <option key={c.config_name} value={c.config_name}>
                  {c.config_name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button onClick={handleSave}>
          {template ? "Update Template" : "Save Template"}
        </button>

        {template && (
          <button style={{ marginLeft: 10 }} onClick={handleCancel}>
            Cancel Edit
          </button>
        )}
      </div>

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
        <PhonePreviewWrapper>
          <LayoutPreview title={offerTitle} slots={slots} />
        </PhonePreviewWrapper>
      </div>
    </div>
  );
}

















