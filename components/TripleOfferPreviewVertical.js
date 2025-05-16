import React from "react";

export default function TripleOfferPreviewVertical({ slots = [], title }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8, maxWidth: 400 }}>
      <h4 style={{ marginBottom: 16 }}>{title || "Untitled Offer"}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {slots.map((slot, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: 10,
              borderRadius: 6,
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 6 }}>
              {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
              {slot.currency === "Cash"
                ? "💵"
                : slot.currency === "Gold Bars"
                ? "🪙"
                : "💎"}
            </div>
            <button style={{ width: "100%", padding: "6px" }}>
              {slot.paid ? `${slot.value} Only!` : "Free!"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

