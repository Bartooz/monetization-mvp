import { useEffect, useState } from "react";

const USE_BACKEND = false; // Toggle true to re-enable backend

const LOCAL_KEY = "configurations";

const loadLocalConfigurations = () => {
  const stored = localStorage.getItem(LOCAL_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalConfigurations = (configs) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(configs));
};


export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [configName, setConfigName] = useState("");
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [slots, setSlots] = useState([]);
  const [editingName, setEditingName] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

  useEffect(() => {
    fetchConfigurations();
  }, []);

  useEffect(() => {
    const count = offerType === "Triple Offer" ? 3 : 1;
    setSlots(Array(count).fill(0).map(() => defaultSlot()));
  }, [offerType]);

  const fetchConfigurations = async () => {
    if (USE_BACKEND) {
      try {
        const res = await fetch(`${BASE_URL}/api/configurations`);
        const data = await res.json();
        setConfigurations(data);
      } catch (err) {
        console.error("Failed to fetch configurations", err);
        setConfigurations([]);
      }
    } else {
      const localData = loadLocalConfigurations();
      setConfigurations(localData);
    }
  };

  const updateSlot = (index, field, value) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "paid" ? value === "true" || value === true : value,
      };
      return updated;
    });
  };

  const handleSave = async () => {
    const configToSave = {
      config_name: configName.trim(),
      event_type: eventType,
      offer_type: offerType,
      slots,
    };
  
    const duplicate = configurations.some(
      (cfg) =>
        cfg.config_name.toLowerCase() === configToSave.config_name.toLowerCase() &&
        cfg.config_name !== editingName
    );
    if (duplicate) {
      alert("A configuration with this name already exists.");
      return;
    }
  
    if (USE_BACKEND) {
      try {
        const method = editingName ? "PUT" : "POST";
        const endpoint = editingName
          ? `${BASE_URL}/api/configurations/${encodeURIComponent(editingName)}`
          : `${BASE_URL}/api/configurations`;
  
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(configToSave),
        });
  
        if (!res.ok) throw new Error("Save failed");
        await fetchConfigurations();
        resetForm();
      } catch (err) {
        console.error("Save error", err);
      }
    } else {
      const existing = loadLocalConfigurations();
      const filtered = existing.filter(
        (cfg) => cfg.config_name !== configToSave.config_name
      );
      const updated = [...filtered, configToSave];
      saveLocalConfigurations(updated);
      setConfigurations(updated);
      resetForm();
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
  
    if (USE_BACKEND) {
      try {
        const res = await fetch(
          `${BASE_URL}/api/configurations/${encodeURIComponent(name)}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Delete failed");
        await fetchConfigurations();
      } catch (err) {
        console.error("Delete error", err);
      }
    } else {
      const current = loadLocalConfigurations();
      const updated = current.filter((cfg) => cfg.config_name !== name);
      saveLocalConfigurations(updated);
      setConfigurations(updated);
    }
  };
  

  const resetForm = () => {
    setConfigName("");
    setEventType("Offer");
    setOfferType("Triple Offer");
    setSlots(Array(3).fill(0).map(() => defaultSlot()));
    setEditingName(null);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 800, margin: "auto" }}>
      <h2>⚙️ Configuration Manager</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Configuration Name"
          value={configName}
          onChange={(e) => setConfigName(e.target.value)}
          style={{ padding: 8, fontSize: 16, width: "100%" }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ padding: 8 }}>
          <option value="Offer">Offer</option>
          <option value="Mission">Mission</option>
        </select>

        <select value={offerType} onChange={(e) => setOfferType(e.target.value)} style={{ padding: 8 }}>
          <option value="Triple Offer">Triple Offer</option>
        </select>
      </div>

      <h4>🎛 Slot Configuration</h4>
      {slots.map((slot, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: 12,
            marginBottom: 10,
            background: "#fafafa",
          }}
        >
          <strong>Slot {idx + 1}</strong>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <input
              type="text"
              placeholder="Value"
              value={slot.value}
              onChange={(e) => updateSlot(idx, "value", e.target.value)}
              style={{ flex: 1, padding: 6 }}
            />
            <input
              type="text"
              placeholder="Bonus"
              value={slot.bonus}
              onChange={(e) => updateSlot(idx, "bonus", e.target.value)}
              style={{ flex: 1, padding: 6 }}
            />
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={slot.paid}
                onChange={(e) => updateSlot(idx, "paid", e.target.checked)}
              />
              <span style={{ marginLeft: 6 }}>Paid</span>
            </label>
            <select
              value={slot.currency}
              onChange={(e) => updateSlot(idx, "currency", e.target.value)}
              style={{ padding: 6 }}
            >
              {Object.entries(currencies).map(([key, icon]) => (
                <option key={key} value={key}>
                  {icon} {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
        <button
          onClick={handleSave}
          style={{ padding: "10px 20px", background: "#111", color: "#fff", border: "none", borderRadius: 6 }}
        >
          {editingName ? "Update" : "Create"} Configuration
        </button>
        {editingName && (
          <button
            onClick={resetForm}
            style={{ padding: "10px 20px", background: "#888", color: "#fff", border: "none", borderRadius: 6 }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <h3>📦 Existing Configurations</h3>
      {configurations.map((cfg) => (
        <div
          key={cfg.config_name}
          style={{
            padding: 10,
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{cfg.config_name}</strong> — {cfg.event_type} | {cfg.offer_type}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => handleEdit(cfg)} style={{ padding: "4px 12px" }}>
              Edit
            </button>
            <button onClick={() => handleDelete(cfg.config_name)} style={{ padding: "4px 12px", color: "red" }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}







