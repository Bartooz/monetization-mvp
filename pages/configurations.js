import { useEffect, useState } from "react";

export default function ConfigurationsPage() {
  const [configurations, setConfigurations] = useState([]);
  const [configName, setConfigName] = useState("");
  const [slots, setSlots] = useState([
    { value: "", bonus: "", paid: false, currency: "Cash" },
    { value: "", bonus: "", paid: false, currency: "Cash" },
    { value: "", bonus: "", paid: false, currency: "Diamond" },
  ]);
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/configurations")
      .then((res) => res.json())
      .then((data) => setConfigurations(data));
  }, []);

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    setSlots(updatedSlots);
  };

  const resetForm = () => {
    setConfigName("");
    setSlots([
      { value: "", bonus: "", paid: false, currency: "Cash" },
      { value: "", bonus: "", paid: false, currency: "Cash" },
      { value: "", bonus: "", paid: false, currency: "Diamond" },
    ]);
    setEventType("Offer");
    setOfferType("Triple Offer");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const newConfig = {
      config_name: configName,
      event_type: eventType,
      offer_type: offerType,
      slots,
    };

    const url = editingId
      ? `http://localhost:4000/api/configurations/${editingId}`
      : "http://localhost:4000/api/configurations";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newConfig),
    });

    const result = await res.json();
    if (res.ok) {
      if (editingId) {
        setConfigurations((prev) =>
          prev.map((cfg) => (cfg.id === editingId ? result : cfg))
        );
      } else {
        setConfigurations((prev) => [...prev, result]);
      }
      resetForm();
    } else {
      alert(result.error || "Something went wrong.");
    }
  };

  const handleEdit = (config) => {
    setConfigName(config.config_name);
    setEventType(config.event_type);
    setOfferType(config.offer_type);
    setSlots(config.slots);
    setEditingId(config.id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:4000/api/configurations/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setConfigurations((prev) => prev.filter((cfg) => cfg.id !== id));
    } else {
      alert("Delete failed.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Manage Configurations</h1>

      <input
        value={configName}
        onChange={(e) => setConfigName(e.target.value)}
        placeholder="Configuration Name"
      />
      <br />
      <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
        <option value="Offer">Offer</option>
        <option value="Challenge">Challenge</option>
      </select>
      <select value={offerType} onChange={(e) => setOfferType(e.target.value)}>
        <option value="Triple Offer">Triple Offer</option>
        <option value="Other">Other</option>
      </select>

      <h3>Slots</h3>
      {slots.map((slot, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <input
            placeholder="Value"
            value={slot.value}
            onChange={(e) => handleSlotChange(index, "value", e.target.value)}
          />
          <input
            placeholder="Bonus"
            value={slot.bonus}
            onChange={(e) => handleSlotChange(index, "bonus", e.target.value)}
          />
          <input
            type="checkbox"
            checked={slot.paid}
            onChange={(e) => handleSlotChange(index, "paid", e.target.checked)}
          />{" "}
          Paid
          <select
            value={slot.currency}
            onChange={(e) =>
              handleSlotChange(index, "currency", e.target.value)
            }
          >
            <option value="Cash">Cash</option>
            <option value="Diamond">Diamond</option>
            <option value="Gold Bars">Gold Bars</option>
          </select>
        </div>
      ))}

      <button onClick={handleSubmit}>
        {editingId ? "Update Configuration" : "Create Configuration"}
      </button>
      {editingId && <button onClick={resetForm}>Cancel Edit</button>}

      <hr />
      <h2>Existing Configurations</h2>
      <ul>
        {configurations.map((cfg) => (
          <li key={cfg.id}>
            <strong>{cfg.config_name}</strong> – {cfg.offer_type} /{" "}
            {cfg.event_type}{" "}
            <button onClick={() => handleEdit(cfg)}>Edit</button>{" "}
            <button onClick={() => handleDelete(cfg.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


