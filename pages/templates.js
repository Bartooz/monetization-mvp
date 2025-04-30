import { useEffect, useState } from "react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [title, setTitle] = useState("");
  const [cta, setCta] = useState("");
  const [layoutSize, setLayoutSize] = useState(3);
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
    <div style={{ display: "flex", gap: 40 }}>
      {/* Left: Builder Form */}
      <div style={{ flex: 1 }}>
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
      </div>

      {/* Right: Live Preview */}
      <div style={{ flex: 1 }}>
        <h3>🔍 Live Preview</h3>
        <div
          style={{
            background: "#f0f4ff",
            border: "1px solid #ccc",
            borderRadius: 12,
            padding: 20,
            maxWidth: 400,
          }}
        >
          <h2 style={{ marginTop: 0, color: "#333", fontWeight: "bold" }}>
            {title || "Your Title Here"}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            {slots.map((slot, idx) => (
              <div
                key={idx}
                style={{
                  background: "white",
                  border: "1px solid #999",
                  borderRadius: 10,
                  padding: "10px 12px",
                  minWidth: 80,
                  textAlign: "center",
                }}
              >
                <div style={{ fontWeight: "bold", fontSize: 16 }}>
                  {slot.label || "$0"}
                </div>
                {slot.bonus && (
                  <div style={{ fontSize: 12, marginTop: 4, color: "#666" }}>
                    {slot.bonus}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            style={{
              width: "100%",
              background: "#11aa44",
              color: "white",
              border: "none",
              padding: "10px 0",
              borderRadius: 8,
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            {cta || "Get It Now!"}
          </button>
        </div>
      </div>
    </div>
  );
}



  