// pages/templates.js
import { useEffect, useState } from "react";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("liveops-templates");
    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("liveops-templates", JSON.stringify(templates));
  }, [templates]);

  const handleAddTemplate = () => {
    if (!newTemplate.trim()) return;

    const exists = templates.some(t => t.toLowerCase() === newTemplate.trim().toLowerCase());
    if (exists) return alert("Template already exists");

    setTemplates([...templates, newTemplate.trim()]);
    setNewTemplate("");
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>🗂️ Templates Library</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter new template name"
          value={newTemplate}
          onChange={(e) => setNewTemplate(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <button
          onClick={handleAddTemplate}
          style={{ padding: "8px 12px", background: "#111", color: "white", border: "none", borderRadius: 4 }}
        >
          ➕ Add Template
        </button>
      </div>

      <ul style={{ paddingLeft: 20 }}>
        {templates.map((t, idx) => (
          <li key={idx} style={{ marginBottom: 6 }}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

  