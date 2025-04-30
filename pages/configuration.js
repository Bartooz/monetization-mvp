// pages/configuration.js
import { useEffect, useState } from "react";

export default function ConfigurationPage() {
  const [configurations, setConfigurations] = useState([]);
  const [newConfig, setNewConfig] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("liveops-configurations");
    if (saved) {
      setConfigurations(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("liveops-configurations", JSON.stringify(configurations));
  }, [configurations]);

  const handleAddConfig = () => {
    if (!newConfig.trim()) return;

    const exists = configurations.some(c => c.toLowerCase() === newConfig.trim().toLowerCase());
    if (exists) return alert("Configuration already exists");

    setConfigurations([...configurations, newConfig.trim()]);
    setNewConfig("");
  };

  return (
    <div>
      <h2 style={{ marginBottom: 10 }}>⚙️ Configuration Manager</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter new configuration name"
          value={newConfig}
          onChange={(e) => setNewConfig(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <button
          onClick={handleAddConfig}
          style={{ padding: "8px 12px", background: "#111", color: "white", border: "none", borderRadius: 4 }}
        >
          ➕ Add Configuration
        </button>
      </div>

      <ul style={{ paddingLeft: 20 }}>
        {configurations.map((c, idx) => (
          <li key={idx} style={{ marginBottom: 6 }}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
