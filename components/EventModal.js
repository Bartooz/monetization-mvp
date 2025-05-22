import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";

const currencyEmojis = {
    Cash: "💵",
    "Gold Bars": "🪙",
    Diamond: "💎",
};

const layoutComponents = {
    Horizontal: TripleOfferPreviewHorizontal,
    Vertical: TripleOfferPreviewVertical,
};

const EventModal = ({
    isOpen,
    onClose,
    newEvent,
    setNewEvent,
    handleAddEvent,
    templates = [],
}) => {
    console.log("🧪 EVENT MODAL PROPS:", {
        newEvent,
        templates,
        configurations,
      });
    const [selectedTemplateData, setSelectedTemplateData] = useState(null);
    const [showPreview, setShowPreview] = useState(true);


    // Load template + configuration slot data
    useEffect(() => {
        if (!newEvent?.template || templates.length === 0) {
            setSelectedTemplateData(null);
            return;
        }

        const match = templates.find((t) => t.templateName === newEvent.template);
        if (!match) {
            setSelectedTemplateData(null);
            return;
        }

        if (match.slots?.length > 0) {
            setSelectedTemplateData(match);
        } else if (match.configuration) {
            const configs = JSON.parse(
                localStorage.getItem("liveops-configurations") || "[]"
            );
            const config = configs.find((c) => c.name === match.configuration);
            if (config && config.slots) {
                setSelectedTemplateData({ ...match, slots: config.slots });
            } else {
                setSelectedTemplateData({ ...match, slots: [] });
            }
        } else {
            setSelectedTemplateData({ ...match, slots: [] });
        }
    }, [newEvent.template, templates]);

    const handleChange = (field, value) => {
        setNewEvent({ ...newEvent, [field]: value });
    };

    const LayoutComponent =
        selectedTemplateData &&
        layoutComponents[selectedTemplateData.layout || "Horizontal"];

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Event Modal"
            style={{
                overlay: { zIndex: 1000, backgroundColor: "rgba(0, 0, 0, 0.4)" },
                content: {
                    maxWidth: "900px",
                    margin: "auto",
                    padding: "20px",
                    display: "flex",
                    gap: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                },
            }}
        >
            <div style={{ flex: 1 }}>
                <h2>{newEvent.id ? "Edit Event" : "Create Event"}</h2>

                <label>Title:</label>
                <input
                    type="text"
                    value={newEvent.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                />

                <label>Start:</label>
                <input
                    type="datetime-local"
                    value={newEvent.start || ""}
                    onChange={(e) => handleChange("start", e.target.value)}
                />

                <label>End:</label>
                <input
                    type="datetime-local"
                    value={newEvent.end || ""}
                    onChange={(e) => handleChange("end", e.target.value)}
                />

                <label>Category:</label>
                <select
                    value={newEvent.category || ""}
                    onChange={(e) => handleChange("category", e.target.value)}
                >
                    <option value="">Select</option>
                    <option value="Offer">Offer</option>
                    <option value="Mission">Mission</option>
                </select>

                {newEvent.category === "Offer" && (
                    <>
                        <label>Offer Template:</label>
                        <select
                            value={newEvent.template || ""}
                            onChange={(e) => handleChange("template", e.target.value)}
                        >
                            <option value="">Select</option>
                            {templates
                                .filter((t) => t.category === "Offer")
                                .map((template, i) => (
                                    <option key={i} value={template.templateName}>
                                        {template.templateName}
                                    </option>
                                ))}
                        </select>

                        <div style={{ marginTop: 10 }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={showPreview}
                                    onChange={(e) => setShowPreview(e.target.checked)}
                                    style={{ marginRight: 6 }}
                                />
                                Show Preview
                            </label>
                        </div>

                    </>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <button onClick={onClose} style={{ marginRight: 10 }}>
                        Cancel
                    </button>
                    <button onClick={handleAddEvent}>Save</button>
                </div>
            </div>

            {/* 🔍 PREVIEW SECTION */}
            {showPreview &&
                newEvent.category === "Offer" &&
                LayoutComponent &&
                selectedTemplateData?.slots?.length > 0 && (
                    <div style={{ flex: 1 }}>
                        <LayoutComponent
                            slots={selectedTemplateData.slots}
                            title={selectedTemplateData.title}
                        />
                    </div>
                )}
        </Modal>
    );
};

export default EventModal;









