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
        background: "#fff", // fallback if needed
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
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <h3
          style={{
            fontFamily: design_data?.titleFont || "inherit",
            color: design_data?.titleColor || "#fff",
            fontSize: "1.4rem",
            textAlign: "center",
            marginTop: 0,
            marginBottom: "0.75rem",
          }}
        >
          {title || "Untitled Offer"}
        </h3>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          {slots.map((slot, index) => (
            <div
              key={index}
              style={{
                width: "60px",
                height: "200px",
                borderRadius: "10px",
                padding: "10px 8px",
                color: design_data?.slotFontColor || "#000",
                fontFamily: design_data?.slotFont || "inherit",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
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
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)"
                  }),
              }}
            >
              <div style={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ fontWeight: "bold", fontSize: 13 }}>
                  {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
                  {slot.currency === "Cash"
                    ? "💵"
                    : slot.currency === "Gold Bars"
                      ? "🪙"
                      : "💎"}
                </div>
              </div>
              <div>
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

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


