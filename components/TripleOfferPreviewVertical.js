import React from "react";

const TripleOfferPreviewVertical = ({ slots = [], title = "Template Title" }) => {
  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", background: "#fafafa", borderRadius: "6px" }}>
      <h3 style={{ textAlign: "center" }}>{title}</h3>
      {slots.map((slot, index) => (
        <div key={index} style={{ padding: "1rem", margin: "0.5rem 0", border: "1px solid #ddd", textAlign: "center" }}>
          <div><strong>{slot.title}</strong></div>
          <button style={{ marginTop: "0.5rem", padding: "0.3rem 1rem", background: "green", color: "white", border: "none", borderRadius: "4px" }}>
            {slot.cta || "Buy"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TripleOfferPreviewVertical;
