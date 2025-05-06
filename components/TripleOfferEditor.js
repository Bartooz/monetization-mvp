import { useState, useEffect } from "react";

export default function TripleOfferEditor({ onSave, template }) {
  const [templateName, setTemplateName] = useState("");
  const [title, setTitle] = useState("");
  const [slots, setSlots] = useState([
    { label: "", cta: "" },
    { label: "", cta: "" },
    { label: "", cta: "" },
  ]);

  useEffect(() => {
    if (template) {
      setTemplateName(template.name || "");
      setTitle(template.title || "");
      setSlots(template.slots || [
        { label: "", cta: "" },
        { label: "", cta: "" },
        { label: "", cta: "" },
      ]);
    }
  }, [template]);

  const handleChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const handleSave = () => {
    onSave({
      name: templateName.trim() || "Untitled",
      type: "Triple Offer",
      layout: "Triple",
      title: title.trim(),
      slots,
    });

    // Reset after save (optional)
    setTemplateName("");
    setTitle("");
    setSlots([
      { label: "", cta: "" },
      { label: "", cta: "" },
      { label: "", cta: "" },
    ]);
  };

  return (
    <div style={{ display: "flex", gap: 60 }}>
      {/* Left: Inputs */}
      <div style={{ flex: 1 }}>
        <h3>Triple Offer Editor</h3>

        <label>
          Template Name:
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            style={{ display: "block", margin: "10px 0", padding: 8, width: "80%" }}
          />
        </label>

        <label>
          Offer Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: "block", marginBottom: 20, padding: 8, width: "80%" }}
          />
        </label>

        {slots.map((slot, idx) => (
          <div key={idx} style={{ marginBottom: 20 }}>
            <h4>Slot {idx + 1}</h4>
            <input
              type="text"
              value={slot.label}
              onChange={(e) => handleChange(idx, "label", e.target.value)}
              placeholder="Label"
              style={{ marginBottom: 5, padding: 6, width: "80%" }}
            />
            <input
              type="text"
              value={slot.cta}
              onChange={(e) => handleChange(idx, "cta", e.target.value)}
              placeholder="CTA"
              style={{ padding: 6, width: "80%" }}
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          Save Template
        </button>
      </div>

      {/* Right: Preview */}
      <div style={{ flex: 1, background: "#f7f7f7", padding: 20, borderRadius: 12 }}>
        <h3 style={{ textAlign: "center", fontSize: 20, marginBottom: 20 }}>{title}</h3>
        {slots.map((slot, idx) => (
          <div
            key={idx}
            style={{
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: 18 }}>{slot.label}</div>
            <div
              style={{
                marginTop: 10,
                padding: "8px 12px",
                background: "#4caf50",
                color: "#fff",
                borderRadius: 6,
                display: "inline-block",
              }}
            >
              {slot.cta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

