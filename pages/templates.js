import { useEffect, useState } from "react";
import TemplateCanvas from "../components/TemplateCanvas";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [title, setTitle] = useState("");
  const [cta, setCta] = useState("");
  const [slots, setSlots] = useState([
    { label: "", bonus: "" },
    { label: "", bonus: "" },
    { label: "", bonus: "" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("liveops-templates");
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("liveops-templates", JSON.stringify(templates));
  }, [templates]);

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name.");
      return;
    }

    const newTemplate = {
      name: templateName.trim(),
      type: "MultiSale",
      layout: "Triple",
      title: title.trim(),
      cta: cta.trim(),
      slots: slots.map((s) => ({
        label: s.label.trim(),
        bonus: s.bonus.trim(),
      })),
    };

    setTemplates([...templates, newTemplate]);
    setTemplateName("");
    setTitle("");
    setCta("");
    setSlots([
      { label: "", bonus: "" },
      { label: "", bonus: "" },
      { label: "", bonus: "" },
    ]);
  };

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: 20 }}>🎨 Triple Offer Template Editor</h2>

      <div style={{ display: "flex", gap: 60 }}>
        {/* Left: Form */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 20 }}>
            <label>
              Template Name:
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. Red, White & Blue"
                style={{
                  marginLeft: 10,
                  padding: 8,
                  width: "70%",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>
              Title Text:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  marginLeft: 10,
                  padding: 8,
                  width: "70%",
                }}
              />
            </label>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>
              CTA Text:
              <input
                type="text"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                style={{
                  marginLeft: 10,
                  padding: 8,
                  width: "70%",
                }}
              />
            </label>
          </div>

          <div>
            <h4>Offer Slots:</h4>
            {slots.map((slot, idx) => (
              <div key={idx} style={{ marginBottom: 12 }}>
                <label>
                  Label:
                  <input
                    type="text"
                    value={slot.label}
                    onChange={(e) =>
                      handleSlotChange(idx, "label", e.target.value)
                    }
                    style={{ marginLeft: 10, padding: 6, width: 120 }}
                  />
                </label>

                <label style={{ marginLeft: 20 }}>
                  Bonus:
                  <input
                    type="text"
                    value={slot.bonus}
                    onChange={(e) =>
                      handleSlotChange(idx, "bonus", e.target.value)
                    }
                    style={{ marginLeft: 10, padding: 6, width: 160 }}
                  />
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveTemplate}
            style={{
              marginTop: 30,
              padding: "10px 20px",
              background: "#111",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: "bold",
            }}
          >
            Save Template
          </button>
        </div>

        {/* Right: Live Preview */}
        <div style={{ flex: 1 }}>
          <h3>🔍 Live Preview</h3>
          <TemplateCanvas
            title={title}
            setTitle={() => {}}
            cta={cta}
            setCta={() => {}}
            slots={slots}
            setSlots={() => {}}
          />
        </div>
      </div>

      <hr style={{ margin: "50px 0" }} />

      {/* Saved Templates List */}
      <h3>📦 Saved Templates</h3>
      {templates.map((tpl, idx) => (
        <div
          key={idx}
          style={{
            background: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <strong>{tpl.name}</strong> ({tpl.slots.length} offers)
          <div style={{ fontSize: 14, marginTop: 6 }}>
            <div>🎯 Title: {tpl.title}</div>
            <div>🔘 CTA: {tpl.cta}</div>
            <div>
              🧩 Slots:
              <ul>
                {tpl.slots.map((s, i) => (
                  <li key={i}>
                    {s.label || "(empty)"}{" "}
                    {s.bonus && <span>- {s.bonus}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}




  