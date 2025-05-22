import React, { useState, useEffect } from "react";
import TripleOfferEditor from "../components/TripleOfferEditor";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("liveops-templates") || "[]");
      setTemplates(saved);
    }
  }, []);

  const handleSaveTemplate = (newTemplate) => {
    const updated = editingTemplate
      ? templates.map((tpl) =>
          tpl.templateName === editingTemplate.templateName ? newTemplate : tpl
        )
      : [...templates, newTemplate];

    localStorage.setItem("liveops-templates", JSON.stringify(updated));
    setTemplates(updated);
    setEditingTemplate(null);
  };

  const handleDelete = (name) => {
    const updated = templates.filter((tpl) => tpl.templateName !== name);
    localStorage.setItem("liveops-templates", JSON.stringify(updated));
    setTemplates(updated);
  };

  const filteredTemplates = templates.filter((tpl) =>
    tpl.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 30, maxWidth: 1000, margin: "0 auto" }}>
      <TripleOfferEditor template={editingTemplate} onSave={handleSaveTemplate} />

      <hr style={{ margin: "30px 0" }} />

      <h3>Saved Templates</h3>
      <input
        type="text"
        placeholder="Search templates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          marginBottom: 20,
          padding: 10,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      {filteredTemplates.length === 0 && <p>No matching templates found.</p>}

      {filteredTemplates.map((tpl) => (
        <div
          key={tpl.templateName}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 12,
            marginBottom: 10,
            backgroundColor: "#f9f9f9",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{tpl.templateName}</strong> — <span>{tpl.layout}</span>
            </div>
            <div>
              <button onClick={() => setEditingTemplate(tpl)} style={{ marginRight: 10 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(tpl.templateName)} style={{ color: "red" }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}








