import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewCarousel from "./TripleOfferPreviewCarousel";
import TripleOfferPreviewVerticalCarousel from "./TripleOfferPreviewVerticalCarousel";

Modal.setAppElement("#__next");

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

    useEffect(() => {
        if (!isOpen) return;
        const selected = templates.find((t) => t.templateName === newEvent.templateName);
        setSelectedTemplateData(selected || null);

        // Auto-fill category, offerType, and configuration when template is selected
        if (selected) {
            setNewEvent((prev) => ({
                ...prev,
                category: selected.eventType || "Offer",
                offerType: selected.offerType || "Triple Offer",
                configuration: selected.configuration || "",
            }));
        }
    }, [isOpen, newEvent.templateName, templates]);

    const handleChange = (field, value) => {
        setNewEvent({ ...newEvent, [field]: value });
    };

    const layout = selectedTemplateData?.layout || "Vertical";
    const slots = selectedTemplateData?.slots || [];

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
                    style={{ width: "100%", marginBottom: "10px" }}
                >
                    <option value="">Select Template</option>
                    {templates.map((t) => (
                        <option key={t.templateName} value={t.templateName}>
                            {t.templateName}
                        </option>
                    ))}
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
                    {selectedTemplateData.title && selectedTemplateData.title !== "Untitled Offer" && (
                        <h4 style={{ marginBottom: 10 }}>{selectedTemplateData.title}</h4>
                    )}
                    {{
                        Horizontal: <TripleOfferPreviewHorizontal slots={slots} />,
                        Vertical: <TripleOfferPreviewVertical slots={slots} />,
                        Carousel: <TripleOfferPreviewCarousel slots={slots} />,
                        VerticalCarousel: <TripleOfferPreviewVerticalCarousel slots={slots} />,
                    }[layout] || <TripleOfferPreviewVertical slots={slots} />}
                </div>
            )}
        </Modal>
    );
};

export default EventModal;













