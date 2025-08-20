import { useEffect, useState } from "react";

const USE_BACKEND = false; // Toggle true to re-enable backend

const LOCAL_KEY = "configurations";

const normalizeConfigs = (arr) =>
  arr.map((c) => ({
    ...c,
    created_at: c.created_at || new Date().toISOString(),
    favorite: !!c.favorite,
  }));

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
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState("Offer");
  const [offerType, setOfferType] = useState("Triple Offer");
  const [slots, setSlots] = useState([]);
  const [editingName, setEditingName] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterEvent, setFilterEvent] = useState("All");
  const [filterOffer, setFilterOffer] = useState("All");
  const [filterFavOnly, setFilterFavOnly] = useState(false);
  const [filterFrom, setFilterFrom] = useState(""); // YYYY-MM-DD
  const [filterTo, setFilterTo] = useState("");     // YYYY-MM-DD

  const resetFilters = () => {
    setFilterName("");
    setFilterEvent("All");
    setFilterOffer("All");
    setFilterFavOnly(false);
    setFilterFrom("");
    setFilterTo("");
  };


  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const defaultSlot = () => ({
    value: "",
    bonus: "",
    paid: false,
    currency: "Cash",
  });

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
        setConfigurations(normalizeConfigs(data || []));
      } catch (err) {
        console.error("Failed to fetch configurations", err);
        setConfigurations([]);
      }
    } else {
      const localData = loadLocalConfigurations();
      const normalized = normalizeConfigs(localData);
      // persist normalization once if needed
      if (JSON.stringify(localData) !== JSON.stringify(normalized)) {
        saveLocalConfigurations(normalized);
      }
      setConfigurations(normalized);
    }
  };

  useEffect(() => {
    if (!showModal) {
      document.body.style.overflow = "";
      return;
    }
    // Lock background scroll
    document.body.style.overflow = "hidden";

    // Close on ESC
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);

    // Focus first input inside modal
    setTimeout(() => {
      const firstInput = document.querySelector('#config-form-body input');
      if (firstInput) firstInput.focus();
    }, 0);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [showModal]);


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
    const existingEditing = editingName
      ? configurations.find((c) => c.config_name === editingName)
      : null;

    const configToSave = {
      config_name: configName.trim(),
      event_type: eventType,
      offer_type: offerType,
      slots,
      created_at: existingEditing?.created_at || new Date().toISOString(),
      favorite: existingEditing?.favorite ?? false,
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
        setShowModal(false);
      } catch (err) {
        console.error("Save error", err);
      }
    } else {
      const existing = loadLocalConfigurations();
      const filtered = existing.filter(
        (cfg) => cfg.config_name !== (editingName || configToSave.config_name)
      );
      const updated = [...filtered, configToSave];
      saveLocalConfigurations(updated);
      setConfigurations(updated);
      resetForm();
      setShowModal(false);
    }
  };


  const handleEdit = (cfg) => {
    setConfigName(cfg.config_name);
    setEventType(cfg.event_type);
    setOfferType(cfg.offer_type);
    setSlots(cfg.slots);
    setEditingName(cfg.config_name);
    setShowModal(true);
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

  const toggleFavorite = async (name) => {
    const cfg = configurations.find((c) => c.config_name === name);
    if (!cfg) return;
    const updatedCfg = { ...cfg, favorite: !cfg.favorite };

    if (USE_BACKEND) {
      try {
        const res = await fetch(
          `${BASE_URL}/api/configurations/${encodeURIComponent(name)}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCfg),
          }
        );
        if (!res.ok) throw new Error("Favorite update failed");
        await fetchConfigurations();
      } catch (err) {
        console.error("Favorite toggle error", err);
      }
    } else {
      const updated = configurations.map((c) =>
        c.config_name === name ? updatedCfg : c
      );
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
    setShowModal(false);
  };


  const visibleConfigs = configurations.filter((cfg) => {
    if (filterFavOnly && !cfg.favorite) return false;
    if (filterEvent !== "All" && cfg.event_type !== filterEvent) return false;
    if (filterOffer !== "All" && cfg.offer_type !== filterOffer) return false;
    if (filterName && !cfg.config_name.toLowerCase().includes(filterName.toLowerCase())) return false;

    if (filterFrom || filterTo) {
      const ts = cfg.created_at ? new Date(cfg.created_at).getTime() : 0;
      const fromTs = filterFrom ? new Date(filterFrom).getTime() : -Infinity;
      // include entire end day
      const toTs = filterTo ? new Date(`${filterTo}T23:59:59`).getTime() : Infinity;
      if (ts < fromTs || ts > toTs) return false;
      console.log({
        total: configurations.length,
        visible: visibleConfigs.length,
        filterFavOnly,
        filterEvent,
        filterOffer,
        filterName,
        filterFrom,
        filterTo,
        favoritesInState: configurations.filter(c => c.favorite).length
      });

    }
    return true;
  });

  return (
    <div className="page">
      <div className="page-margin">

      <div className="page-header">
        <div>
          <h1 className="page-title">Configuration Manager</h1>
          <p className="page-subtitle">Create and manage configurations for your offer templates</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">+ Create Configuration</button>
      </div>
      

      {/* MODAL: only mounts when showModal is true */}
      {showModal && (
        <>
          {/* overlay */}
          <div
            onClick={closeModal}
            className="modal-overlay" />
          {/* modal panel */}

          <div
            role="dialog"
            aria-modal="true"
            className="modal-container"
          >
            <div
              className="modal-panel"
              onClick={(e) => e.stopPropagation()}
            >
              {/* modal header */}
              <div className="modal-header">
                <h3 className="modal-title">
                  {editingName ? "Edit Configuration" : "Create New Configuration"}
                </h3>
                <button onClick={closeModal} aria-label="Close" className="icon-btn">×</button>

              </div>

              {/* ---------- FORM GOES HERE ---------- */}
              <div id="config-form-body">
                <div style={{ marginBottom: 20 }}>
                  <input
                    type="text"
                    placeholder="Configuration Name"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="input input-lg w-full"
                  />
                </div>

                <div className="row gap">
                  <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="select">
                    <option value="Offer">Offer</option>
                    <option value="Mission">Mission</option>
                  </select>

                  <select value={offerType} onChange={(e) => setOfferType(e.target.value)} className="select">
                    <option value="Triple Offer">Triple Offer</option>
                  </select>
                </div>

                <h4 className="section-title">🎛 Slot Configuration</h4>
                {slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className="card slot-card"
                  >
                    <strong className="slot-title" data-index={idx + 1}>Slot {idx + 1}</strong>
                    <div className="slot-row">
                      <input
                        type="text"
                        placeholder="Value"
                        value={slot.value}
                        onChange={(e) => updateSlot(idx, "value", e.target.value)}
                        className="select"
                      />
                      <input
                        type="text"
                        placeholder="Bonus"
                        value={slot.bonus}
                        onChange={(e) => updateSlot(idx, "bonus", e.target.value)}
                        className="select"
                      />
                      <label style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="checkbox"
                          className="checkbox"
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

                <div className="row gap actions">
                  <button onClick={handleSave} className="btn btn-primary">
                    {editingName ? "Update" : "Create"} Configuration
                  </button>
                  {editingName && (
                    <button onClick={resetForm} className="btn btn-secondary">Cancel Edit</button>

                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <hr className="divider" />

      <h3>📦 Existing Configurations</h3>
      <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 6 }}>
        Showing {visibleConfigs.length} of {configurations.length}
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name…"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="input"
        />

        <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)} className="select">
          <option value="All">All events</option>
          <option value="Offer">Offer</option>
          <option value="Mission">Mission</option>
        </select>

        <select value={filterOffer} onChange={(e) => setFilterOffer(e.target.value)} className="select">
          <option value="All">All offers</option>
          <option value="Triple Offer">Triple Offer</option>
        </select>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={filterFavOnly}
            onChange={(e) => setFilterFavOnly(e.target.checked)}
          />
          <span>Favorites</span>
        </label>

        <input
          type="date"
          value={filterFrom}
          onChange={(e) => setFilterFrom(e.target.value)}
          className="input"
        />
        <input
          type="date"
          value={filterTo}
          onChange={(e) => setFilterTo(e.target.value)}
          className="input"
        />

        <button onClick={resetFilters} className="btn btn-secondary">Reset</button>
      </div>


      <div className="config-grid">
        {visibleConfigs.length === 0 ? (
          <div className="empty-note">No configurations yet. Click “Create Configuration”.</div>
        ) : (
          visibleConfigs.map((cfg) => (
            <div key={cfg.config_name} className="card config-card">
              <div className="config-card__header">
                <div className="config-name">{cfg.config_name}</div>
                <div className="config-actions">

                  {/* Favorite */}
                  <button
                    className={`icon-btn star ${cfg.favorite ? "active" : ""}`}
                    aria-label={`Favorite ${cfg.config_name}`}
                    title={cfg.favorite ? "Unfavorite" : "Mark favorite"}
                    onClick={() => toggleFavorite(cfg.config_name)}
                  >
                    {/* star icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={cfg.favorite ? "currentColor" : "none"}>
                      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
                        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>


                  {/* Edit */}
                  <button
                    className="icon-btn"
                    aria-label={`Edit ${cfg.config_name}`}
                    title="Edit"
                    onClick={() => handleEdit(cfg)}
                  >
                    {/* pencil icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M15.232 5.232a2.5 2.5 0 1 1 3.536 3.536L8.5 19.036l-4 1 1-4 9.732-10.804Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    className="icon-btn danger"
                    aria-label={`Delete ${cfg.config_name}`}
                    title="Delete"
                    onClick={() => handleDelete(cfg.config_name)}
                  >
                    {/* trash icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M4 7h16M9 7v-.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V7m-6 0h6m-8 0 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="config-card__meta">
                <span className="pill">{cfg.event_type}</span>
                <span className="pill pill--accent">{cfg.offer_type}</span>

              </div>
              <div className="config-date">
                Created: {cfg.created_at ? new Date(cfg.created_at).toLocaleDateString() : "—"}
              </div>
            </div>
          ))
        )}
        </div>
      </div>

      <style jsx global>{`
  :root{
    --navy:#0b1b34;         /* deep navy from landing vibe */
    --marine:#1f4dd9;     /* slightly deeper, less neon */
    --bg:#f5f7fb;           /* app workspace bg */
    --card:#ffffff;         /* surfaces */
    --text:#0f172a;         /* primary text */
    --muted:#667085;
    --line:#e6e8ee;         /* dividers */
    --red:#e11d48;          /* delete */
    --radius:10px;
    --container: var(--container, 1200px);
    --shell-pad: var(--shell-pad, 32px);
  }

  .page{
    max-width: var(--container);
  margin: 0 auto;
  padding: 40px var(--shell-pad);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Inter", "Helvetica Neue", Arial;
  color: var(--text);
  background: var(--bg);
  min-height: calc(100vh - 64px)
  }

  .page-margin{
  margin: 0 3rem 0 3rem;
  }

  .page-header{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; }
  

  .page-title{
  margin:2rem 0 0 0;
  font-size: clamp(28px, 3.6vw, 40px);
  line-height:1.15;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #0b1220;
}

.page-subtitle{
  margin:6px 0 0 0;
  color: var(--muted);
  font-size: 14.5px;
}

  .divider{
    border:0; border-top:1px solid var(--line); margin:24px 0;
  }

  /* Layout helpers */
  .row{ display:flex; align-items:center; }
  .gap{ gap:12px; }
  .actions{ margin:20px 0 28px 0; }

  /* Buttons */
  .btn{
    display:inline-flex; align-items:center; justify-content:center;
    padding:10px 16px; border-radius:10px; border:none; cursor:pointer;
    font-weight:600; transition: box-shadow .12s, transform .04s, background .12s, color .12s;
  }
  .btn:active{ transform: translateY(1px); }
  .btn-primary{ background:var(--navy); color:#fff; }
  .btn-primary:hover{ box-shadow:0 8px 18px rgba(11,27,52,.18); }
  .btn-secondary{ background:#eef1f7; color:#0f172a; }
  .btn-secondary:hover{ background:#e7ebf4; }
  .btn-link{
    background:transparent; border:none; padding:4px 8px; cursor:pointer;
    color:var(--marine); font-weight:600;
  }
  .btn-link:hover{ text-decoration:underline; }
  .btn-link.danger{ color:var(--red); }

  /* Inputs */
  .input, .select{
    width:100%;
    padding:10px 12px; border:1px solid var(--line); border-radius:10px;
    background:#fff; outline:none; transition: box-shadow .12s, border-color .12s;
  }
  .input:focus, .select:focus{
    border-color:var(--marine); box-shadow:0 0 0 3px rgba(37,99,235,.15);
  }
  .input-lg{ padding:12px 14px; font-size:16px; }
  .flex-1{ flex:1; }
  .w-full{ width:100%; }

  .checkbox{ display:flex; align-items:center; gap:8px; color:var(--text); }

  /* Cards */
  .card{
  background:var(--card);
  border:1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: 0 1px 2px rgba(16,24,40,.04);
}
  .slot-card{ padding:14px 16px; margin-bottom:12px; }
  .section-title{
  font-size:16px; font-weight:700; color:var(--text);
  padding:8px 12px; border-radius:10px; border:1px solid var(--line);
  background:#fff;   /* was gradient */
  margin:16px 0 8px 0;
}

  /* Slot header with numbered dot (playful) */
  .slot-title{
    display:flex; align-items:center; gap:10px; font-size:14px;
  }
  .slot-title::before{
    content: attr(data-index);
    display:inline-flex; align-items:center; justify-content:center;
    width:22px; height:22px; border-radius:999px;
    background:var(--marine); color:#fff; font-size:12px; font-weight:700;
  }

  /* Slot row layout */
  .slot-row{
    display:grid; grid-template-columns: 1fr 1fr minmax(160px, 220px) auto;
    gap:12px; margin-top:10px; align-items:center;
  }

  /* Modal */
  .modal-overlay{
    position:fixed; inset:0; background: rgba(15,23,42,.45); z-index:999;
    backdrop-filter: blur(2px);
  }
  .modal-container{
    position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:1000;
  }
  .modal-panel{
    width:min(960px, 92vw); max-height:90vh; overflow:auto; background:#fff;
    border-radius:14px; box-shadow:0 14px 40px rgba(2,6,23,.35); padding:24px;
    border:1px solid var(--line);
  }
  .modal-header{
    display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;
  }
  .modal-title{ margin:0; font-size:20px; font-weight:800; color:var(--text); }
  .icon-btn{
    appearance:none; border:none; background:#f4f5f7; color:#1f2937;
    width:34px; height:34px; border-radius:10px;
    display:inline-flex; align-items:center; justify-content:center;
    cursor:pointer; transition: background .12s, box-shadow .12s, transform .04s;
}
  .icon-button:hover{ color:var(--text); }

  /* Config list rows */
  .config-row{
    display:flex; align-items:center; justify-content:space-between;
    padding:12px 14px; border:1px solid var(--line); border-radius:10px;
    margin-bottom:10px; background:#fff; transition: box-shadow .12s, transform .04s;
  }
  .config-row:hover{ box-shadow:0 6px 16px rgba(2,6,23,.06); }

  /* Grid of config cards */
.config-grid{
  display:grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap:20px;
  margin-top:12px;
}

/* Card details */
.config-card{ padding:16px; }
.config-card__header{
  display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px;
}
.config-name{ font-weight:800; font-size:18px; letter-spacing:-0.2px; }
.config-card{ padding:16px 16px 14px; }
.config-card__header{ margin-bottom:8px; }
.config-date{ margin-top:2px; font-size:12px; color:var(--muted); }
/* Pills (badges) */
.pill{
  display:inline-flex; align-items:center; padding:4px 10px;
  font-size:12px; font-weight:700; color:#111827;
  background:#f3f4f6; border:1px solid #e5e7eb; border-radius:999px;
}
.pill--accent{
  background:#eef2ff; color:#273ea6; border-color:#e4e9ff;
}

/* Icon buttons */
.icon-btn{
  appearance:none; border:none; background:#f3f4f6; color:#111827;
  width:34px; height:34px; border-radius:10px; display:inline-flex;
  align-items:center; justify-content:center; cursor:pointer;
  transition: background .12s, box-shadow .12s, transform .04s;
}
.icon-btn:hover{ background:#edeff2; box-shadow:0 3px 10px rgba(2,6,23,.06); }
.icon-btn.star{ color:#b7791f; background:#fff6e0; }
.icon-btn.star:hover{ background:#ffecc5; }
.icon-btn.star.active{ color:#d97706; background:#ffefc2; }

/* Empty state note */
.empty-note{
  color:var(--muted); padding:16px; border:1px dashed var(--line);
  border-radius:12px; background:#fff;
}

/* Star (favorite) button variations */
.icon-btn.star{ color:#b45309; background:#fff6e5; }
.icon-btn.star:hover{ background:#ffeac7; }
.icon-btn.star.active{ color:#f59e0b; background:#fff1cc; }

/* Created date text */
.config-date{
  margin-top:8px; font-size:12px; color:var(--muted);
}

/* Filters bar */
.filters-bar{
  display:grid;
  grid-template-columns: 1.2fr .8fr .8fr auto auto auto auto;
  gap:10px;
  align-items:center;
  margin:10px 0 12px 0;
}
@media (max-width: 900px){
  .filters-bar{
    grid-template-columns: 1fr 1fr;
  }
}


`}</style>

    </div>
  );
}







