import { useState } from "react";

export default function TemplateCanvas({
  title,
  setTitle,
  cta,
  setCta,
  slots,
  setSlots,
}) {
  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  return (
    <div
      style={{
        background: "#f2f2f2",
        borderRadius: 12,
        padding: 20,
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
      }}
    >
      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Title"
        style={{
          width: "100%",
          padding: 10,
          fontSize: 22,
          fontWeight: "bold",
          borderRadius: 6,
          marginBottom: 20,
          border: "1px solid #ccc",
        }}
      />

      {/* Offer Slots */}
      {slots.map((slot, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            border: "1px solid #aaa",
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          <input
            value={slot.label}
            onChange={(e) => handleSlotChange(index, "label", e.target.value)}
            placeholder="Label"
            style={{
              width: "90%",
              padding: 6,
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 6,
            }}
          />
          <input
            value={slot.bonus}
            onChange={(e) => handleSlotChange(index, "bonus", e.target.value)}
            placeholder="Bonus (optional)"
            style={{
              width: "90%",
              padding: 5,
              fontSize: 14,
              color: "#666",
            }}
          />
        </div>
      ))}

      {/* CTA Button */}
      <input
        value={cta}
        onChange={(e) => setCta(e.target.value)}
        placeholder="CTA Text"
        style={{
          marginTop: 10,
          width: "100%",
          padding: 12,
          fontWeight: "bold",
          fontSize: 18,
          textAlign: "center",
          borderRadius: 8,
          background: "#11aa44",
          color: "white",
          border: "none",
        }}
      />
    </div>
  );
}
