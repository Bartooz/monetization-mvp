import React, { useState } from "react";

export default function TripleOfferPreviewCarousel({ slots = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slots.length) % slots.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slots.length);
  };

  const renderSlot = (slot, isActive) => (
    <div
      style={{
        display: isActive ? "block" : "none",
        textAlign: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "20px",
        margin: "10px auto",
        maxWidth: "300px",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 10 }}>
        {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
        {slot.currency === "Cash"
          ? "💵"
          : slot.currency === "Gold Bars"
          ? "🪙"
          : "💎"}
      </div>
      <button style={{ padding: "8px 16px" }}>
        {slot.paid ? `${slot.value} Only!` : "Free!"}
      </button>
    </div>
  );

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h3>{title || "Untitled Offer"}</h3>

      <div>
        <button onClick={handlePrev} style={{ marginRight: 20 }}>◀</button>
        {slots.map((slot, index) =>
          renderSlot(slot, index === activeIndex)
        )}
        <button onClick={handleNext} style={{ marginLeft: 20 }}>▶</button>
      </div>
    </div>
  );
}
