import React, { useState } from "react";

export default function TripleOfferPreviewVerticalCarousel({ slots = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      style={{
        border: "2px solid #ccc",
        borderRadius: "12px",
        padding: "1rem",
        width: "300px",
        margin: "0 auto",
        background: "#fdfdfd",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>{title || "Untitled Offer"}</h3>
  
      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          height: "300px",
          position: "relative",
        }}
      >
        {slots.map((slot, index) => {
          const offset = (index - activeIndex + slots.length) % slots.length;
  
          let transform = "translate(-50%, -50%)";
          let zIndex = 2;
          let filter = "blur(2px)";
          let opacity = 0.6;
          let pointerEvents = "none";
  
          if (offset === 0) {
            transform += " translateY(0px) scale(1)";
            zIndex = 3;
            filter = "none";
            opacity = 1;
            pointerEvents = "auto";
          } else if (offset === 1) {
            transform += " translateY(60px) scale(0.85)";
          } else if (offset === 2) {
            transform += " translateY(-60px) scale(0.85)";
          } else {
            return null;
          }
  
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform,
                transition: "transform 0.4s ease, filter 0.4s ease, opacity 0.4s ease",
                width: "250px",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                background: "#fff",
                textAlign: "center",
                zIndex,
                filter,
                opacity,
                pointerEvents,
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                {slot.value} {slot.bonus ? `+ ${slot.bonus}` : ""}{" "}
                {slot.currency === "Cash" ? "💵" : slot.currency === "Gold Bars" ? "🪙" : "💎"}
              </div>
              <button
                style={{ padding: "6px 16px" }}
                onClick={() => setActiveIndex((activeIndex + 1) % slots.length)}
              >
                {slot.paid ? `${slot.value} Only!` : "Free!"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
  
}
