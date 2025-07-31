import React from "react";

export default function TripleOfferPreviewHorizontal({ slots = [], title, design_data }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        boxSizing: "border-box",
        backgroundImage: design_data?.imageUrl ? `url(${design_data.imageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: "2px solid #ccc",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          width: "100%",
        }}
      >
        <h3
          style={{
            fontFamily: design_data?.titleFont || "inherit",
            color: design_data?.titleColor || "#000",
            textAlign: "center",
            margin: 0,
          }}
        >
          {title || "Untitled Offer"}
        </h3>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {slots.map((slot, index) => (
            <div
              key={index}
              style={{
                width: "160px",
                height: "160px",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                background: design_data?.slotBackgroundColor || "#fff",
                fontFamily: design_data?.slotFont || "inherit",
                color: design_data?.slotFontColor || "#000",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
                {slot.currency === "Cash"
                  ? "💵"
                  : slot.currency === "Gold Bars"
                  ? "🪙"
                  : "💎"}
              </div>
              <button
                style={{
                  padding: "6px 16px",
                  backgroundColor: design_data?.ctaColor || "#00cc66",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {slot.paid ? `${slot.value} Only!` : "Free!"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
