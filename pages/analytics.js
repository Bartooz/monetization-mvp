// pages/analytics.js
import { useMemo, useState } from "react";

const UI = {
  page: {
    padding: 24,
    background: "#f6f7fb",
    minHeight: "100vh",
  },
  h1: { fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "8px 0 20px" },
  row: { display: "grid", gap: 16 },
  // 12-col grid helpers
  cols12: (breaks = "1fr") => ({
    display: "grid",
    gridTemplateColumns: breaks,
    gap: 16,
  }),
  card: {
    background: "#fff",
    border: "1px solid #e7eaf3",
    borderRadius: 12,
    boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
  },
  cardPad: { padding: 16 },
  kpiTitle: { fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 6 },
  kpiValue: { fontSize: 22, fontWeight: 700, color: "#0f172a" },
  sub: { fontSize: 12, color: "#64748b" },
  divider: {
    height: 1,
    background: "#eef1f6",
    margin: "12px 0",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#4338ca",
    fontWeight: 600,
    fontSize: 12,
  },
  select: {
    height: 36,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontSize: 14,
    color: "#111827",
  },
  toggleWrap: { display: "inline-flex", alignItems: "center", gap: 10 },
  radioWrap: {
    display: "inline-flex",
    background: "#f3f4f6",
    borderRadius: 999,
    padding: 4,
    border: "1px solid #e5e7eb",
  },
  radioBtn: (active) => ({
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: active ? "#0f172a" : "#6b7280",
    background: active ? "#fff" : "transparent",
    border: active ? "1px solid #e5e7eb" : "1px solid transparent",
  }),
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 14,
  },
  th: { textAlign: "left", color: "#64748b", fontWeight: 600, padding: "10px 12px" },
  td: { padding: "10px 12px", borderTop: "1px solid #eef1f6" },
};

function Sparkline({ data = [], color = "#2563eb" }) {
  if (!data.length) return null;
  const w = 600;
  const h = 80;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 8) + 4;
    const y =
      h - 6 - ((v - min) / Math.max(1, max - min)) * (h - 12);
    return `${x},${y}`;
  });

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points.join(" ")}
      />
    </svg>
  );
}

function LineFlat({ data = [], color = "#10b981" }) {
  // simple flat-ish line or minimal variation
  return (
    <svg width="100%" viewBox="0 0 600 80">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points="10,40 590,40"
      />
    </svg>
  );
}

function useFakeData(days) {
  return useMemo(() => {
    const rand = (seed) => {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    const seq = Array.from({ length: days }, (_, i) =>
      Math.round(900 + rand(i + 2) * 500)
    );
    const arpdau = Array.from({ length: days }, (_, i) =>
      Math.round(50 + rand(i + 10) * 20)
    );
    const top = [
      { name: "Pirate Deal", revenue: 384 },
      { name: "Forest Deal", revenue: 312 },
      { name: "Merry Deal", revenue: 216 },
    ];
    return { revenue: seq, arpdau, top };
  }, [days]);
}

export default function Analytics() {
  const [range, setRange] = useState(30);
  const [mode, setMode] = useState("demo"); // 'demo' | 'live'
  const { revenue, arpdau, top } = useFakeData(range);

  // fake KPIs
  const kpi = {
    revToday: "$1,201",
    arpdau: "$0",
    paying: "166",
    conv7d: "0.03%",
    mix: "72.0% / 28.0%",
  };

  return (
    <div style={UI.page}>
      {/* Header row: title + controls */}
      <div
        style={{
          ...UI.cols12("1fr auto auto"),
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={UI.h1}>Analytics</h1>

        <div>
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            style={UI.select}
          >
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>

        <div style={UI.toggleWrap}>
          
          <div style={UI.radioWrap}>
            <button
              type="button"
              style={UI.radioBtn(mode === "demo")}
              onClick={() => setMode("demo")}
            >
              Demo
            </button>
            <button
              type="button"
              style={UI.radioBtn(mode === "live")}
              onClick={() => setMode("live")}
            >
              Live
            </button>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div style={UI.cols12("repeat(5, 1fr)")}>

        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div style={UI.kpiTitle}>Revenue (today)</div>
            <div style={UI.kpiValue}>{kpi.revToday}</div>
          </div>
        </div>

        <div style={UI.card}>
          <div style={UI.cardPad}>
            <div style={UI.kpiTitle}>ARPDAU</div>
            <div style={UI.kpiValue}>{kpi.arpdau}</div>
          </div>
        </div>

        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div style={UI.kpiTitle}>Paying Users</div>
            <div style={UI.kpiValue}>{kpi.paying}</div>
          </div>
        </div>

        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div style={UI.kpiTitle}>Conversion (7d avg)</div>
            <div style={UI.kpiValue}>{kpi.conv7d}</div>
          </div>
        </div>

        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div style={UI.kpiTitle}>IAP vs Ads (today)</div>
            <div style={UI.kpiValue}>{kpi.mix}</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ height: 16 }} />
      <div style={UI.cols12("1fr 1fr")}>
        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={UI.kpiTitle}>Revenue</span>
              <span style={UI.sub}>by day</span>
            </div>
            <div style={UI.divider} />
            <Sparkline data={revenue} />
          </div>
        </div>

        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={UI.kpiTitle}>ARPDAU</span>
              <span style={UI.sub}>by day</span>
            </div>
            <div style={UI.divider} />
            <LineFlat />
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ height: 16 }} />
      <div style={UI.cols12("1.1fr 1fr 1fr")}>

        {/* Top templates table */}
        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={UI.kpiTitle}>Top Templates (today)</span>
              <span style={UI.badge}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "#22c55e",
                  }}
                />
                Revenue
              </span>
            </div>
            <div style={UI.divider} />
            <table style={UI.table}>
              <thead>
                <tr>
                  <th style={UI.th}>Name</th>
                  <th style={{ ...UI.th, textAlign: "right" }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {top.map((t) => (
                  <tr key={t.name}>
                    <td style={UI.td}>{t.name}</td>
                    <td style={{ ...UI.td, textAlign: "right" }}>
                      ${t.revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* A/B tests placeholder */}
        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={UI.kpiTitle}>A/B Tests</span>
              <span style={UI.sub}>coming soon</span>
            </div>
            <div style={UI.divider} />
            <div style={{ color: "#0f172a", lineHeight: 1.5 }}>
              Wire your experiment data to see lifts and significance.
            </div>
          </div>
        </div>

        {/* Alerts placeholder */}
        <div style={UI.card}>
          <div style={{ ...UI.cardPad }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={UI.kpiTitle}>Alerts</span>
              <span style={UI.sub}>coming soon</span>
            </div>
            <div style={UI.divider} />
            <div style={{ color: "#0f172a", lineHeight: 1.5 }}>
              We’ll flag anomalies (CTR dips, revenue drops, fill-rate issues).
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
