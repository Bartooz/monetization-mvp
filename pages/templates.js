import React, { useState, useEffect } from "react";
import TripleOfferEditor from "../components/TripleOfferEditor";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


  // ✅ Fetch templates from backend
  useEffect(() => {
    fetch(`${BASE_URL}/api/templates`)
      .then((res) => res.json())
      .then((data) => setTemplates(data))
      .catch((err) => {
        console.error("Failed to fetch templates:", err);
        setTemplates([]);
      });
  }, []);

  // ✅ Save or update a template
  const handleSaveTemplate = async (templateData) => {
    try {
      const method = editingTemplate ? "PUT" : "POST";
      const endpoint = editingTemplate
        ? `${BASE_URL}/api/templates/${editingTemplate.template_name}`
        : `${BASE_URL}/api/templates`;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });

      if (!res.ok) throw new Error("Failed to save template");

      const saved = method === "POST" ? await res.json() : templateData;

      setTemplates((prev) => {
        const exists = prev.find((tpl) => tpl.template_name === saved.template_name);
        return exists
          ? prev.map((tpl) =>
            tpl.template_name === saved.template_name ? saved : tpl
          )
          : [...prev, saved];
      });

      setEditingTemplate(null);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // ✅ Cancel editing
  const handleCancelEdit = () => {
    setEditingTemplate(null);
  };

  // ✅ Delete a template
  const handleDelete = async (name) => {
    try {
      const res = await fetch(`${BASE_URL}/api/templates/${encodeURIComponent(name)}`, {

          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete template");

      setTemplates((prev) =>
        prev.filter((tpl) => tpl.template_name !== name)
      );
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredTemplates = templates.filter((tpl) =>
    tpl.template_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 30, maxWidth: 1000, margin: "0 auto" }}>
      <TripleOfferEditor
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onCancel={handleCancelEdit}
      />

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
          key={tpl.template_name}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 12,
            marginBottom: 10,
            backgroundColor: "#f9f9f9",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{tpl.template_name}</strong> — <span>{tpl.layout}</span>
            </div>
            <div>
              <button onClick={() => setEditingTemplate(tpl)} style={{ marginRight: 10 }}>
                Edit
              </button>
              <button
                onClick={() => handleDelete(tpl.template_name)}
                style={{ color: "red" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}










