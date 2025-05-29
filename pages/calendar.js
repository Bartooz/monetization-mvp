
import { useState, useEffect } from "react";

export default function Configurations() {
  const [configurations, setConfigurations] = useState([]);
  const [configName, setConfigName] = useState("");
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [slots, setSlots] = useState([
    { value: "", bonus: "", paid: false, currency: "Cash" },
    { value: "", bonus: "", paid: false, currency: "Cash" },
    { value: "", bonus: "", paid: false, currency: "Cash" },
  ]);
  const [editing, setEditing] = useState(null);

  const fetchConfigurations = async () => {
    const res = await fetch("http://localhost:4000/api/configurations");
    const data = await res.json();
    setConfigurations(data);
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const handleSlotChange = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = field === "paid" ? value.target.checked : value.target.value;
    setSlots(updated);
  };

  const resetForm = () => {
    setConfigName("");
    setEventType("Offer");
    setOfferType("Triple Offer");
    setSlots([
      { value: "", bonus: "", paid: false, currency: "Cash" },
      { value: "", bonus: "", paid: false, currency: "Cash" },
      { value: "", bonus: "", paid: false, currency: "Cash" },
    ]);
    setEditing(null);
  };

  const handleSave = async () => {
    const config = {
      config_name: configName.trim(),
      event_type: eventType,
      offer_type: offerType,
      slots,
    };

    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `http://localhost:4000/api/configurations/${encodeURIComponent(editing)}`
      : "http://localhost:4000/api/configurations";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) throw new Error("Save failed");
      await fetchConfigurations();
      resetForm();
    } catch (err) {
      console.error("Save error", err);
    }
  };

  const handleEdit = (cfg) => {
    setConfigName(cfg.config_name);
    setEventType(cfg.event_type);
    setOfferType(cfg.offer_type);
    setSlots(cfg.slots);
    setEditing(cfg.config_name);
  };

  const handleDelete = async (config_name) => {
    try {
      await fetch(`http://localhost:4000/api/configurations/${encodeURIComponent(config_name)}`, {
        method: "DELETE",
      });
      await fetchConfigurations();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Configuration Manager</h2>

      <input
        placeholder="Configuration Name"
        value={configName}
        onChange={(e) => setConfigName(e.target.value)}
      />
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="Offer">Offer</option>
        <option value="Event">Event</option>
      </select>
      <select value={offerType} onChange={(e) => setOfferType(e.target.value)}>
        <option value="Triple Offer">Triple Offer</option>
        <option value="Other">Other</option>
      </select>

      <h4>Slot Configuration</h4>
      {slots.map((slot, i) => (
        <div key={i}>
          <input
            placeholder="Value"
            value={slot.value}
            onChange={(e) => handleSlotChange(i, "value", e)}
          />
          <input
            placeholder="Bonus"
            value={slot.bonus}
            onChange={(e) => handleSlotChange(i, "bonus", e)}
          />
          <label>
            <input
              type="checkbox"
              checked={slot.paid}
              onChange={(e) => handleSlotChange(i, "paid", e)}
            />
            Paid
          </label>
          <select
            value={slot.currency}
            onChange={(e) => handleSlotChange(i, "currency", e)}
          >
            <option>Cash</option>
            <option>Gold Bars</option>
            <option>Diamond</option>
          </select>
        </div>
      ))}

      <button onClick={handleSave}>{editing ? "Update" : "Create"} Configuration</button>
      {editing && <button onClick={resetForm}>Cancel</button>}

      <h3>Existing Configurations</h3>
      <ul>
        {configurations.map((cfg) => (
          <li key={cfg.config_name}>
            <strong>{cfg.config_name}</strong> — {cfg.offer_type} / {cfg.event_type}
            <button onClick={() => handleEdit(cfg)}>Edit</button>
            <button onClick={() => handleDelete(cfg.config_name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}























