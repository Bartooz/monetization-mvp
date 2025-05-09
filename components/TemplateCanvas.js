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

    const editIndex = localStorage.getItem("liveops-edit-template-index");
    if (editIndex !== null && !isNaN(editIndex)) {
      setEditingIndex(parseInt(editIndex));
      localStorage.removeItem("liveops-edit-template-index");
    }
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
      </select>

      {offerType === "Triple Offer" && (
        <TripleOfferEditor
          offerType={offerType}
          configurations={configurations}
          onSave={handleSaveTemplate}
          template={editingIndex !== null ? templates[editingIndex] : null}
        />
      )}
    </div>
  );
};

export default TemplateCanvas;


