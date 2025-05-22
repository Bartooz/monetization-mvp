import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";

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

        const selected = templates.find((t) => t.name === newEvent.templateName);
        setSelectedTemplateData(selected || null);
    }, [isOpen, newEvent.templateName, templates]);

    const handleChange = (field, value) => {
        setNewEvent({ ...newEvent, [field]: value });
    };

    const layout = selectedTemplateData?.layout || "Vertical";
    const slots = selectedTemplateData?.slots || [];

    const currencyEmojis = {
        Cash: "💵",
        Gold: "🪙",
        Diamond: "💎"
    };

    const renderSlot = (slot, i) => (
        <div key={i} style={{ marginBottom: 6 }}>
            <div>
                <strong>{slot.value} {currencyEmojis[slot.currency] || slot.currency}</strong>
            </div>
            {slot.bonus && (
                <div style={{ fontSize: 12, color: "green" }}>
                    +{slot.bonus} bonus
                </div>
            )}
        </div>
    );

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
                    value={newEvent.start || ""}
                    onChange={(e) => handleChange("start", e.target.value)}
                    style={{ width: "100%", marginBottom: "10px" }}
                />

                <label>End:</label>
                <input
                    type="datetime-local"
                    value={newEvent.end || ""}
                    onChange={(e) => handleChange("end", e.target.value)}
                    style={{ width: "100%", marginBottom: "10px" }}
                />

                <label>Template:</label>
                <select
                    value={newEvent.templateName || ""}
                    onChange={(e) => handleChange("templateName", e.target.value)}
                    style={{ width: "100%", marginBottom: "10px" }}
                >
                    <option value="">Select Template</option>
                    {templates.map((t) => (
                        <option key={t.templateName} value={t.templateName}>
                            {t.templateName}
                            {t.name}
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
                    <h4 style={{ marginBottom: 10 }}>{selectedTemplateData.title}</h4>
                    {layout === "Horizontal" ? (
                        <TripleOfferPreviewHorizontal slots={slots} />
                    ) : (
                        <TripleOfferPreviewVertical slots={slots} />
                    )}
                </div>
            )}
        </Modal>
    );
};

export default EventModal;










