import React from "react";

export default function PhonePreviewWrapper({ children }) {
  return (
    <div
      style={{
        width: "360px",
        height: "640px",
        border: "12px solid #333",
        borderRadius: "40px",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        margin: "0 auto",
        backgroundColor: "#fefefe",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {children}
    </div>
  );
}
