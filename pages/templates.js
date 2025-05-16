import React, { useState, useEffect } from "react";
import TripleOfferEditor from "../components/TripleOfferEditor";
import TripleOfferPreviewHorizontal from "../components/TripleOfferPreviewHorizontal";
import TripleOfferPreviewVertical from "../components/TripleOfferPreviewVertical";

const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("liveops-templates") || "[]");
    setTemplates(saved);
  }, []);

  const handleSaveTemplate = (newTemplate) => {
    const updated = [...templates.filter(t => t.templateName !== newTemplate.templateName), newTemplate];
    setTemplates(updated);
    localStorage.setItem("liveops-templates", JSON.stringify(updated));
    setSelectedTemplate(null);
  };

  const handleDelete = (templateName) => {
    const filtered = templates.filter(t => t.templateName !== templateName);
    setTemplates(filtered);
    localStorage.setItem("liveops-templates", JSON.stringify(filtered));
    setSelectedTemplate(null);
  };

  const renderPreview = (template) => {
    const Layout = layoutComponents[template.layout || "Horizontal"];
    return <Layout slots={template.slots || []} title={template.title} />;
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        <h2>{selectedTemplate ? "Edit Template" : "Create New Template"}</h2>
        <TripleOfferEditor template={selectedTemplate} onSave={handleSaveTemplate} />
      </div>

      <div style={{ flex: 1 }}>
        <h2>Saved Templates</h2>
        {templates.length === 0 && <p>No templates yet.</p>}
        {templates.map((t, i) => (
          <div key={i} style={{ border: "1px solid #ccc", marginBottom: 12, padding: 10 }}>
            <strong>{t.templateName}</strong>
            <div style={{ fontSize: 12, marginBottom: 4 }}>
              Offer Type: {t.offerType || "N/A"}<br />
              Layout: {t.layout || "Horizontal"}<br />
              Configuration: {t.configuration || "N/A"}
            </div>
            {renderPreview(t)}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setSelectedTemplate(t)} style={{ marginRight: 10 }}>Edit</button>
              <button onClick={() => handleDelete(t.templateName)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







