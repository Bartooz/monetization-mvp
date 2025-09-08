// components/EventModal.js
import React, { useEffect, useMemo, useState } from "react";
import ReactModal from "react-modal";

// Reuse the same preview pieces used in Templates
import PhonePreviewWrapper from "./PhonePreviewWrapper";
import TripleOfferPreviewVertical from "./TripleOfferPreviewVertical";
import TripleOfferPreviewHorizontal from "./TripleOfferPreviewHorizontal";
import TripleOfferPreviewCarousel from "./TripleOfferPreviewCarousel";
import TripleOfferPreviewVerticalCarousel from "./TripleOfferPreviewVerticalCarousel";
import TripleOfferEditor from "./TripleOfferEditor";
import TemplateCanvas from "./TemplateCanvas";  


// Map layout -> preview component (same names used in Templates)
const LAYOUTS = {
  Vertical: TripleOfferPreviewVertical,
  Horizontal: TripleOfferPreviewHorizontal,
  Carousel: TripleOfferPreviewCarousel,
  "Vertical Carousel": TripleOfferPreviewVerticalCarousel,
};

const PREVIEW_SCALE = 0.86; // smaller = smaller phone

const ALL_STATUSES = ["Draft", "Ready for QA", "QA", "Review", "Ready", "Live", "Done"];

// Subtle color tokens for status chips
const STATUS_STYLES = {
  Draft: { bg: "#F5F7FF", border: "#DCE3FF", dot: "#6D5DF6", text: "#1F2937" },
  "Ready for QA": { bg: "#FFF7E6", border: "#FFE0A3", dot: "#FFAA00", text: "#6B3F00" },
  QA: { bg: "#F5EAFE", border: "#E6D4FB", dot: "#9B51E0", text: "#4B2B89" },
  Review: { bg: "#EAF6FF", border: "#CFE9FF", dot: "#2F80ED", text: "#0F3E77" },
  Ready: { bg: "#ECFDF5", border: "#C7F2DE", dot: "#10B981", text: "#065F46" },
  Live: { bg: "#E8FFF8", border: "#BEF5EA", dot: "#00BFA5", text: "#065F5B" },
  Done: { bg: "#F3F4F6", border: "#E5E7EB", dot: "#6B7280", text: "#111827" },
};

// ------------- helpers
const getLocal = (k) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};



// Normalize any template shape coming from Templates page
const normalizeTemplate = (t) => ({
  templateName: t.template_name ?? t.templateName ?? "",
  title: t.title ?? "",
  layout: t.layout ?? "Vertical",
  eventType: t.event_type ?? t.eventType ?? "Offer",
  offerType: t.offer_type ?? t.offerType ?? "Triple Offer",
  configuration: t.configuration ?? "",
  design_data: t.design_data ?? null,
  slots: t.slots ?? null,
});

export default function EventModal({
  isOpen,
  onClose,
  newEvent,
  setNewEvent,
  handleAddEvent,
  templates = [],
  configurations = [],
  showPreview,
  setShowPreview,
}) {
  // Private, normalized copy of templates; fall back to localStorage if prop empty
  const [internalTemplates, setInternalTemplates] = useState([]);

  useEffect(() => {
    const list = (templates?.length ? templates : getLocal("templates")).map(normalizeTemplate);
    setInternalTemplates(list);
  }, [templates]);

  // Currently selected full template (by name)
  const selectedTemplateData = useMemo(() => {
    if (!internalTemplates?.length) return null;
    if (!newEvent?.templateName) return null;
    return internalTemplates.find((t) => t.templateName === newEvent.templateName) || null;
  }, [internalTemplates, newEvent?.templateName]);

  // When modal opens, ensure dates are strings for <input type="datetime-local">
  useEffect(() => {
    if (!isOpen) return;
    const toLocalInput = (v) => {
      if (!v) return "";
      try {
        const d = new Date(v);
        // YYYY-MM-DDTHH:mm
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      } catch {
        return "";
      }
    };
    setNewEvent((prev) => ({
      ...prev,
      start: prev.start ? toLocalInput(prev.start) : "",
      end: prev.end ? toLocalInput(prev.end) : "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // When user picks a template, backfill missing event fields with sensible defaults
  const handleTemplateChange = (e) => {
    const name = e.target.value;
    const tpl = internalTemplates.find((t) => t.templateName === name) || null;
    setNewEvent((prev) => ({
      ...prev,
      templateName: name,
      // Keep user's custom title if they already typed it
      title: prev.title || tpl?.title || "",
      category: prev.category || tpl?.eventType || "Offer",
      offerType: prev.offerType || tpl?.offerType || "Triple Offer",
      configuration: prev.configuration || tpl?.configuration || "",
    }));
  };

  // Configuration slots to preview
  const slots = useMemo(() => {
    const cfgName = newEvent?.configuration || selectedTemplateData?.configuration || "";
    const cfg = configurations?.find((c) => c.config_name === cfgName) || null;
    return (
      cfg?.slots || [
        { value: "", bonus: "", currency: "Cash", paid: true },
        { value: "", bonus: "", currency: "Cash", paid: true },
        { value: "", bonus: "", currency: "Cash", paid: true },
      ]
    );
  }, [configurations, newEvent?.configuration, selectedTemplateData]);

  // Preview component for the selected layout (defaults to Vertical)
  const LayoutPreview =
    LAYOUTS[selectedTemplateData?.layout || "Vertical"] || TripleOfferPreviewVertical;

  // Convert datetime-local back to ISO when saving
  const toISO = (v) => {
    if (!v) return v;
    const d = new Date(v);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
  };

  const onSave = () => {
    // Push back as ISO strings (calendar expects ISO)
    setNewEvent((prev) => ({
      ...prev,
      start: toISO(prev.start),
      end: toISO(prev.end),
    }));
    handleAddEvent();
  };

  const [leftTab, setLeftTab] = useState("info"); // 'info' | 'notes'
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null); // always null here; we only create
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);


  const upsertTemplateByName = (list, t) => {
    if (!t || !t.templateName) return list;
    const idx = list.findIndex(x => x.templateName === t.templateName);
    if (idx === -1) return [...list, t];
    const copy = list.slice();
    copy[idx] = { ...copy[idx], ...t };
    return copy;
  };

  const handleTemplateSavedFromEditor = (savedTemplate) => {
    // 1) reflect the change in our in-memory list
    setInternalTemplates(prev => upsertTemplateByName(prev, savedTemplate));

    // 2) select it in this event so the preview updates
    if (savedTemplate?.templateName) {
      setNewEvent(prev => ({ ...prev, templateName: savedTemplate.templateName }));
    }

    // 3) close the editor
    setShowTemplateEditor(false);
    setEditingTemplate(null);
  };

  const handleTemplateSaved = (created) => {
    // `created` should contain at least { name, ... } when your template modal returns.
    // Merge into the local list and select it immediately.
    setInternalTemplates((prev) => {
      // avoid dup if a template with same name already exists
      const exists = prev?.some((t) => t.name === created.name);
      return exists ? prev : [...(prev || []), created];
    });
    setNewEvent((prev) => ({ ...prev, templateName: created.name }));
    setShowTemplateEditor(false);
  };


  const renderStatusChip = (name) => {
    const s = STATUS_STYLES[name] || STATUS_STYLES.Draft;
    const active = (newEvent?.status || "Draft") === name;
    return (
      <button
        key={name}
        type="button"
        onClick={() => setNewEvent((prev) => ({ ...prev, status: name }))}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: 999,
          border: `1px solid ${s.border}`,
          background: active ? s.bg : "#FFFFFF",
          color: s.text,
          fontSize: 13,
          fontWeight: 600,
          transition: "box-shadow .15s ease",
          boxShadow: active ? "0 1px 0 rgba(0,0,0,.03), 0 0 0 2px rgba(0,0,0,.03)" : "none",
          cursor: "pointer",
        }}
      >
        <span
          aria-hidden
          style={{ width: 8, height: 8, borderRadius: 999, background: s.dot }}
        />
        {name}
      </button>
    );
  };

  function refreshTemplatesFromStorage() {
    try {
      const KEY = "templates";
      const list = JSON.parse(localStorage.getItem(KEY) || "[]");
      setInternalTemplates(list);
  
      // Optional: if current selection disappeared, keep UX sane
      if (
        newEvent?.templateName &&
        !list.some(t => t.templateName === newEvent.templateName)
      ) {
        setNewEvent(prev => ({
          ...prev,
          templateName: list.length ? list[list.length - 1].templateName : ""
        }));
      }
    } catch (e) {
      // swallow – we don't want to crash the modal if storage is empty/invalid
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      style={{
        overlay: { backgroundColor: "rgba(0,0,0,0.45)", zIndex: 1000 },
        content: {
          top: "80px",
          left: "50%",
          right: "auto",
          bottom: "3rem",
          transform: "translateX(-50%)",
          maxWidth: "1000px",
          width: "92vw",
          padding: 0,
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid #eee",
          background: "#fff",
        }}
      >
        <strong style={{ fontSize: 18 }}>
          {newEvent?.id ? "Edit Event" : "Create New Event"}
        </strong>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={!!showPreview}
            onChange={(e) => setShowPreview?.(e.target.checked)}
          />
          Preview
        </label>
      </div>

      {/* Body */}
      <div style={{ gap: 16, padding: 16, background: "#fff" }}>
        <div className="em-grid">
          {/* LEFT */}
          <div className="em-left">
            {/* Status chips */}
            <div className="em-statusbar">{ALL_STATUSES.map(renderStatusChip)}</div>
            <hr className="em-divider" />

            {/* Tabs */}
            <div className="em-tabs">
              <button
                type="button"
                className={`em-tab ${leftTab === "info" ? "active" : ""}`}
                onClick={() => setLeftTab("info")}
              >
                Main Info
              </button>
              <button
                type="button"
                className={`em-tab ${leftTab === "notes" ? "active" : ""}`}
                onClick={() => setLeftTab("notes")}
              >
                Notes
              </button>
            </div>

            {/* SCROLLABLE ONLY THIS PART */}
            <div className="em-left-scroll">
              {leftTab === "info" && (
                <section className="em-panel">

                  <div className="em-field">
                    <label className="em-label">Pick template</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                      <select
                        className="em-select"
                        value={newEvent?.templateName || ""}
                        onChange={handleTemplateChange}
                      >
                        <option value="">Select template</option>
                        {internalTemplates.map((t) => (
                          <option key={t.templateName} value={t.templateName}>
                            {t.templateName}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        aria-label="Create new template"
                        title="Create new template"
                        onClick={() => { setEditingTemplate(null);setIsTemplateModalOpen(true); }}
                        className="icon-btn"
                        style={{ width: 36, height: 36, borderRadius: 8 }}
                      >+</button>
                    </div>
                  </div>

                  {/* <div className="em-inline" style={{ marginBottom: 12 }}>
                    <button
                      type="button"
                      className="em-btn em-btn-secondary"
                      onClick={() => {
                        try {
                          localStorage.setItem("openCreateTemplate", "1");
                        } catch { }
                        window.location.href = "/templates?create=1";
                      }}
                      title="Open the Templates screen to create a new template"
                    >
                      + Create New Template
                    </button>
                  </div> */}



                  <div className="em-field">
                    <label className="em-label">Title</label>
                    <input
                      className="em-input"
                      type="text"
                      placeholder="Event title"
                      value={newEvent?.title || ""}
                      onChange={(e) =>
                        setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                  </div>

                  <div className="em-two">
                    <div className="em-field">
                      <label className="em-label">Start</label>
                      <input
                        className="em-input"
                        type="datetime-local"
                        value={newEvent?.start || ""}
                        onChange={(e) =>
                          setNewEvent((prev) => ({ ...prev, start: e.target.value }))
                        }
                      />
                    </div>
                    <div className="em-field">
                      <label className="em-label">End</label>
                      <input
                        className="em-input"
                        type="datetime-local"
                        value={newEvent?.end || ""}
                        onChange={(e) =>
                          setNewEvent((prev) => ({ ...prev, end: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="em-field">
                    <label className="em-label">Status (fallback)</label>
                    <select
                      className="em-select"
                      value={newEvent?.status || "Draft"}
                      onChange={(e) =>
                        setNewEvent((prev) => ({ ...prev, status: e.target.value }))
                      }
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>

                  </div>
                </section>
              )}

              {leftTab === "notes" && (
                <section className="em-panel">
                  <div className="em-section-header">Notes</div>
                  <textarea
                    rows={6}
                    placeholder="Add internal notes or comments..."
                    className="em-textarea"
                  />
                </section>
              )}

              {/* Footer buttons (inside scroll so they’re reachable on small screens) */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                  marginTop: 16,
                }}
              >
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onSave}
                  style={{
                    background: "#1f4dd9",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Save Event
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Phone preview */}
          <div className="em-right">
            {showPreview && (
              <div
                style={{
                  borderLeft: "solid #eee",
                  minHeight: 420,
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  overflow: "hidden",
                }}
              >
                {!selectedTemplateData ? (
                  <div
                    style={{
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      color: "#6b7280",
                      fontWeight: 700,
                      width: "100%",
                    }}
                  >
                    Pick a template to preview
                  </div>
                ) : (
                  <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: "top right" }}>
                    <PhonePreviewWrapper>
                      <LayoutPreview
                        title={selectedTemplateData?.title ?? ""}
                        slots={slots}
                        design_data={selectedTemplateData?.design_data}
                      />
                    </PhonePreviewWrapper>
                  </div>
                )}
              </div>
            )}
          </div>

          
        </div>

       

        {/* Minimal CSS (visual only) */}
        <style jsx global>{`
          :root {
            --em-line: #e6e8ee;
            --em-muted: #667085;
            --em-marine: #1f4dd9;
          }

          .icon-btn{
            appearance:none; border:1px solid #e6e8ee; background:#f5f6f8; color:#1f2937;
            width:32px; height:32px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center;
            cursor:pointer;
          }

          .icon-btn:hover{ background:#eceef3; }

          /* Two columns with simple flex (robust on all widths) */
          .em-grid {
            display: flex;
            gap: 16px;
            align-items: flex-start;
          }
          .em-left {
            flex: 1 1 0;
            min-width: 0;
          }
          .em-right {
            flex: 0 0 auto;
          }

          .em-divider {
            border: 0;
            border-top: 1px solid var(--em-line);
            margin: 12px 0 16px;
          }

          .em-statusbar {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            margin: 4px 0 10px;
          }

          .em-tabs {
            position: sticky;
            top: 0;
            z-index: 1;
            background: #fff;
            padding-top: 4px;
            margin-bottom: 4px;
          }
          .em-tab {
            appearance: none;
            border: 1px solid transparent;
            background: transparent;
            color: #243b6b;
            padding: 8px 12px;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
          }
          .em-tab:hover {
            background: #eef2ff;
            border-color: #dde3ff;
          }
          .em-tab.active {
            color: #fff;
            background: linear-gradient(180deg, #1e3a8a, #1f4dd9);
            border-color: #1f4dd9;
            box-shadow: 0 4px 12px rgba(31, 77, 217, 0.25);
          }

          /* ONLY THIS SCROLLS */
          .em-left-scroll {
            overflow-y: auto;
            max-height: calc(100vh - 260px); /* adjust if your header area is taller/shorter */
            padding-right: 8px; /* room for scrollbar */
            paddingBottom: 88,     // space for the sticky actions
            overscrollBehavior: "contain",
          }
          .em-left-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .em-left-scroll::-webkit-scrollbar-thumb {
            background: #e0e7ff;
            border-radius: 8px;
          }
          .em-left-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .em-panel {
            background: #fff;
            border: 1px solid #e7edff;
            border-radius: 16px;
            box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
            padding: 16px;
          }
          .em-section-header {
            display: inline-block;
            margin: 2px 0 12px;
            padding: 8px 10px;
            border-radius: 10px;
            border: 1px solid #e7edff;
            background: linear-gradient(180deg, #f7f9ff, #ffffff);
            color: #0b5cff;
            font-weight: 800;
            font-size: 13px;
          }

          .leftActionsStickyStyle {
            position: sticky;
            bottom: 0;
            background: #fff;
            padding: 12px 0;
            marginTop: 16;
            borderTop: 1px solid #EBEEF5;
            display: flex;
            gap: 12;
            justifyContent: flex-end;
            zIndex: 1;
          }

          .em-field {
            margin: 0 0 14px;
          }
          .em-label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            color: #374151;
            margin: 0 0 6px;
          }
          .em-help {
            font-size: 12px;
            color: var(--em-muted);
            margin-top: 6px;
          }

          .em-input,
          .em-select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--em-line);
            border-radius: 10px;
            outline: none;
            background: #fff;
          }
          .em-input:focus,
          .em-select:focus,
          .em-textarea:focus {
            border-color: var(--em-marine);
            box-shadow: 0 0 0 3px rgba(31, 77, 217, 0.15);
          }

          .em-textarea {
            width: 100%;
            min-height: 120px;
            padding: 12px;
            border: 1px solid var(--em-line);
            border-radius: 10px;
            resize: vertical;
            outline: none;
          }

          .em-two {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .em-inline {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .icon-btn:hover{ background:#eceef3; }
 .modal-overlay{ position:fixed; inset:0; background:rgba(15,23,42,.45); z-index:999; backdrop-filter:blur(2px); }
 .modal-container{ position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:1000; }
 .modal-panel{ width:min(1040px,92vw); max-height:90vh; overflow:auto; background:#fff; border-radius:14px;
   box-shadow:0 14px 40px rgba(2,6,23,.35); padding:24px; border:1px solid #e6e8ee; }
.modal-header{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
  .modal-title{ margin:0; font-size:20px; font-weight:800; color:#0f172a; }
        `}</style>
      </div>


      <ReactModal
  isOpen={isTemplateModalOpen}
  onRequestClose={() => setIsTemplateModalOpen(false)}
  onAfterClose={refreshTemplatesFromStorage}
  ariaHideApp={false}
  style={{
    overlay: { zIndex: 1000, background: "rgba(0,0,0,0.45)" },
    content: {
      top: "80px",
      left: "50%",
      right: "auto",
      bottom: "3rem",
      transform: "translateX(-50%)",
      maxWidth: "1000px",
      width: "92vw",
      padding: 0,
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      overflow: "hidden",
    },
  }}
>
  {/* This layout mirrors the Templates page modal: left form + right phone */}
 

      {/* Use your existing editor; no new props invented here */}
      <TripleOfferEditor
  /* editor is used to CREATE a new template here, so no initial template */
  template={editingTemplate ?? null}
  onSave={(payload) => {
    // Persist to localStorage using the same key/shape the Event modal expects
    try {
      const KEY = "templates";
      const list = JSON.parse(localStorage.getItem(KEY) || "[]");

      // Normalize names to keep both snake_case and camelCase so all callers are happy
      const name =
        payload.template_name ||
        payload.templateName ||
        "";

      const normalized = {
        // keep both to be safe with existing code paths
        template_name: name,
        templateName: name,

        title: payload.title || "",
        layout: payload.layout || "Vertical",
        event_type: payload.event_type || "Offer",
        offer_type: payload.offer_type || "Triple Offer",
        configuration: payload.configuration || "",
        design_data: payload.design_data || null,
        slots: payload.slots || null,
      };

      // upsert by template name
      const idx = list.findIndex(
        (t) =>
          (t.template_name || t.templateName) === normalized.templateName
      );
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...normalized };
      } else {
        list.push(normalized);
      }

      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Saving template failed:", e);
    }

    // Close editor and refresh the dropdown + select the new template
    setIsTemplateModalOpen(false);
    try {
      const updated = JSON.parse(localStorage.getItem("templates") || "[]");
      setInternalTemplates(updated);
      if (updated.length && (payload.template_name || payload.templateName)) {
        setNewEvent((prev) => ({
          ...prev,
          templateName: payload.template_name || payload.templateName,
        }));
      }
    } catch { /* ignore */ }
  }}
  onCancel={() => setIsTemplateModalOpen(false)}
/>

    

    {/* Right: phone preview – same one used on Templates page */}
    <div style={{ padding: 20, overflow: "auto" }}>
      <TemplateCanvas />
    </div>

    <style jsx global>{`
  /* ---------- Template Editor: 2-column layout with tabs (same as templates.js) ---------- */

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
  
</ReactModal>

    </ReactModal>
  );
}
