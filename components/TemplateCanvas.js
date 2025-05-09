import React, { useState, useEffect } from "react";
import TripleOfferEditor from "./TripleOfferEditor";

const TemplateCanvas = () => {
  const [offerType, setOfferType] = useState("Triple Offer");
  const [configurations, setConfigurations] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedConfigs = JSON.parse(localStorage.getItem("liveops-configurations") || "[]");
    setConfigurations(storedConfigs);

    const storedTemplates = JSON.parse(localStorage.getItem("liveops-templates") || "[]");
    setTemplates(storedTemplates);
  }, []);

  const handleSaveTemplate = (templateData) => {
    const updatedTemplates = [...templates];
    if (editingIndex !== null) {
      updatedTemplates[editingIndex] = templateData;
    } else {
      updatedTemplates.push(templateData);
    }
    setTemplates(updatedTemplates);
    localStorage.setItem("liveops-templates", JSON.stringify(updatedTemplates));
    setEditingIndex(null);
  };

  const handleDeleteTemplate = (index) => {
    const updated = [...templates];
    updated.splice(index, 1);
    setTemplates(updated);
    localStorage.setItem("liveops-templates", JSON.stringify(updated));
    if (editingIndex === index) setEditingIndex(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Template Builder</h2>

      <label>Offer Type:</label>
      <select
        value={offerType}
        onChange={(e) => {
          setOfferType(e.target.value);
          setEditingIndex(null);
        }}
        style={{ width: "300px", marginBottom: "2rem" }}
      >
        <option value="Triple Offer">Triple Offer</option>
        {/* Future types here */}
      </select>

      {offerType === "Triple Offer" && (
        <TripleOfferEditor
          offerType={offerType}
          configurations={configurations}
          onSave={handleSaveTemplate}
          template={editingIndex !== null ? templates[editingIndex] : null}
        />
      )}

      <hr style={{ margin: "3rem 0" }} />

      <h3>Saved Templates</h3>
      {templates.length === 0 && <div>No templates saved.</div>}
      {templates.map((tpl, idx) => (
        <div key={idx} style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <strong>{tpl.name}</strong> — {tpl.layout}
          </div>
          <div>
            <button onClick={() => setEditingIndex(idx)} style={{ marginRight: 10 }}>
              ✏ Edit
            </button>
            <button onClick={() => handleDeleteTemplate(idx)} style={{ background: "#c0392b", color: "#fff" }}>
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateCanvas;

