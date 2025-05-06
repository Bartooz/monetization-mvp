import { useEffect, useState } from "react";

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [category, setCategory] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [configName, setConfigName] = useState("");

  const defaultSlot = () => ({
    value: "",
    bonus: "",
    paid: true,
    currency: "Cash",
  });

  const [slots, setSlots] = useState([defaultSlot(), defaultSlot(), defaultSlot()]);

  const currencies = {
    Cash: "💵",
    "Gold Bars": "🪙",
    Diamond: "💎",
  };

  useEffect(() => {
    const saved = localStorage.getItem("liveops-configurations");
    if (saved) setConfigurations(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("liveops-configurations", JSON.stringify(configurations));
  }, [configurations]);

  useEffect(() => {
    const count = offerType === "Triple Offer" ? 3 : 1;
    setSlots(Array(count).fill(0).map(() => defaultSlot()));
  }, [offerType]);

  const updateSlot = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = field === "paid" ? value === "true" : value;
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
    setSlots(Array(offerType === "Triple Offer" ? 3 : 1).fill(0).map(() => defaultSlot()));
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
          {/* Future types can be added here */}
        </select>
      </div>

      <h4>Slot Configuration</h4>
      {slots.map((slot, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 20,
            padding: 12,
            border: "1px solid #ccc",
            borderRadius: 8,
            background: "#f9f9f9",
          }}
        >
          <h5>Slot {idx + 1}</h5>
          <input
            type="text"
            value={slot.value}
            placeholder="Value"
            onChange={(e) => updateSlot(idx, "value", e.target.value)}
            style={{ marginBottom: 6, padding: 6, width: 200 }}
          />
          <br />
          <input
            type="text"
            value={slot.bonus}
            placeholder="Bonus (optional)"
            onChange={(e) => updateSlot(idx, "bonus", e.target.value)}
            style={{ marginBottom: 6, padding: 6, width: 200 }}
          />
          <br />
          <label>
            Paid:
            <select
              value={slot.paid.toString()}
              onChange={(e) => updateSlot(idx, "paid", e.target.value)}
              style={{ marginLeft: 6, marginBottom: 6, padding: 6 }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>
          <br />
          <label>
            Currency:
            <select
              value={slot.currency}
              onChange={(e) => updateSlot(idx, "currency", e.target.value)}
              style={{ marginLeft: 6, padding: 6 }}
            >
              {Object.entries(currencies).map(([name, emoji]) => (
                <option key={name} value={name}>
                  {emoji} {name}
                </option>
              ))}
            </select>
          </label>
        </div>
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
            background: "#f1f1f1",
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

