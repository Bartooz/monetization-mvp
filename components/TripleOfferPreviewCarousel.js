import React, { useState, useEffect, useRef } from "react";

export default function TripleOfferPreviewCarousel({ slots = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  const BASE_WIDTH = 360;

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const newScale = Math.max(0.5, Math.min(1.5, width / BASE_WIDTH));
        setScale(newScale);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        resize: "both",
        overflow: "auto",
        minWidth: "300px",
        maxWidth: "500px",
        minHeight: "400px",
        maxHeight: "800px",
        border: "2px solid #ccc",
        borderRadius: "12px",
        padding: "0.5rem",
        margin: "0 auto",
        background: "#fdfdfd",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${BASE_WIDTH}px`,
        }}
      >
        <h3 style={{ marginBottom: "1rem", textAlign: "center" }}>
          {title || "Untitled Offer"}
        </h3>

        <div
          style={{
            width: "100%",
            height: "240px",
            position: "relative",
          }}
        >
          {slots.map((slot, index) => {
            const offset = (index - activeIndex + slots.length) % slots.length;

            let transform = "translateX(-50%)";
            let zIndex = 2;
            let filter = "blur(2px)";
            let opacity = 0.6;
            let pointerEvents = "none";

            if (offset === 0) {
              transform += " translateX(0px) scale(1)";
              zIndex = 3;
              filter = "none";
              opacity = 1;
              pointerEvents = "auto";
            } else if (offset === 1) {
              transform += " translateX(60px) scale(0.85)";
            } else if (offset === 2) {
              transform += " translateX(-60px) scale(0.85)";
            } else {
              return null;
            }

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform,
                  transition:
                    "transform 0.4s ease, filter 0.4s ease, opacity 0.4s ease",
                  minWidth: "220px",
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
                  {slot.currency === "Cash"
                    ? "💵"
                    : slot.currency === "Gold Bars"
                    ? "🪙"
                    : "💎"}
                </div>
                <button
                  style={{ padding: "6px 16px" }}
                  onClick={() =>
                    setActiveIndex((activeIndex + 1) % slots.length)
                  }
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


