import React, { useState } from "react";

export default function TripleOfferPreviewVerticalCarousel({ slots = [], title, design_data }) {
  const [activeIndex, setActiveIndex] = useState(0);

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
          alignItems: "center",
          justifyContent: "flex-start",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          position: "relative",
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

        <div
          style={{
            flexGrow: 1,
            width: "100%",
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
                  width: "240px",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  textAlign: "center",
                  fontFamily: design_data?.slotFont || "inherit",
                  color: design_data?.slotFontColor || "#000",
                  zIndex,
                  filter,
                  opacity,
                  pointerEvents,
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
                    padding: "6px 16px",
                    backgroundColor: design_data?.ctaColor || "#00cc66",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => setActiveIndex((activeIndex + 1) % slots.length)}
                >
                  {slot.paid ? `${slot.value} Only!` : "Free!"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}