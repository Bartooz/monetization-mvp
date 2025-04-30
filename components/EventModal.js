// components/EventModal.js
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  eventType,
  setEventType,
  offerType,
  setOfferType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  editing,
}) {
  const offerTypes = [
    "Regular Offer",
    "Timer",
    "Multi-Sale",
    "Endless",
    "Mystery Offer",
    "Surprise Offer",
    "Triple Offer",
    "Buy-All",
  ];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 30,
          borderRadius: 8,
          maxWidth: 400,
          width: "90%",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>
          {editing ? "Edit Event" : "Create New Event"}
        </h2>

        <label style={{ display: "block", marginBottom: 10 }}>
          Event Type:
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          >
            <option value="Offers">Offers</option>
            <option value="Missions">Missions</option>
          </select>
        </label>

        {eventType === "Offers" && (
          <label style={{ display: "block", marginBottom: 10 }}>
            Offer Type:
            <select
              value={offerType}
              onChange={(e) => setOfferType(e.target.value)}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            >
              {offerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        )}

        <label style={{ display: "block", marginBottom: 10 }}>
          Start Date & Time:
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
          />
        </label>

        <label style={{ display: "block", marginBottom: 20 }}>
          End Date & Time:
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            dateFormat="Pp"
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              background: "#ccc",
              color: "black",
              border: "none",
              borderRadius: 4,
              marginRight: 10,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            style={{
              padding: "8px 16px",
              background: "black",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {editing ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
