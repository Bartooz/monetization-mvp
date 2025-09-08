import { useEffect, useState, useRef, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventModal from "../components/EventModal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

console.log("🚀 NEW CALENDAR BUILD", new Date().toISOString());

const USE_BACKEND = false;

const LOCAL_EVENTS_KEY = "calendar_events";
const LOCAL_TEMPLATES_KEY = "templates";       // <- matches Templates page
const LOCAL_CONFIGS_KEY = "configurations";

const loadLocal = (key) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const saveLocal = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "", start: "", end: "", category: "", templateName: "", status: "Draft"
  });
  const [templates, setTemplates] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [selectedEventForPreview, setSelectedEventForPreview] = useState(null);
  const [previewPos, setPreviewPos] = useState({ top: 0, left: 0, side: "right" });
  const [selectedStatuses, setSelectedStatuses] = useState(["Show All"]);
  const [showPreview, setShowPreview] = useState(true);
  const allStatuses = ["Draft", "Ready for QA", "QA", "Review", "Ready", "Live", "Done"];
  const calendarRef = useRef(null);

  const statusCounts = useMemo(() => {
    const counts = {};
    events.forEach((e) => {
      const s = getEffectiveStatus(e);
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [events]);


  useEffect(() => {
    if (USE_BACKEND) {
      fetch(`${BASE_URL}/api/events`)
        .then((res) => res.json())
        .then((data) => {
          const normalized = data.map((e) => ({
            ...e,
            start: new Date(e.start).toISOString(),
            end: new Date(e.end).toISOString(),
          }));
          console.log("📅 Events fetched:", normalized);
          setEvents(normalized);
        })
        .catch((err) => {
          console.error("Failed to fetch events", err);
          setEvents([]);
        });

      fetch(`${BASE_URL}/api/templates`)
        .then((res) => res.json())
        .then((data) => {
          console.log("📦 Templates fetched:", data);
          setTemplates(data);
        })
        .catch((err) => {
          console.error("Failed to fetch templates", err);
          setTemplates([]);
        });

      fetch(`${BASE_URL}/api/configurations`)
        .then((res) => res.json())
        .then(setConfigurations)
        .catch((err) => {
          console.error("Failed to fetch configurations", err);
          setConfigurations([]);
        });
    } else {
      setEvents(loadLocal(LOCAL_EVENTS_KEY));
      setTemplates(loadLocal(LOCAL_TEMPLATES_KEY));
      setConfigurations(loadLocal(LOCAL_CONFIGS_KEY));
    }
  }, []);


  function getEffectiveStatus(event) {
    const now = new Date();
    if (event.status === "Ready" && new Date(event.start) <= now && new Date(event.end) >= now) {
      return "Live";
    }
    if (event.status === "Ready" && new Date(event.end) < now) {
      return "Done";
    }
    return event.status || "Draft";
  }

  const STATUS_COLORS = {
    "Draft": "#94A3B8",
    "Ready for QA": "#F59E0B",
    "QA": "#8B5CF6",
    "Review": "#3B82F6",
    "Ready": "#10B981",
    "Live": "#16A34A",
    "Done": "#64748B",
  };

  const typeIcon = (category) => (category === "Mission" ? "🎯" : "🏷️");


  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end || !newEvent.templateName) return;

    const fullTemplate = templates.find(t => t.templateName === newEvent.templateName) || {};

    const eventToSave = {
      ...newEvent,
      category: newEvent.category || fullTemplate.eventType || "Offer",
      offerType: newEvent.offerType || fullTemplate.offerType || "Triple Offer",
      configuration: newEvent.configuration || fullTemplate.configuration || "",
      template_name: newEvent.templateName,
    };

    if (USE_BACKEND) {
      const isEdit = !!newEvent.id;
      const method = isEdit ? "PUT" : "POST";
      const endpoint = isEdit
        ? `${BASE_URL}/api/events/${newEvent.id}`
        : `${BASE_URL}/api/events`;

      try {
        await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventToSave),
        });
        const refreshed = await fetch(`${BASE_URL}/api/events`);
        const data = await refreshed.json();
        const normalized = data.map(e => ({
          ...e,
          start: new Date(e.start).toISOString(),
          end: new Date(e.end).toISOString(),
        }));

        setEvents([]);
        setTimeout(() => {
          setEvents(normalized);
          calendarRef.current?.getApi().refetchEvents();
        }, 50);
      } catch (err) {
        console.error("Error saving event", err);
      }
    } else {
      const isEdit = !!newEvent.id;
      let current = loadLocal(LOCAL_EVENTS_KEY);

      if (isEdit) {
        current = current.map((e) => (e.id === newEvent.id ? eventToSave : e));
      } else {
        eventToSave.id = Date.now();
        current.push(eventToSave);
      }

      saveLocal(LOCAL_EVENTS_KEY, current);
      setEvents(current);
    }

    setIsModalOpen(false);
    setNewEvent({ title: "", start: "", end: "", category: "", templateName: "", status: "Draft" });
  };


  const handleEventDrop = async (info) => {
    const movedEvent = events.find(evt => evt.id == info.event.id);
    if (!movedEvent) return;

    const updated = { ...movedEvent, start: info.event.startStr, end: info.event.endStr };

    if (USE_BACKEND) {
      try {
        await fetch(`${BASE_URL}/api/events/${updated.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        const refreshed = await fetch(`${BASE_URL}/api/events`);
        const data = await refreshed.json();
        const normalized = data.map(e => ({
          ...e,
          start: new Date(e.start).toISOString(),
          end: new Date(e.end).toISOString(),
        }));
        setEvents(normalized);
      } catch (err) {
        console.error("Error saving dropped event", err);
      }
    } else {
      const current = loadLocal(LOCAL_EVENTS_KEY).map(e =>
        e.id === updated.id ? updated : e
      );
      saveLocal(LOCAL_EVENTS_KEY, current);
      setEvents(current);
    }
  };

  const handleCreateEventClick = () => {
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      category: "Offer",
      offerType: "Triple Offer",
      templateName: "",
      status: "Draft",
    });
    setIsModalOpen(true);
  };


  const handleEventClick = (info) => {
    const matched = events.find((e) => e.id == info.event.id);
    if (!matched) return;
  
    // Try to get the event DOM element
    const el =
      info.el ||
      (info.jsEvent && info.jsEvent.target && info.jsEvent.target.closest(".fc-event"));
  
    if (el && typeof window !== "undefined") {
      const rect = el.getBoundingClientRect();
      const cardW = 320; // popover width in px (matches CSS below)
      const gap = 12;
      const vw = window.innerWidth;
  
      // decide which side has more room
      const canRight = rect.right + gap + cardW < vw;
      const left = canRight
        ? rect.right + gap
        : Math.max(12, rect.left - gap - cardW);
  
      setPreviewPos({
        top: window.scrollY + rect.top, // align with event top
        left,
        side: canRight ? "right" : "left",
      });
    }
  
    setSelectedEventForPreview(matched);
  };
  
  const handleEditFromPreview = () => {
    if (!selectedEventForPreview) return;

    // find the full template for defaults
    const allTpls = templates?.length ? templates : loadLocal(LOCAL_TEMPLATES_KEY);
    const tplName =
      selectedEventForPreview.template_name ||
      selectedEventForPreview.templateName ||
      "";
    const fullTemplate =
      allTpls.find((t) => t.template_name === tplName || t.templateName === tplName) || {};

    setNewEvent({
      title: selectedEventForPreview.title || fullTemplate.title || "",
      start: selectedEventForPreview.start,
      end: selectedEventForPreview.end,
      category: selectedEventForPreview.category || fullTemplate.eventType || "Offer",
      offerType: selectedEventForPreview.offerType || fullTemplate.offerType || "Triple Offer",
      templateName: tplName,
      status: selectedEventForPreview.status || "Draft",
      id: selectedEventForPreview.id,
      design_data: fullTemplate.design_data || {},
    });

    setIsModalOpen(true);
    setSelectedEventForPreview(null);
  };

  const handleDeleteFromPreview = async () => {
    if (!selectedEventForPreview) return;

    if (USE_BACKEND) {
      try {
        await fetch(`${BASE_URL}/api/events/${selectedEventForPreview.id}`, {
          method: "DELETE",
        });
        const refreshed = await fetch(`${BASE_URL}/api/events`);
        const data = await refreshed.json();
        const normalized = data.map(e => ({
          ...e,
          start: new Date(e.start).toISOString(),
          end: new Date(e.end).toISOString(),
        }));
        setEvents(normalized);
      } catch (err) {
        console.error("Error deleting event", err);
      }
    } else {
      const current = loadLocal(LOCAL_EVENTS_KEY).filter(e => e.id !== selectedEventForPreview.id);
      saveLocal(LOCAL_EVENTS_KEY, current);
      setEvents(current);
    }

    setSelectedEventForPreview(null);
  };




  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".fc-event")) {
        setSelectedEventForPreview(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const close = () => setSelectedEventForPreview(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, []);


  return (
    <div className="cal-shell" style={{ padding: 20 }}>

      

<div className="cal-toolbar">
  <div className="status-row">
    {Object.entries(STATUS_COLORS).map(([label, color]) => {
      const active =
        selectedStatuses.includes("Show All") || selectedStatuses.includes(label);
      return (
        <button
          key={label}
          className={`chip chip-toggle ${active ? "on" : ""}`}
          onClick={() => {
            if (selectedStatuses.includes("Show All")) {
              setSelectedStatuses([label]);
            } else if (selectedStatuses.includes(label)) {
              const filtered = selectedStatuses.filter((s) => s !== label);
              setSelectedStatuses(filtered.length > 0 ? filtered : ["Show All"]);
            } else {
              setSelectedStatuses([...selectedStatuses, label]);
            }
          }}
        >
          <i style={{ background: color }} />
          {label} <span className="count">{statusCounts[label] || 0}</span>
        </button>
      );
    })}
    <button
      className={`chip chip-toggle ${selectedStatuses.includes("Show All") ? "on" : ""}`}
      onClick={() => setSelectedStatuses(["Show All"])}
    >
      Show All <span className="count">{events.length}</span>
    </button>
  </div>

  <div className="cal-actions">
    <button className="btn btn-primary" onClick={handleCreateEventClick}>
      + Create Event
    </button>
  </div>
</div>






      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={selectedStatuses.includes("Show All")
          ? events
          : events.filter(e => selectedStatuses.includes(getEffectiveStatus(e)))
        }
        editable={true}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        eventContent={(arg) => {
          const matched = events.find((e) => String(e.id) === String(arg.event.id));
          const status = matched ? getEffectiveStatus(matched) : "Draft";
          const barColor = STATUS_COLORS[status] || "#94A3B8";
          const cat = matched?.category || "Offer";
          const title =
            arg.event.title ||
            matched?.title ||
            matched?.template_name ||
            matched?.templateName ||
            "Untitled";


          return (
            <div
              className="ev"
              onDoubleClick={() => {
                const m = events.find((e) => String(e.id) === String(arg.event.id));
                if (m) {
                  setNewEvent({
                    title: m.title || "",
                    start: m.start,
                    end: m.end,
                    category: m.category || "Offer",
                    offerType: m.offerType || "Triple Offer",
                    templateName: m.template_name || m.templateName || "",
                    status: m.status || "Draft",
                    id: m.id,
                  });
                  setIsModalOpen(true);
                }
              }}
            >
              <span className="ev-bar" style={{ background: barColor }} />
              <span className="ev-title" title={title}>{title}</span>
              <span className={`ev-type ${cat}`}>{typeIcon(cat)} {cat}</span>
            </div>
          );
        }}



      />

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        handleAddEvent={handleAddEvent}
        templates={templates}
        configurations={configurations}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        designData={selectedEventForPreview?.design_data || {}}
      />

{selectedEventForPreview && (
  <div
    className={`ev-popover ${previewPos.side}`}
    style={{ top: previewPos.top, left: previewPos.left }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="ev-popover-arrow" />
    <div className="ev-popover-head">
      <div className="ev-popover-title">{selectedEventForPreview.title || "Untitled"}</div>
      <span className={`badge ${getEffectiveStatus(selectedEventForPreview)}`}>
        {getEffectiveStatus(selectedEventForPreview)}
      </span>
    </div>

    <div className="ev-popover-row">
      <span className="k">Start:</span>
      <span className="v">{selectedEventForPreview.start}</span>
    </div>
    <div className="ev-popover-row">
      <span className="k">End:</span>
      <span className="v">{selectedEventForPreview.end}</span>
    </div>
    <div className="ev-popover-row">
      <span className="k">Template:</span>
      <span className="v">
        {selectedEventForPreview.template_name ||
          selectedEventForPreview.templateName ||
          "—"}
      </span>
    </div>

    <div className="ev-popover-actions">
      <button className="btn" onClick={handleEditFromPreview}>Edit</button>
      <button className="btn btn-danger" onClick={handleDeleteFromPreview}>Delete</button>
    </div>
  </div>
)}


      <style jsx global>{`
  /* Toolbar */
  .cal-toolbar{
    display:flex; align-items:center; justify-content:flex-start;
    gap:10px; margin:12px 0 8px;
  }
  .status-row{ display:flex; flex-wrap:wrap; gap:8px; }

  .chip{
    display:inline-flex; align-items:center; gap:8px;
    padding:6px 10px; border:1px solid #e7e9ef; border-radius:999px;
    background:#fff; font-size:12px; font-weight:700; color:#0b1220;
  }
  .chip i{ display:inline-block; width:10px; height:10px; border-radius:50%; }
  .chip .count{
    background:rgba(8,15,37,.06); padding:2px 6px; border-radius:10px;
    font-weight:800; color:inherit;
  }
  .chip-toggle{ cursor:pointer; transition:all .15s ease; }
  .chip-toggle.on{ background:#1f4dd9; border-color:#1f4dd9; color:#fff; }
  .chip-toggle.on .count{ background:rgba(255,255,255,.25); color:#fff; }
  .chip-toggle.on i{ background:#fff !important; }

  /* Light look just inside the calendar shell */
  .cal-shell{ background:#f7f8fb; }
  .cal-shell .fc{ background:#fff; border-radius:12px; box-shadow:0 1px 3px rgba(16,24,40,.06); }
  .cal-shell .fc .fc-toolbar-title{ font-weight:800; letter-spacing:-0.2px; }
  .cal-shell .fc-theme-standard .fc-scrollgrid,
  .cal-shell .fc-theme-standard td,
  .cal-shell .fc-theme-standard th{ border-color:#e7e9ef; }
  .cal-shell .fc .fc-daygrid-day-frame{ background:#fff; }
  .cal-shell .fc .fc-day-today .fc-daygrid-day-frame{ background:#f1f6ff; } /* Today */

  /* Event chips (custom content) */
  .fc .fc-daygrid-event{ margin:2px 4px; }
  .ev{
    display:flex; align-items:center; gap:6px;
    background:#fff; border:1px solid #e7e9ef; border-radius:10px;
    padding:4px 6px; box-shadow:0 1px 2px rgba(16,24,40,.04);
    color:#0b1220; /* ensure dark text on white chip */
  }
  .ev-bar{ width:4px; align-self:stretch; border-radius:6px; }
  .ev-title{
    font-weight:800; font-size:12.5px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    flex:1; min-width:0; color:#0b1220;
  }
  .ev-type{
    margin-left:auto; font-size:11px; padding:2px 6px; border-radius:6px;
    background:#eef2ff; color:#1e40af; font-weight:700; white-space:nowrap;
  }
  .ev-type.Mission{ background:#f5ecff; color:#6b21a8; }

  /* Align chips left, action right */
.cal-toolbar{
  display:flex; align-items:center; justify-content:space-between;
  gap:10px; margin:12px 0 8px;
}
.status-row{ display:flex; flex-wrap:wrap; gap:8px; }
.cal-actions{ display:flex; align-items:center; gap:8px; }

/* Primary button (local) */
.btn{
  appearance:none; border:1px solid #e7e9ef; background:#f6f8ff; color:#0b1220;
  padding:8px 12px; border-radius:10px; font-weight:800; cursor:pointer;
}
.btn-primary{
  background:#1f4dd9; border-color:#1f4dd9; color:#fff;
  box-shadow:0 6px 16px rgba(31,77,217,.25);
}
.btn-primary:hover{ filter:brightness(1.05); }

/* ---- Event preview popover ---- */
.ev-popover{
  position: fixed;
  z-index: 2000;
  width: 320px;
  background: #fff;
  border: 1px solid #e7e9ef;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(16,24,40,.18), 0 2px 6px rgba(16,24,40,.08);
  color: #0b1220;
  padding: 14px 14px 12px;
}
.ev-popover.right .ev-popover-arrow{
  position:absolute; left:-8px; top:16px;
  width:0; height:0; border-top:8px solid transparent; border-bottom:8px solid transparent;
  border-right:8px solid #fff;
  filter: drop-shadow(-1px 0 0 #e7e9ef);
}
.ev-popover.left .ev-popover-arrow{
  position:absolute; right:-8px; top:16px;
  width:0; height:0; border-top:8px solid transparent; border-bottom:8px solid transparent;
  border-left:8px solid #fff;
  filter: drop-shadow(1px 0 0 #e7e9ef);
}

.ev-popover-head{
  display:flex; align-items:center; gap:8px; margin-bottom:8px;
}
.ev-popover-title{
  font-weight:800; font-size:14px; flex:1; min-width:0;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.ev-popover-row{
  display:flex; gap:6px; font-size:12.5px; margin:4px 0;
}
.ev-popover-row .k{ width:64px; color:#475569; }
.ev-popover-row .v{ color:#0b1220; font-weight:600; }

.ev-popover-actions{
  display:flex; justify-content:flex-end; gap:8px; margin-top:10px;
}

/* Badges by status (uses your STATUS_COLORS scheme) */
.badge{
  display:inline-flex; align-items:center; padding:2px 8px; border-radius:999px;
  font-size:11px; font-weight:800; background:#eef2ff; color:#1e40af;
}
.badge.Draft{ background:#f1f5f9; color:#334155; }
.badge['Ready for QA'], .badge.ReadyforQA{ background:#fff7ed; color:#b45309; }
.badge.QA{ background:#f5f3ff; color:#6d28d9; }
.badge.Review{ background:#eff6ff; color:#1d4ed8; }
.badge.Ready{ background:#ecfdf5; color:#047857; }
.badge.Live{ background:#ecfdf5; color:#15803d; }
.badge.Done{ background:#f1f5f9; color:#475569; }

/* Minor tweak so popover can sit near the clicked chip without being clipped */
.cal-shell{ overflow: visible; }


`}</style>


    </div>
  );
}
























