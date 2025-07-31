import React from "react";

export default function PhonePreviewWrapper({ children }) {
  return (
    <div
      style={{
        position: "relative",
        width: "360px",
        height: "720px",
        margin: "0 auto",
      }}
    >
      {/* Phone Frame PNG */}
      <img
        src="/backgrounds/assets/iphone-frame.png"
        alt="Phone Frame"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Template Content Inside Screen */}
      <div
        style={{
          position: "absolute",
          top: "52px",     // adjust based on phone image's screen area
          left: "22px",
          width: "316px",
          height: "616px",
          zIndex: 2,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

