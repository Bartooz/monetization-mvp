import React from "react";

export default function TripleOfferPreviewHorizontal({ slots = [], title, design_data }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
      <h3
        style={{
          fontFamily: design_data?.titleFont || "inherit",
          color: design_data?.titleColor || "#000",
          textAlign: "center",
          margin: 0,
          marginBottom: "1rem",
        }}
      >
        {title || "Untitled Offer"}
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {slots.map((slot, index) => (
          <div
            key={index}
            style={{
              width: "100px",
              height: "180px",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              background: design_data?.slotBackgroundColor || "#fff",
              fontFamily: design_data?.slotFont || "inherit",
              color: design_data?.slotFontColor || "#000",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ marginTop: "auto", marginBottom: "auto" }}>
              <div style={{ fontWeight: "bold", fontSize: 14 }}>
                {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
                {slot.currency === "Cash"
                  ? "💵"
                  : slot.currency === "Gold Bars"
                  ? "🪙"
                  : "💎"}
              </div>
            </div>

            <button
              style={{
                padding: "6px 12px",
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
  );
}

