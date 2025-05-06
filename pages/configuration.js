import { useEffect, useState } from "react";

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [category, setCategory] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [configName, setConfigName] = useState("");
  const [slots, setSlots] = useState([
    { value: "" },
    { value: "" },
    { value: "" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("liveops-configurations");
    if (saved) setConfigurations(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("liveops-configurations", JSON.stringify(configurations));
  }, [configurations]);

  useEffect(() => {
    // Reset slot count when offerType changes
    const slotCount = offerType === "Triple Offer" ? 3 : 1;
    setSlots(Array(slotCount).fill({ value: "" }));
  }, [offerType]);

  const updateSlot = (index, value) => {
    const updated = [...slots];
    updated[index] = { value };
    setSlots(updated);
  };

  const handleSave = () => {
    const newConfig = {
      name: configName.trim() || "Untitled",
      category,
      offerType,
      slots,
    };
    setConfigurations([...configurations, newConfig]);
    setConfigName("");
    setSlots(Array(offerType === "Triple Offer" ? 3 : 1).fill({ value: "" }));
  };

  const handleDelete = (index) => {
    const updated = [...configurations];
    updated.splice(index, 1);
    setConfigurations(updated);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h2>⚙️ Configuration Builder</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Config Name:</label>
        <input
          type="text"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          style={{ padding: 6 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 6 }}>
          <option value="Offer">Offer</option>
          <option value="Mission">Mission</option>
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Offer Type:</label>
        <select value={offerType} onChange={(e) => setOfferType(e.target.value)} style={{ padding: 6 }}>
          <option value="Triple Offer">Triple Offer</option>
          {/* Future: Timer, Mystery, Buy-All etc. */}
        </select>
      </div>

      <h4>Slot Configuration</h4>
      {slots.map((slot, idx) => (
        <input
          key={idx}
          value={slot.value}
          onChange={(e) => updateSlot(idx, e.target.value)}
          placeholder={`Slot ${idx + 1} value`}
          style={{ display: "block", marginBottom: 10, padding: 6, width: 300 }}
        />
      ))}

      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6,
        }}
      >
        Save Configuration
      </button>

      <hr style={{ margin: "40px 0" }} />

      <h3>📦 Saved Configurations</h3>
      {configurations.length === 0 && <div>No configurations yet.</div>}
      {configurations.map((cfg, idx) => (
        <div
          key={idx}
          style={{
            background: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{cfg.name}</strong> — {cfg.category}, {cfg.offerType}
          </div>
          <button
            onClick={() => handleDelete(idx)}
            style={{
              padding: "4px 10px",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            🗑 Delete
          </button>
        </div>
      ))}
    </div>
  );
}
