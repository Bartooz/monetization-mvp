import React from "react";

export default function TripleOfferPreviewHorizontal({ slots = [], title, design_data }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: 16,
      borderRadius: 8,
      maxWidth: 600,
      backgroundImage: design_data?.imageUrl ? `url(${design_data.imageUrl})` : "none",
      fontFamily: design_data?.titleFont || "inherit",
    }}>
      <h4 style={{ marginBottom: 16 }}>{title || "Untitled Offer"}</h4>
      <div style={{ display: "flex", gap: 16 }}>
        {slots.map((slot, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 6,
              textAlign: "center",
              background: design_data?.slotBackgroundColor || "#fff",
              backgroundSize: "cover",
              backgroundPosition: "center",
              fontFamily: design_data?.slotFont || "inherit",

            }}
          >
            <div style={{
              fontWeight: "bold", marginBottom: 6, 
              
            }}>
              {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
              {slot.currency === "Cash"
                ? "💵"
                : slot.currency === "Gold Bars"
                  ? "🪙"
                  : "💎"}
            </div>
            <button style={{
              width: "100%", padding: "6px", backgroundColor: design_data?.ctaColor || "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
            }}>
              {slot.paid ? `${slot.value} Only!` : "Free!"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
