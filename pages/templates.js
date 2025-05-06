import { useEffect, useState } from "react";
import TripleOfferEditor from "../components/TripleOfferEditor";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [selectedType, setSelectedType] = useState("Triple Offer");

  useEffect(() => {
    const saved = localStorage.getItem("liveops-templates");
    if (saved) setTemplates(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("liveops-templates", JSON.stringify(templates));
  }, [templates]);

  const handleSaveTemplate = (newTemplate) => {
    setTemplates([...templates, newTemplate]);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>🎨 Template Builder</h2>

      <label style={{ display: "block", margin: "20px 0" }}>
        Choose Offer Type:
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ marginLeft: 10, padding: 6 }}
        >
          <option>Triple Offer</option>
          {/* Future options: Timer, Multi-Sale, Buy-All, etc. */}
        </select>
      </label>

      {selectedType === "Triple Offer" && (
        <TripleOfferEditor onSave={handleSaveTemplate} />
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
          }}
        >
          <strong>{tpl.name}</strong> — {tpl.layout}
        </div>
      ))}
    </div>
  );
}




  