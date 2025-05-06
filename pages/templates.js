import { useEffect, useState } from "react";
import TripleOfferEditor from "../components/TripleOfferEditor";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [selectedType, setSelectedType] = useState("Triple Offer");
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("liveops-templates");
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("liveops-templates", JSON.stringify(templates));
  }, [templates]);

  const handleSaveTemplate = (newTemplate) => {
    if (editingIndex !== null) {
      const updated = [...templates];
      updated[editingIndex] = newTemplate;
      setTemplates(updated);
      setEditingIndex(null);
    } else {
      setTemplates([...templates, newTemplate]);
    }
  };

  const handleDelete = (index) => {
    const updated = [...templates];
    updated.splice(index, 1);
    setTemplates(updated);
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>🎨 Template Builder</h2>

      <label style={{ display: "block", margin: "20px 0" }}>
        Choose Offer Type:
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setEditingIndex(null);
          }}
          style={{ marginLeft: 10, padding: 6 }}
        >
          <option>Triple Offer</option>
        </select>
      </label>

      {selectedType === "Triple Offer" && (
        <TripleOfferEditor
          onSave={handleSaveTemplate}
          template={editingIndex !== null ? templates[editingIndex] : null}
        />
      )}

      <hr style={{ margin: "40px 0" }} />

      <h3>📦 Saved Templates</h3>
      {templates.length === 0 && <div>No templates yet.</div>}
      {templates.map((tpl, idx) => (
        <div
          key={idx}
          style={{
            background: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{tpl.name}</strong> — <em>{tpl.layout}</em>
          </div>
          <div>
            <button
              onClick={() => handleEdit(idx)}
              style={{
                marginRight: 10,
                padding: "4px 10px",
                border: "1px solid #666",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              ✏ Edit
            </button>
            <button
              onClick={() => handleDelete(idx)}
              style={{
                padding: "4px 10px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}





  