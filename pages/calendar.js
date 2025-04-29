// pages/calendar.js
import { useState } from "react";

export default function CalendarPage() {
  const [mode, setMode] = useState("Live");

  const events = {
    Live: [
      { day: "Monday", event: "Coin Rush" },
      { day: "Wednesday", event: "Double XP" },
      { day: "Saturday", event: "Mega Pack Offer" },
    ],
    Test: [
      { day: "Tuesday", event: "New Offer Test" },
      { day: "Thursday", event: "Balance Update" },
      { day: "Sunday", event: "Price Experiment" },
    ],
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div style={{ padding: 30, fontFamily: "sans-serif" }}>
      <h1>LiveOps Calendar</h1>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setMode("Live")}
          style={{
            marginRight: 10,
            padding: "8px 16px",
            background: mode === "Live" ? "black" : "#ddd",
            color: mode === "Live" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          Live
        </button>
        <button
          onClick={() => setMode("Test")}
          style={{
            padding: "8px 16px",
            background: mode === "Test" ? "black" : "#ddd",
            color: mode === "Test" ? "white" : "black",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          Test
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
        {days.map((day) => {
          const event = events[mode].find((e) => e.day === day);
          return (
            <div
              key={day}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 10,
                minHeight: 80
              }}
            >
              <strong>{day}</strong>
              <div>{event ? event.event : "—"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
