import { useEffect, useState } from "react";

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [configName, setConfigName] = useState("");
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [slots, setSlots] = useState([]);
  const [editingName, setEditingName] = useState(null);

  const defaultSlot = () => ({
    value: "",
    bonus: "",
    paid: false,
    currency: "Cash",
  });

  const currencies = {
    Cash: "💵",
    "Gold Bars": "🪙",
    Diamond: "💎",
  };

  const fetchConfigurations = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/configurations");
      const data = await res.json();
      setConfigurations(data);
    } catch (err) {
      console.error("Failed to fetch configurations", err);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  useEffect(() => {
    const count = offerType === "Triple Offer" ? 3 : 1;
    setSlots(Array(count).fill(0).map(() => defaultSlot()));
  }, [offerType]);

  const updateSlot = (index, field, value) => {
    setSlots((prevSlots) => {
      const updated = [...prevSlots];
      updated[index] = { ...updated[index], [field]: field === "paid" ? value : value };
      return updated;
    });
  };

  const resetForm = () => {
    setConfigName("");
    setEventType("Offer");
    setOfferType("Triple Offer");
    setSlots(Array(3).fill(0).map(() => defaultSlot()));
    setEditingName(null);
  };

  const handleSave = async () => {
    const configToSave = {
      config_name: configName.trim(),
      event_type: eventType,
      offer_type: offerType,
      slots,
    };

    const exists = configurations.some(
      (cfg) => cfg.config_name === configToSave.config_name && cfg.config_name !== editingName
    );
    if (exists) {
      alert("A configuration with this name already exists.");
      return;
    }

    try {
      const method = editingName ? "PUT" : "POST";
      const endpoint = editingName
        ? `http://localhost:4000/api/configurations/${encodeURIComponent(editingName)}`
        : "http://localhost:4000/api/configurations";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configToSave),
      });

      if (!res.ok) throw new Error("Save failed");
      await fetchConfigurations();
      resetForm();
    } catch (err) {
      console.error("Failed to save", err);
    }
  };

  const handleEdit = (cfg) => {
    setConfigName(cfg.config_name);
    setEventType(cfg.event_type);
    setOfferType(cfg.offer_type);
    setSlots(cfg.slots);
    setEditingName(cfg.config_name);
  };

  const handleDelete = async (name) => {
    if (!window.confirm("Delete this configuration?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/configurations/${encodeURIComponent(name)}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");
      await fetchConfigurations();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 700, margin: "auto" }}>
      <h2>⚙️ Manage Configurations</h2>

      <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Configuration Name"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          style={{ padding: 8, fontSize: 16 }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ padding: 8 }}>
            <option value="Offer">Offer</option>
            <option value="Mission">Mission</option>
          </select>
          <select value={offerType} onChange={(e) => setOfferType(e.target.value)} style={{ padding: 8 }}>
            <option value="Triple Offer">Triple Offer</option>
          </select>
        </div>
      </div>

      <h4>Slots</h4>
      {slots.map((slot, idx) => (
        <div key={idx} style={{ marginBottom: 20, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <input
              value={slot.value}
              placeholder="Value"
              onChange={(e) => updateSlot(idx, "value", e.target.value)}
              style={{ flex: 1, padding: 6 }}
            />
            <input
              value={slot.bonus}
              placeholder="Bonus"
              onChange={(e) => updateSlot(idx, "bonus", e.target.value)}
              style={{ flex: 1, padding: 6 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="checkbox"
                checked={slot.paid}
                onChange={(e) => updateSlot(idx, "paid", e.target.checked)}
              />
              Paid
            </label>
            <select
              value={slot.currency}
              onChange={(e) => updateSlot(idx, "currency", e.target.value)}
              style={{ padding: 6 }}
            >
              {Object.entries(currencies).map(([k, v]) => (
                <option key={k} value={k}>
                  {v} {k}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
        <button onClick={handleSave} style={{ padding: "10px 20px", background: "#111", color: "#fff", border: "none", borderRadius: 4 }}>
          {editingName ? "Update" : "Create"} Configuration
        </button>
        {editingName && (
          <button onClick={resetForm} style={{ padding: "10px 20px", background: "#888", color: "#fff", border: "none", borderRadius: 4 }}>
            Cancel Edit
          </button>
        )}
      </div>

      <h3>📦 Existing Configurations</h3>
      {configurations.length === 0 && <p>No configurations yet.</p>}

      {configurations.map((cfg) => (
        <div key={cfg.config_name} style={{ padding: 12, background: "#f9f9f9", marginBottom: 10, borderRadius: 6 }}>
          <strong>{cfg.config_name}</strong> — {cfg.offer_type} / {cfg.event_type}
          <div style={{ marginTop: 6 }}>
            <button onClick={() => handleEdit(cfg)} style={{ marginRight: 10 }}>✏️ Edit</button>
            <button onClick={() => handleDelete(cfg.config_name)}>🗑 Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}




