
import { useState, useEffect } from "react";

const defaultSlot = () => ({ value: "", bonus: "", paid: false, currency: "Cash" });

export default function Configurations() {
  const [configName, setConfigName] = useState("");
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [slots, setSlots] = useState([defaultSlot(), defaultSlot(), defaultSlot()]);
  const [configurations, setConfigurations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const currencies = {
    "Cash": "💵",
    "Gold Bars": "🏅",
    "Diamond": "💎"
  };

  useEffect(() => {
    fetch("http://localhost:4000/api/configurations")
      .then(res => res.json())
      .then(setConfigurations)
      .catch(err => console.error("Failed to fetch configurations", err));
  }, []);

  const resetForm = () => {
    setConfigName("");
    setEventType("Offer");
    setOfferType("Triple Offer");
    setSlots([defaultSlot(), defaultSlot(), defaultSlot()]);
    setEditingId(null);
    setError("");
  };

  const handleCreateOrUpdate = async () => {
    const payload = {
      config_name: configName.trim(),
      event_type: eventType,
      offer_type: offerType,
      slots,
    };

    const url = editingId
      ? `http://localhost:4000/api/configurations/${editingId}`
      : "http://localhost:4000/api/configurations";

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const updated = await res.json();
      const updatedList = editingId
        ? configurations.map(c => (c.config_name === editingId ? updated : c))
        : [...configurations, updated];

      setConfigurations(updatedList);
      resetForm();
    } catch (err) {
      console.error("Error saving configuration", err);
      setError("Could not save. Config name may already exist.");
    }
  };

  const handleEdit = (config) => {
    setConfigName(config.config_name);
    setEventType(config.event_type);
    setOfferType(config.offer_type);
    setSlots(config.slots);
    setEditingId(config.config_name);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this configuration?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/configurations/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setConfigurations(configurations.filter(c => c.config_name !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = field === "paid" ? value === "true" : value;
    setSlots(newSlots);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Manage Configurations</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Configuration Name"
        value={configName}
        onChange={e => setConfigName(e.target.value)}
      />
      <br />
      <select value={eventType} onChange={e => setEventType(e.target.value)}>
        <option>Offer</option>
        <option>Event</option>
      </select>
      <select value={offerType} onChange={e => setOfferType(e.target.value)}>
        <option>Triple Offer</option>
        <option>Double Offer</option>
      </select>

      <h3>Slots</h3>
      {slots.map((slot, i) => (
        <div key={i} style={{ marginBottom: "5px" }}>
          <input
            placeholder="Value"
            value={slot.value}
            onChange={e => updateSlot(i, "value", e.target.value)}
          />
          <input
            placeholder="Bonus"
            value={slot.bonus}
            onChange={e => updateSlot(i, "bonus", e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={slot.paid}
              onChange={e => updateSlot(i, "paid", String(e.target.checked))}
            /> Paid
          </label>
          <select
            value={slot.currency}
            onChange={e => updateSlot(i, "currency", e.target.value)}
          >
            {Object.keys(currencies).map(curr => (
              <option key={curr}>{curr}</option>
            ))}
          </select>
        </div>
      ))}

      <button onClick={handleCreateOrUpdate}>
        {editingId ? "Update Configuration" : "Create Configuration"}
      </button>
      {editingId && <button onClick={resetForm}>Cancel Edit</button>}

      <h2>Existing Configurations</h2>
      <ul>
        {configurations.map(cfg => (
          <li key={cfg.config_name}>
            <strong>{cfg.config_name}</strong> – {cfg.offer_type} / {cfg.event_type}
            <button onClick={() => handleEdit(cfg)}>Edit</button>
            <button onClick={() => handleDelete(cfg.config_name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


