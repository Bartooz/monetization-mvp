import { useEffect, useState } from "react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [title, setTitle] = useState("");
  const [cta, setCta] = useState("");
  const [layoutSize, setLayoutSize] = useState(3); // 2, 3, or 4
  const [slots, setSlots] = useState([
    { label: "", bonus: "" },
    { label: "", bonus: "" },
    { label: "", bonus: "" },
  ]);

  // Load saved templates
  useEffect(() => {
    const saved = localStorage.getItem("liveops-templates");
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when templates change
  useEffect(() => {
    localStorage.setItem("liveops-templates", JSON.stringify(templates));
  }, [templates]);

  // Update slots array when layout changes
  useEffect(() => {
    setSlots(Array(layoutSize).fill().map((_, i) => slots[i] || { label: "", bonus: "" }));
  }, [layoutSize]);

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      alert("Template name is required");
      return;
    }

    const newTemplate = {
      name: templateName.trim(),
      type: "MultiSale",
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
    setSlots(Array(layoutSize).fill({ label: "", bonus: "" }));
  };

  return (
    <div>
      <h2>🧱 MultiSale Template Builder</h2>

      <div style={{ marginBottom: 20 }}>
        <label>
          Template Name:
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            style={{ marginLeft: 10, padding: 5, width: 250 }}
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
            style={{ marginLeft: 10, padding: 5, width: 250 }}
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
            style={{ marginLeft: 10, padding: 5, width: 250 }}
          />
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          Layout:
          <select
            value={layoutSize}
            onChange={(e) => setLayoutSize(parseInt(e.target.value))}
            style={{ marginLeft: 10, padding: 5 }}
          >
            <option value={2}>2 Offers</option>
            <option value={3}>3 Offers</option>
            <option value={4}>4 Offers</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>Offer Slots:</h4>
        {slots.map((slot, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <label>
              Label:
              <input
                type="text"
                value={slot.label}
                onChange={(e) => handleSlotChange(idx, "label", e.target.value)}
                style={{ marginLeft: 10, padding: 5, width: 100 }}
              />
            </label>

            <label style={{ marginLeft: 20 }}>
              Bonus:
              <input
                type="text"
                value={slot.bonus}
                onChange={(e) => handleSlotChange(idx, "bonus", e.target.value)}
                style={{ marginLeft: 10, padding: 5, width: 120 }}
              />
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleSaveTemplate}
        style={{
          padding: "10px 20px",
          background: "#111",
          color: "white",
          border: "none",
          borderRadius: 6,
        }}
      >
        Save Template
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h3>📦 Saved Templates:</h3>
      {templates.map((tpl, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 15,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 6,
            backgroundColor: "#f9f9f9",
          }}
        >
          <strong>{tpl.name}</strong> ({tpl.slots.length} offers)
          <div>Title: {tpl.title}</div>
          <div>CTA: {tpl.cta}</div>
          <ul>
            {tpl.slots.map((s, i) => (
              <li key={i}>
                {s.label} {s.bonus && ` - Bonus: ${s.bonus}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


  