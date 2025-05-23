import React, { useState } from "react";

export default function TripleOfferPreviewCarousel({ slots = [], title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const rotateLeft = () => {
    setActiveIndex((prev) => (prev - 1 + slots.length) % slots.length);
  };

  const rotateRight = () => {
    setActiveIndex((prev) => (prev + 1) % slots.length);
  };

  const getTransformStyle = (index) => {
    const offset = (index - activeIndex + slots.length) % slots.length;
    switch (offset) {
      case 0:
        return {
          transform: "translateX(0px) scale(1)",
          zIndex: 3,
          filter: "none",
          opacity: 1,
        };
      case 1:
        return {
          transform: "translateX(120px) scale(0.85)",
          zIndex: 2,
          filter: "blur(2px)",
          opacity: 0.7,
        };
      case 2:
        return {
          transform: "translateX(-120px) scale(0.85)",
          zIndex: 2,
          filter: "blur(2px)",
          opacity: 0.7,
        };
      default:
        return { display: "none" };
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem", position: "relative" }}>
      <h3 style={{ marginBottom: "1rem" }}>{title || "Untitled Offer"}</h3>
  
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          height: "260px",
          width: "100%",
        }}
      >
        {/* Left Arrow */}
        <button
          onClick={rotateLeft}
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            fontSize: "1.5rem",
          }}
        >
          ◀
        </button>
  
        {/* Center Wrapper for Carousel */}
        <div
          style={{
            position: "relative",
            width: "300px",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            perspective: "1000px",
          }}
        >
          {slots.map((slot, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                transition: "transform 0.4s ease, filter 0.4s ease, opacity 0.4s ease",
                width: "250px",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                background: "#fff",
                textAlign: "center",
                ...getTransformStyle(index),
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
              <button style={{ padding: "6px 16px" }}>
                {slot.paid ? `${slot.value} Only!` : "Free!"}
              </button>
            </div>
          ))}
        </div>
  
        {/* Right Arrow */}
        <button
          onClick={rotateRight}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            fontSize: "1.5rem",
          }}
        >
          ▶
        </button>
      </div>
    </div>
  );
  
}

