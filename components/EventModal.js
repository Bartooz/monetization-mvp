// Full content of EventModal.js (updated)
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewCarousel from "./TripleOfferPreviewCarousel";
import TripleOfferPreviewVerticalCarousel from "./TripleOfferPreviewVerticalCarousel";

Modal.setAppElement("#__next");

const USE_BACKEND = false; // Toggle this when backend is available

const loadTemplatesLocal = () => {
  const raw = localStorage.getItem("templates");
  return raw ? JSON.parse(raw) : [];
};

const EventModal = ({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  handleAddEvent,
  templates = [],
  configurations = [],
  showPreview,
  setShowPreview
}) => {
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [internalTemplates, setInternalTemplates] = useState([]);

  useEffect(() => {
    if (!USE_BACKEND) {
      const local = loadTemplatesLocal();
      setInternalTemplates(local);
    } else {
      setInternalTemplates(templates);
    }
  }, [templates]);
  useEffect(() => {
    if (!isOpen) return;
    const selected = internalTemplates.find((t) =>
      t.templateName === newEvent.templateName ||
      t.template_name === newEvent.templateName
    );
    setSelectedTemplateData(selected || null);

    if (selected) {
      setNewEvent((prev) => ({
        ...prev,
        category: selected.eventType || "Offer",
        offerType: selected.offerType || "Triple Offer",
        configuration: selected.configuration || "",
      }));
    }
  }, [isOpen, newEvent.templateName, templates]); // << use internalTemplates here
  const handleChange = (field, value) => {
    setNewEvent({ ...newEvent, [field]: value });
  };

  const rawLayout = selectedTemplateData?.layout || "Vertical";
  const layout = rawLayout.replace(/\s+/g, "");
  const slots = selectedTemplateData?.slots || [];

  const layoutComponentMap = {
    Horizontal: (
      <TripleOfferPreviewHorizontal
        slots={slots}
        title={selectedTemplateData?.title}
        design_data={selectedTemplateData?.design_data}
      />
    ),
    Vertical: (
      <TripleOfferPreviewVertical
        slots={slots}
        title={selectedTemplateData?.title}
        design_data={selectedTemplateData?.design_data}
      />
    ),
    Carousel: (
      <TripleOfferPreviewCarousel
        slots={slots}
        title={selectedTemplateData?.title}
        design_data={selectedTemplateData?.design_data}
      />
    ),
    VerticalCarousel: (
      <TripleOfferPreviewVerticalCarousel
        slots={slots}
        title={selectedTemplateData?.title}
        design_data={selectedTemplateData?.design_data}
      />
    ),
  };

  const normalizeDateTime = (value) => {
    if (!value) return "";
    try {
      const date = new Date(value);
      return date.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };



  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Event Modal"
      style={{
        content: {
          top: "50%", left: "50%", right: "auto", bottom: "auto",
          transform: "translate(-50%, -50%)",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "row",
          gap: "20px",
        },
      }}
    >
      <div style={{ flex: "1", minWidth: "300px" }}>
        <h2>{newEvent.id ? "Edit Event" : "Create Event"}</h2>

        <label>Title:</label>
        <input
          type="text"
          value={newEvent.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Start:</label>
        <input
          type="datetime-local"
          value={normalizeDateTime(newEvent.start)}
          onChange={(e) => handleChange("start", e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>End:</label>
        <input
          type="datetime-local"
          value={normalizeDateTime(newEvent.end)}
          onChange={(e) => handleChange("end", e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Template:</label>
        <select
          value={newEvent.templateName || ""}
          onChange={(e) => {
            handleChange("templateName", e.target.value);
            setShowPreview(true);
          }}
        >
          <option value="">Select Template</option>
          {internalTemplates.map((template) => (
            <option key={template.template_name} value={template.template_name}>
              {template.template_name}
            </option>
          ))}
        </select>

        <label>Status:</label>
        <select
          value={newEvent.status || "Draft"}
          onChange={(e) => handleChange("status", e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <option value="Draft">Draft</option>
          <option value="Ready for QA">Ready for QA</option>
          <option value="QA">QA</option>
          <option value="Review">Review</option>
          <option value="Ready">Ready</option>
        </select>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <input
              type="checkbox"
              checked={showPreview}
              onChange={() => setShowPreview(!showPreview)}
            />
            Show Preview
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleAddEvent}>Save</button>
        </div>
      </div>

      {showPreview && selectedTemplateData && (
        <div style={{
          flex: "1",
          minWidth: "250px",
          borderLeft: "1px solid #ccc",
          paddingLeft: "16px"
        }}>

          {layoutComponentMap[layout] || <TripleOfferPreviewVertical slots={slots} />}

        </div>
      )}
    </Modal>
  );
};

export default EventModal;














