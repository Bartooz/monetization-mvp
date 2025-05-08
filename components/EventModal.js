import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import TripleOfferEditor from "./TripleOfferEditor";


Modal.setAppElement("#__next");

const EventModal = ({
    isOpen,
    onClose,
    newEvent,
    setNewEvent,
    handleAddEvent,
    handleDeleteEvent,
    templates = [],
}) => {
    const handleChange = (field, value) => {
        setNewEvent((prev) => ({ ...prev, [field]: value }));
    };
    const [selectedTemplateData, setSelectedTemplateData] = useState(null);

    useEffect(() => {
        if (
            newEvent.category === "Offer" &&
            newEvent.template &&
            templates.length > 0
        ) {
            const match = templates.find((t) => t.name === newEvent.template);
            setSelectedTemplateData(match || null);
        } else {
            setSelectedTemplateData(null);
        }
    }, [newEvent.category, newEvent.template, templates]);


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Create Event"
            overlayClassName="ReactModal__Overlay"
            className="ReactModal__Content"
        >
            <h2>{newEvent?.id ? "Edit Event" : "Create Event"}</h2>

            <label>Title:</label>
            <input
                type="text"
                value={newEvent.title}
                onChange={(e) => handleChange("title", e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
            />

            <label>Start:</label>
            <input
                type="datetime-local"
                value={newEvent.start}
                onChange={(e) => handleChange("start", e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
            />

            <label>End:</label>
            <input
                type="datetime-local"
                value={newEvent.end}
                onChange={(e) => handleChange("end", e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
            />

            <label>Category:</label>
            <select
                value={newEvent.category}
                onChange={(e) => handleChange("category", e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
            >
                <option value="Mission">Mission</option>
                <option value="Offer">Offer</option>
            </select>

            {newEvent.category === "Offer" && (
                <>
                    <label>Offer Template:</label>
                    <select
                        value={newEvent.template}
                        onChange={(e) => handleChange("template", e.target.value)}
                        style={{ width: "100%", marginBottom: "1.5rem" }}
                    >
                        <option value="">Select a Template</option>
                        {templates.map((t, idx) => (
                            <option key={idx} value={t.name}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                    {selectedTemplateData && (
                        <div style={{ marginTop: "1rem", padding: "1rem", background: "#fafafa", border: "1px solid #ddd", borderRadius: 8 }}>
                            <h4 style={{ marginBottom: 12, fontSize: 18 }}>{selectedTemplateData.title}</h4>
                            {selectedTemplateData.slots?.map((slot, idx) => (
                                <div key={idx} style={{
                                    marginBottom: 12,
                                    padding: "10px",
                                    background: "#fff",
                                    border: "1px solid #ccc",
                                    borderRadius: 6,
                                    textAlign: "center"
                                }}>
                                    <div style={{ fontWeight: "bold" }}>{slot.label}</div>
                                    <div style={{
                                        marginTop: 6,
                                        padding: "6px 10px",
                                        background: "#4caf50",
                                        color: "white",
                                        borderRadius: 4,
                                        display: "inline-block"
                                    }}>
                                        {slot.cta}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button onClick={onClose}>Cancel</button>

                {newEvent.id && (
                    <button
                        onClick={handleDeleteEvent}
                        style={{ background: "#c0392b", color: "white", padding: "0.5rem 1rem" }}
                    >
                        Delete
                    </button>
                )}

                <button onClick={handleAddEvent}>
                    {newEvent.id ? "Save" : "Add"}
                </button>
            </div>
        </Modal>
    );
};

export default EventModal;







