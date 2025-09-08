import React, { useState, useEffect } from "react";
import TripleOfferEditor from "../components/TripleOfferEditor";
import PhonePreviewWrapper from "../components/PhonePreviewWrapper";
import TripleOfferPreviewVertical from "../components/TripleOfferPreviewVertical";
import TripleOfferPreviewHorizontal from "../components/TripleOfferPreviewHorizontal";
import TripleOfferPreviewCarousel from "../components/TripleOfferPreviewCarousel";
import TripleOfferPreviewVerticalCarousel from "../components/TripleOfferPreviewVerticalCarousel";



const USE_BACKEND = false; // Set to true to reactivate backend mode

const LOCAL_STORAGE_KEY = 'templates';
const CONFIG_LOCAL_KEY = "configurations";


const layoutComponents = {
  Horizontal: TripleOfferPreviewHorizontal,
  Vertical: TripleOfferPreviewVertical,
  Carousel: TripleOfferPreviewCarousel,
  "Vertical Carousel": TripleOfferPreviewVerticalCarousel,
};

const loadLocalConfigurations = () => {
  try { return JSON.parse(localStorage.getItem(CONFIG_LOCAL_KEY)) || []; }
  catch { return []; }
};
const getSlotsForTemplate = (tpl) => {
  const cfg = tpl?.configuration
    ? loadLocalConfigurations().find((c) => c.config_name === tpl.configuration)
    : null;
  // fall back to blank slots if no config found
  return Array.isArray(cfg?.slots) ? cfg.slots : [
    { value: "", bonus: "", currency: "Cash", paid: true },
    { value: "", bonus: "", currency: "Cash", paid: true },
    { value: "", bonus: "", currency: "Cash", paid: true },
  ];
};

const loadLocalTemplates = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalTemplates = (templates) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates));
};

const normalizeTemplates = (arr) =>
  (arr || []).map((t) => ({
    ...t,
    created_at: t.created_at || new Date().toISOString(),
    updated_at: t.updated_at || t.created_at || new Date().toISOString(),
    favorite: Boolean(t.favorite === true || t.favorite === "true"),
  }));

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);  // used by editor
  const [showEditor, setShowEditor] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterEvent, setFilterEvent] = useState("All");
  const [filterOffer, setFilterOffer] = useState("All");
  const [filterLayout, setFilterLayout] = useState("All");
  const [favOnly, setFavOnly] = useState(false);
  const [sortBy, setSortBy] = useState("updated-desc"); // updated-desc | name-asc | created-desc


  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";


  // ✅ Fetch templates from backend
  useEffect(() => {
    if (USE_BACKEND) {
      fetch(`${BASE_URL}/api/templates`)
        .then((res) => res.json())
        .then((data) => setTemplates(normalizeTemplates(data)))
        .catch((err) => {
          console.error("Failed to fetch templates:", err);
          setTemplates([]);
        });
    } else {
      const localTemplates = loadLocalTemplates();
      const normalized = normalizeTemplates(localTemplates);
      if (JSON.stringify(localTemplates) !== JSON.stringify(normalized)) {
        saveLocalTemplates(normalized); // persist normalization once
      }
      setTemplates(normalized);
    }
  }, []);

  // ✅ Save or update a template
  const handleSaveTemplate = async (templateData) => {
    const nowIso = new Date().toISOString();

    if (USE_BACKEND) {
      try {
        const method = editingTemplate ? "PUT" : "POST";
        const endpoint = editingTemplate
          ? `${BASE_URL}/api/templates/${encodeURIComponent(editingTemplate.template_name)}`
          : `${BASE_URL}/api/templates`;

        // ✨ ensure timestamps + favorite are preserved
        const enriched = {
          ...templateData,
          created_at: editingTemplate?.created_at || templateData.created_at || nowIso,
          updated_at: nowIso,
          favorite: editingTemplate?.favorite ?? templateData.favorite ?? false,
        };

        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enriched),
        });
        if (!res.ok) throw new Error("Failed to save template");

        // If the API returns the saved resource on POST, use it; otherwise use enriched
        const saved = method === "POST" ? await res.json() : enriched;

        // ✅ handle rename safely (remove old name if changed)
        const oldName = editingTemplate?.template_name;
        const newName = saved.template_name;
        setTemplates((prev) => {
          const withoutOld =
            oldName && oldName !== newName
              ? prev.filter((t) => t.template_name !== oldName)
              : prev;
          const filtered = withoutOld.filter((t) => t.template_name !== newName);
          return [...filtered, saved];
        });

        setEditingTemplate(null);
        setShowEditor(false);
      } catch (err) {
        console.error("Save error:", err);
      }
    } else {
      // 🗄 localStorage mode
      const existing = loadLocalTemplates();

      // Grab previous record to preserve created_at/favorite on update/rename
      const prev = editingTemplate
        ? existing.find((t) => t.template_name === editingTemplate.template_name)
        : existing.find((t) => t.template_name === templateData.template_name);

      const enriched = {
        ...templateData,
        created_at: prev?.created_at || nowIso,
        updated_at: nowIso,
        favorite: prev?.favorite ?? false,
      };

      const oldName = editingTemplate?.template_name;

      // ✅ remove both the old name (if rename) and the new name (if overwriting)
      const filtered = existing.filter(
        (t) =>
          t.template_name !== enriched.template_name &&
          (oldName ? t.template_name !== oldName : true)
      );

      const updated = [...filtered, enriched];
      saveLocalTemplates(updated);
      setTemplates(updated);
      setEditingTemplate(null);
      setShowEditor(false);
    }
  };


  // ✅ Cancel editing
  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setShowEditor(false);
  };

  // ✅ Delete a template
  const handleDelete = async (name) => {
    if (USE_BACKEND) {
      try {
        const res = await fetch(`${BASE_URL}/api/templates/${encodeURIComponent(name)}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete template");

        setTemplates((prev) =>
          prev.filter((tpl) => tpl.template_name !== name)
        );
      } catch (err) {
        console.error("Delete error:", err);
      }
    } else {
      const current = loadLocalTemplates();
      const updated = current.filter((tpl) => tpl.template_name !== name);
      saveLocalTemplates(updated);
      setTemplates(updated);
    }
  };

  const filteredTemplates = templates.filter((tpl) =>
    tpl.template_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Editor modal
  const openCreate = () => { setEditingTemplate(null); setShowEditor(true); };
  const openEdit = (tpl) => { setEditingTemplate(tpl); setShowEditor(true); };

  // Preview modal
  const openPreview = (tpl) => { setPreviewTemplate(tpl); setShowPreview(true); };
  const closePreview = () => { setShowPreview(false); setPreviewTemplate(null); };

  // Toggle favorite
  const toggleFavorite = (name) => {
    const updated = templates.map((t) =>
      t.template_name === name ? { ...t, favorite: !Boolean(t.favorite) } : t
    );
    saveLocalTemplates(updated);
    setTemplates(updated);
  };

  // Duplicate
  const duplicateTemplate = (name) => {
    const src = templates.find((t) => t.template_name === name);
    if (!src) return;
    let suffix = 1, newName = `${name} copy`;
    while (templates.some((t) => t.template_name === newName)) {
      suffix += 1; newName = `${name} copy ${suffix}`;
    }
    const copy = {
      ...src,
      template_name: newName,
      favorite: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [...templates, copy];
    saveLocalTemplates(updated);
    setTemplates(updated);
  };

  const visibleTemplates = templates
    .filter((t) => t.template_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((t) => (filterEvent === "All" ? true : t.event_type === filterEvent))
    .filter((t) => (filterOffer === "All" ? true : t.offer_type === filterOffer))
    .filter((t) => (filterLayout === "All" ? true : t.layout === filterLayout))
    .filter((t) => (favOnly ? t.favorite : true))
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.template_name.localeCompare(b.template_name);
      if (sortBy === "created-desc") return new Date(b.created_at) - new Date(a.created_at);
      // default updated-desc
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterEvent("All");
    setFilterOffer("All");
    setFilterLayout("All");
    setFavOnly(false);
    setSortBy("updated-desc");
  };


  return (
    <div className="page">
      <div className="page-margin">

        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Templates</h1>
            <p className="page-subtitle">Design and manage reusable offer templates.</p>
          </div>
          <button onClick={openCreate} className="btn btn-primary">+ Create Template</button>
        </div>
        <hr className="divider" />

        {/* Filters / Toolbar */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

          <select value={filterLayout} onChange={(e) => setFilterLayout(e.target.value)} className="select">
            <option value="All">All layouts</option>
            <option value="Vertical">Vertical</option>
            <option value="Horizontal">Horizontal</option>
            <option value="Carousel">Carousel</option>
            <option value="Vertical Carousel">Vertical Carousel</option>
          </select>

          <label className="checkbox">
            <input type="checkbox" checked={favOnly} onChange={(e) => setFavOnly(e.target.checked)} />
            <span>Favorites</span>
          </label>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select">
            <option value="updated-desc">Updated (newest)</option>
            <option value="name-asc">Name A–Z</option>
            <option value="created-desc">Created (newest)</option>
          </select>

          <button onClick={resetFilters} className="btn btn-secondary">Reset</button>
        </div>

        {/* Count */}
        <div className="muted small">Showing {visibleTemplates.length} of {templates.length}</div>

        {/* Grid */}
        <div className="tpl-grid">
          {visibleTemplates.length === 0 ? (
            <div className="empty-note">No templates match your filters.</div>
          ) : (
            visibleTemplates.map((tpl) => (
              <div key={tpl.template_name} className="card tpl-card">
                <div className="tpl-card__top">
                  <div className="tpl-name">{tpl.template_name}</div>
                  <div className="tpl-actions">
                    {/* Favorite */}
                    <button className={`icon-btn ${tpl.favorite ? "star active" : "star"}`}
                      aria-label="Favorite" title={tpl.favorite ? "Unfavorite" : "Mark favorite"}
                      onClick={() => toggleFavorite(tpl.template_name)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={tpl.favorite ? "currentColor" : "none"}>
                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
                          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {/* Preview */}
                    <button className="icon-btn" aria-label="Preview" title="Preview"
                      onClick={() => openPreview(tpl)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="currentColor" strokeWidth="1.6" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </button>
                    {/* Edit */}
                    <button className="icon-btn" aria-label="Edit" title="Edit"
                      onClick={() => openEdit(tpl)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M15.232 5.232a2.5 2.5 0 1 1 3.536 3.536L8.5 19.036l-4 1 1-4 9.732-10.804Z"
                          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {/* Duplicate */}
                    <button className="icon-btn" aria-label="Duplicate" title="Duplicate"
                      onClick={() => duplicateTemplate(tpl.template_name)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M8 8h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" />
                        <path d="M6 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </button>
                    {/* Delete */}
                    <button className="icon-btn danger" aria-label="Delete" title="Delete"
                      onClick={() => handleDelete(tpl.template_name)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7h16M9 7v-.5A1.5 1.5 0 0 1 10.5 5h3A1.5 1.5 0 0 1 15 6.5V7m-6 0h6m-8 0 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="pill-row">
                  <span className="pill">{tpl.event_type || "—"}</span>
                  <span className="pill pill--accent">{tpl.offer_type || "—"}</span>
                  <span className="pill">{tpl.layout || "—"}</span>
                </div>

                {tpl.design_prompt ? <div className="tpl-desc">{tpl.design_prompt}</div> : null}

                <div className="tpl-meta">
                  <div>Config: {tpl.configuration || "—"}</div>
                  <div>Created: {new Date(tpl.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            ))
          )}


          {/* Editor Modal */}
          {showEditor && (
            <>
              <div className="modal-overlay" onClick={() => setShowEditor(false)} />
              <div role="dialog" aria-modal="true" className="modal-container">
                <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3 className="modal-title">{editingTemplate ? "Edit Template" : "Create New Template"}</h3>
                    <button className="icon-btn" aria-label="Close" onClick={() => setShowEditor(false)}>×</button>
                  </div>
                  <TripleOfferEditor
                    template={editingTemplate}
                    onSave={handleSaveTemplate}
                    onCancel={handleCancelEdit}
                  />
                </div>
              </div>
            </>
          )}

          {/* Preview Modal */}
          {showPreview && previewTemplate && (
            <>
              <div className="modal-overlay" onClick={closePreview} />
              <div role="dialog" aria-modal="true" className="modal-container">
                <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h3 className="modal-title">Preview: {previewTemplate.template_name}</h3>
                    <button className="icon-btn" aria-label="Close" onClick={closePreview}>×</button>
                  </div>

                  <div className="preview-body">
                    <div className="preview-left">
                      <PhonePreviewWrapper>
                        {(() => {
                          const LayoutPreview =
                            layoutComponents[previewTemplate?.layout] || TripleOfferPreviewVertical;
                          const slots = getSlotsForTemplate(previewTemplate);
                          return (
                            <LayoutPreview
                              title={previewTemplate?.title || ""}
                              slots={slots}
                              design_data={previewTemplate?.design_data}
                            />
                          );
                        })()}
                      </PhonePreviewWrapper>
                    </div>
                    <div className="preview-right">
                      <div className="muted">Template Details</div>
                      <div className="details">
                        <div><strong>Event Type:</strong> {previewTemplate.event_type || "—"}</div>
                        <div><strong>Offer Type:</strong> {previewTemplate.offer_type || "—"}</div>
                        <div><strong>Layout:</strong> {previewTemplate.layout || "—"}</div>
                        <div><strong>Configuration:</strong> {previewTemplate.configuration || "—"}</div>
                        <div style={{ marginTop: 8 }}><strong>Description:</strong><div className="muted">{previewTemplate.design_prompt || "—"}</div></div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </>
          )}
        </div>

        {/* Page styles */}
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
        .page-margin{ margin: 0 3rem 0 3rem;}

  
        .page-header{ display:flex; align-items:flex-end; justify-content:space-between; gap:16px; }
        .page-title{ margin:2rem 0 0 0; font-size: clamp(28px, 3.6vw, 40px); line-height:1.15; font-weight: 900; letter-spacing: -0.02em; color: #0b1220; }
        .page-subtitle{ margin:6px 0 0 0; color: var(--muted); font-size: 14.5px; }
        .divider{ border:0; border-top:1px solid var(--line); margin: 12px 0 16px; }
  
        /* Toolbar */
        .filters-bar{
          display:grid;
          grid-template-columns: 1.2fr .9fr .9fr .9fr auto .9fr auto;
          gap:10px; align-items:center; margin: 6px 0 8px;
        }
        .muted{ color: var(--muted); }
        .small{ font-size: 12px; }
  
        /* Controls */
        .input, .select{
          width:100%; padding:10px 12px; border:1px solid var(--line); border-radius:8px; background:#fff; outline:none;
        }
        .input:focus, .select:focus{ border-color:var(--marine); box-shadow:0 0 0 3px rgba(31,77,217,.15); }
        .checkbox{ display:flex; align-items:center; gap:8px; }
  
        /* Buttons */
        .btn{ display:inline-flex; align-items:center; justify-content:center; padding:10px 16px; border-radius:8px; border:none; cursor:pointer; font-weight:600; }
        .btn-primary{ background:var(--navy); color:#fff; }
        .btn-primary:hover{ box-shadow:0 8px 18px rgba(11,27,52,.18); }
        .btn-secondary{ background:#eef1f7; color:#0f172a; }
  
        /* Cards */
        .card{ background:var(--card); border:1px solid var(--line); border-radius: var(--radius); box-shadow: 0 1px 2px rgba(16,24,40,.04);}
        .tpl-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-top:12px; }
        .tpl-card{ padding:16px; }
        .tpl-card__top{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .tpl-name{ font-weight:800; font-size:18px; letter-spacing:-0.2px; }
        .pill-row{ display:flex; gap:8px; margin-top:6px; }
        .tpl-desc{ margin-top:8px; color:var(--muted); display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .tpl-meta{ margin-top:12px; font-size:12px; color:var(--muted); display:flex; justify-content:space-between; }
  
        /* Pills */
        .pill{ padding:4px 8px; font-size:12px; font-weight:700; color:#111827; background:#f5f6f8; border:1px solid #e7e9ef; border-radius:8px; }
        .pill--accent{ background:#eef3ff; color:#213a99; border-color:#dde6ff; }
  
        /* Icon buttons */
        .icon-btn{ appearance:none; border:none; background:#f5f6f8; color:#1f2937; width:32px; height:32px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; }
        .icon-btn:hover{ background:#eceef3; }
        .icon-btn.danger{ color:#e11d48; background:#fde8ee; }
        .icon-btn.danger:hover{ background:#fbd1dc; }
        .icon-btn.star{ background:transparent; color:#9aa0a6; }
        .icon-btn.star:hover{ background:#f2f3f5; color:#6b7280; }
        .icon-btn.star.active{ color:#d97706; background:#fff1cc; }
  
        /* Modals */
        .modal-overlay{ position:fixed; inset:0; background: rgba(15,23,42,.45); z-index:999; backdrop-filter: blur(2px); }
        .modal-container{ position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:1000; }
        .modal-panel{ width:min(1040px, 92vw); max-height:90vh; overflow:auto; background:#fff; border-radius:14px; box-shadow:0 14px 40px rgba(2,6,23,.35); padding:24px; border:1px solid var(--line); }
        .modal-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .modal-title{ margin:0; font-size:20px; font-weight:800; color:var(--text); }
  
        /* Preview layout */
        .preview-body{ display:grid; grid-template-columns: 420px 1fr; gap:24px; }
        .preview-left{ display:flex; align-items:flex-start; justify-content:center; }
        .preview-right .details{ display:grid; gap:6px; margin-top:8px; }
        @media (max-width: 900px){
          .filters-bar{ grid-template-columns: 1fr 1fr; }
          .preview-body{ grid-template-columns: 1fr; }
        }
  
        .empty-note{ color:var(--muted); padding:16px; border:1px dashed var(--line); border-radius:12px; background:#fff; }

        /* --- Template Editor layout (shared look with dashboard) --- */
        .tpl-editor-grid{
          display:grid;
          grid-template-columns: 360px 1fr 300px;  /* left form / phone / tweaks */
          gap:16px;
          align-items:start;
        }
        .editor-panel, .editor-tweaks{ padding:16px; }
        .editor-preview{ display:flex; align-items:flex-start; justify-content:center; }

        .field{ margin-bottom:12px; }
        .label{ font-size:12px; font-weight:600; color:#374151; margin-bottom:6px; }
        .help{ font-size:12px; color:var(--muted); margin-top:4px; }

        /* normalize color pickers inside tweaks */
        .editor-tweaks .input,
        .editor-tweaks .select{ width:100%; }

        @media (max-width: 1100px){
          .tpl-editor-grid{ grid-template-columns: 1fr; }
          .editor-panel, .editor-tweaks{ padding:12px; }
        }

        /* ---------- Template Editor: 2-column layout with tabs ---------- */
.tpl-editor-two{
  display:grid;
  grid-template-columns: 380px 1fr;   /* left panel, right phone */
  gap:16px;
  align-items:start;
}

.editor-left{ padding:16px; }
.editor-right{ display:flex; flex-direction:column; gap:8px; align-items:flex-start; }

.editor-tabs{
  display:flex; gap:8px; border-bottom:1px solid var(--line); margin-bottom:12px;
}
.tab{
  appearance:none; border:none; background:#f5f6f8; color:#1f2937;
  padding:8px 12px; border-radius:8px 8px 0 0; font-weight:600; cursor:pointer;
}
.tab.active{
  background:#fff; color:#0f172a; border:1px solid var(--line); border-bottom-color:#fff;
}

.editor-pane{ margin-top:4px; }
.tweaks-panel{ padding:4px 0; }

/* Responsive: stack editor on small screens */
@media (max-width: 1100px){
  .tpl-editor-two{ grid-template-columns: 1fr; }
  .editor-right{ order:2; }
  .editor-left{ order:1; }
}

/* ---------- Editor grid: trim empty right space by sizing to phone ---------- */
.tpl-editor-two{
  display:grid;
  grid-template-columns: 380px minmax(340px, 520px); /* left panel, phone area */
  gap:16px;
  align-items:start;
}

/* Left and right columns */
.editor-left{ padding:16px; }
.editor-right{
  display:flex; flex-direction:column; align-items:center; /* center the phone */
  gap:8px; width:100%;
}

/* Centered layout switcher above the phone */
.layout-switcher{
  display:flex; align-items:center; justify-content:center; gap:12px;
  width:100%;
  margin: -4px 0 6px 0;
}
.layout-label{ font-weight:800; letter-spacing:-0.2px; color:#0b1220; }
.ghost-btn{
  appearance:none; border:1px solid var(--line); background:#f5f6f8; color:#1f2937;
  padding:6px 10px; border-radius:8px; cursor:pointer;
}
.ghost-btn:hover{ background:#eceef3; }

/* Footer below both columns */
.editor-footer{
  grid-column: 1 / -1;
  display:flex; align-items:center; gap:10px; justify-content:center;
  margin-top:12px; padding-top:12px; border-top:1px solid var(--line);
}
/* Tabs: make them more alive */
.editor-tabs{
  display:flex; gap:6px; background:linear-gradient(180deg,#f6f8ff, #f1f4ff);
  border:1px solid #e3e8ff; padding:6px; border-radius:12px; margin-bottom:12px;
}
.tab{
  appearance:none; border:1px solid transparent; background:transparent; color:#243b6b;
  padding:8px 12px; border-radius:8px; font-weight:700; cursor:pointer;
  transition: background .15s ease, border-color .15s ease, color .15s ease;
}
.tab:hover{ background:#eef2ff; border-color:#dde3ff; }
.tab.active{
  color:#fff; background:linear-gradient(180deg,#1e3a8a,#1f4dd9);
  border-color:#1f4dd9; box-shadow:0 4px 12px rgba(31,77,217,.25);
}

/* Tweaks panel spacing */
.editor-pane{ margin-top:4px; }
.tweaks-panel{ padding:4px 0; }

/* Responsive */
@media (max-width: 1100px){
  .tpl-editor-two{ grid-template-columns: 1fr; }
  .editor-right{ order:2; }
  .editor-left{ order:1; }
  .editor-footer{ position:sticky; bottom:0; background:#fff; padding:10px 0; }
}



      `}</style>
      </div>
    </div>
  );

}










