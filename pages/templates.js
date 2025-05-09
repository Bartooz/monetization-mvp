import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("liveops-templates");
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse templates:", e);
        setTemplates([]);
      }
    }
  }, []);

  const handleDelete = (index) => {
    const updated = [...templates];
    updated.splice(index, 1);
    setTemplates(updated);
    localStorage.setItem("liveops-templates", JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    localStorage.setItem("liveops-edit-template-index", index);
    router.push("/templatecanvas");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🎨 Saved Templates</h2>

      {templates.length === 0 && <p>No templates found.</p>}

      {templates.map((tpl, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "1rem",
            background: "#f9f9f9",
          }}
        >
          <h3>{tpl.name || "(Unnamed Template)"}</h3>
          <p><strong>Offer Type:</strong> {tpl.type || "N/A"}</p>
          <p><strong>Layout:</strong> {tpl.layout || "N/A"}</p>
          <p><strong>Slots:</strong> {tpl.slots?.length || 0}</p>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button onClick={() => handleEdit(index)}>✏ Edit</button>
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







  