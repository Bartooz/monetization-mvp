import React, { useState, useEffect } from "react";
import TripleOfferEditor from "./TripleOfferEditor";

const TemplateCanvas = () => {
  const [offerType, setOfferType] = useState("Triple Offer");
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    const storedConfigs = JSON.parse(localStorage.getItem("liveops-configs") || "[]");
    setConfigurations(storedConfigs);
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Template Builder</h2>

      <label>Offer Type:</label>
      <select
        value={offerType}
        onChange={(e) => setOfferType(e.target.value)}
        style={{ width: "300px", marginBottom: "2rem" }}
      >
        <option value="Triple Offer">Triple Offer</option>
        {/* Add more offer types here later */}
      </select>

      {offerType === "Triple Offer" && (
        <TripleOfferEditor
          configurations={configurations}
          offerType={offerType}
        />
      )}
    </div>
  );
};

export default TemplateCanvas;
