import { useEffect, useState } from "react";
import TripleOfferEditor from "../components/TripleOfferEditor";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("liveops-templates");
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid template data:", e);
        setTemplates([]);
      }
    }

    const configStored = localStorage.getItem("liveops-configurations");
    if (configStored) {
      try {
        setConfigurations(JSON.parse(configStored));
      } catch (e) {
        console.error("Invalid configuration data:", e);
        setConfigurations([]);
      }
    }
  }, []);

  const handleSave = (templateData) => {
    const updated = [...templates];
    if (editingIndex !== null) {
      updated[editingIndex] = templateData;
    } else {
      updated.push(templateData);
    }
    localStorage.setItem("liveops-templates", JSON.stringify(updated));
    setTemplates(updated);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const updated = [...templates];
    updated.splice(index, 1);
    localStorage.setItem("liveops-templates", JSON.stringify(updated));
    setTemplates(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{editingIndex !== null ? "✏ Edit Template" : "➕ Create New Template"}</h2>

      <TripleOfferEditor
        configurations={configurations}
        offerType="Triple Offer"
        onSave={handleSave}
        template={editingIndex !== null ? templates[editingIndex] : null}
      />

      <hr style={{ margin: "3rem 0" }} />

      <h3>🎨 Saved Templates</h3>
      {templates.length === 0 && <p>No templates saved.</p>}

      {templates.map((tpl, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: 16,
            background: "#f9f9f9",
          }}
        >
          <h4>{tpl.templateName || tpl.name || "Unnamed"}</h4>
          <p><strong>Offer Type:</strong> {tpl.offerType}</p>
          <p><strong>Layout:</strong> {tpl.layout}</p>
          <p><strong>Configuration:</strong> {tpl.configuration || "—"}</p>
          <p><strong>Slots:</strong> {tpl.slots?.length || 0}</p>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button onClick={() => setEditingIndex(index)}>✏ Edit</button>
            <button
              onClick={() => handleDelete(index)}
              style={{ background: "#c0392b", color: "white" }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}







