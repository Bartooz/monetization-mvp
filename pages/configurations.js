import { useEffect, useState } from "react";

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [category, setCategory] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [configName, setConfigName] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  // 🔄 Fetch configurations from backend
  useEffect(() => {
    fetch("http://localhost:3001/configurations")
      .then((res) => res.json())
      .then((data) => setConfigurations(data))
      .catch((err) => console.error("Failed to fetch configurations", err));
  }, []);

  // Adjust slot count if offerType changes
  useEffect(() => {
    const count = offerType === "Triple Offer" ? 3 : 1;
    setSlots(Array(count).fill(0).map(() => defaultSlot()));
  }, [offerType]);

  const updateSlot = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = field === "paid" ? value === "true" : value;
    setSlots(updated);
  };

  const handleSave = async () => {
    const configToSave = {
      config_name: configName.trim() || "Untitled",
      event_type: category,
      offer_type: offerType,
      slots,
    };

    // Prevent duplicate config_name on creation
    const nameExists = configurations.some(
      (cfg) => cfg.config_name === configToSave.config_name && cfg.id !== editingId
    );
    if (nameExists) {
      alert("A configuration with that name already exists.");
      return;
    }

    try {
      if (editingId) {
        // ✏️ Edit
        const response = await fetch(`http://localhost:3001/configurations/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(configToSave),
        });
        const updated = await response.json();
        setConfigurations((prev) =>
          prev.map((cfg) => (cfg.id === editingId ? updated : cfg))
        );
        setEditingId(null);
      } else {
        // ➕ Create
        const response = await fetch("http://localhost:3001/configurations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(configToSave),
        });
        const created = await response.json();
        setConfigurations((prev) => [...prev, created]);
      }

      setConfigName("");
      setSlots(Array(offerType === "Triple Offer" ? 3 : 1).fill(0).map(() => defaultSlot()));
    } catch (err) {
      console.error("Failed to save configuration", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this configuration?")) return;
    try {
      await fetch(`http://localhost:3001/configurations/${id}`, { method: "DELETE" });
      setConfigurations((prev) => prev.filter((cfg) => cfg.id !== id));
    } catch (err) {
      console.error("Failed to delete configuration", err);
    }
  };

  const handleEdit = (cfg) => {
    setConfigName(cfg.config_name);
    setCategory(cfg.event_type);
    setOfferType(cfg.offer_type);
    setSlots(cfg.slots);
    setEditingId(cfg.id);
  };

  const cancelEdit = () => {
    setConfigName("");
    setSlots(Array(offerType === "Triple Offer" ? 3 : 1).fill(0).map(() => defaultSlot()));
    setEditingId(null);
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
          {/* Future types here */}
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
          marginRight: 10,
        }}
      >
        {editingId ? "Update" : "Save"} Configuration
      </button>
      {editingId && (
        <button
          onClick={cancelEdit}
          style={{
            padding: "10px 20px",
            background: "#999",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          Cancel Edit
        </button>
      )}

      <hr style={{ margin: "40px 0" }} />

      <h3>📦 Saved Configurations</h3>
      {configurations.length === 0 && <div>No configurations yet.</div>}
      {configurations.map((cfg) => (
        <div
          key={cfg.id}
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
            <strong>{cfg.config_name}</strong> — {cfg.event_type}, {cfg.offer_type}
          </div>
          <div>
            <button
              onClick={() => handleEdit(cfg)}
              style={{
                padding: "4px 10px",
                marginRight: 10,
                background: "#007bff",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(cfg.id)}
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
        </div>
      ))}
    </div>
  );
}

