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
        backgroundImage: design_data?.imageUrl ? `url(${design_data.imageUrl})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "320px",
          borderRadius: "12px",
          padding: "1rem",
          backgroundColor: "rgba(255,255,255,0.05)", // translucent to reveal bg
          backdropFilter: "blur(4px)",
          border: "2px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            fontFamily: design_data?.titleFont || "inherit",
            color: design_data?.titleColor || "#fff",
            fontSize: "1.2rem",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          {title || "Untitled Offer"}
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
          }}
        >
          {slots.map((slot, index) => (
            <div
              key={index}
              style={{
                width: "80px",
                height: "140px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                padding: "10px 8px",
                backgroundColor: design_data?.slotBackgroundColor || "#fff",
                color: design_data?.slotFontColor || "#000",
                fontFamily: design_data?.slotFont || "inherit",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: 13 }}>
                {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
                {slot.currency === "Cash"
                  ? "💵"
                  : slot.currency === "Gold Bars"
                  ? "🪙"
                  : "💎"}
              </div>

              <button
                style={{
                  padding: "4px 8px",
                  fontSize: "0.75rem",
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


