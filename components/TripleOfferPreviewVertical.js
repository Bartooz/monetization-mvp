import React from "react";

export default function TripleOfferPreviewVertical({ slots = [], title, design_data }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "300px",
          height: "420px",
          backgroundImage: design_data?.imageUrl ? `url(${design_data.imageUrl})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "16px",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h3
          style={{
            marginBottom: "1rem",
            textAlign: "center",
            fontFamily: design_data?.titleFont || "inherit",
            color: design_data?.titleColor || "#fff",
          }}
        >
          {title || "Untitled Offer"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {slots.map((slot, index) => (
            <div
              key={index}
              style={{
                width: "240px",
                padding: "12px 16px",
                borderRadius: "10px",
                textAlign: "center",
                fontFamily: design_data?.slotFont || "inherit",
                color: design_data?.slotFontColor || "#000",
                ...(design_data?.slotBackgroundColor
                  ? {
                      backgroundColor: design_data.slotBackgroundColor,
                      border: "1px solid #ccc",
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
                    }),
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
                  width: "100%",
                  padding: "6px",
                  backgroundColor: design_data?.ctaColor || "#00cc66",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
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


