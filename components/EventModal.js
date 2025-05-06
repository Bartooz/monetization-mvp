import { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EventModal({
  isOpen,
  onRequestClose,
  onSave,
  eventData,
  isEdit,
}) {
  const [type, setType] = useState("Offer");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [offerType, setOfferType] = useState("Triple Offer");

  useEffect(() => {
    if (eventData) {
      setType(eventData.type || "Offer");
      setTitle(eventData.title || "");
      setStart(eventData.start ? new Date(eventData.start) : new Date());
      setEnd(eventData.end ? new Date(eventData.end) : new Date());
      setOfferType(eventData.offerType || "Triple Offer");
    }
  }, [eventData]);

  const handleSubmit = () => {
    onSave({
      ...eventData,
      title,
      start,
      end,
      type,
      offerType,
    });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Event Modal"
      ariaHideApp={false}
      style={{
        content: {
          maxWidth: 500,
          margin: "auto",
          padding: 20,
          borderRadius: 10,
        },
      }}
    >
      <h2>{isEdit ? "Edit Event" : "New Event"}</h2>

      <label>Category:</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      >
        <option value="Offer">Offer</option>
        <option value="Mission">Mission</option>
      </select>

      <label>Offer Type:</label>
      <select
        value={offerType}
        onChange={(e) => setOfferType(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      >
        <option>Triple Offer</option>
        {/* Add other types later */}
      </select>

      <label>Title:</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <label>Start:</label>
      <DatePicker
        selected={start}
        onChange={(date) => setStart(date)}
        showTimeSelect
        dateFormat="Pp"
        className="input"
      />

      <label>End:</label>
      <DatePicker
        selected={end}
        onChange={(date) => setEnd(date)}
        showTimeSelect
        dateFormat="Pp"
        className="input"
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 6,
        }}
      >
        {isEdit ? "Update" : "Save"}
      </button>
    </Modal>
  );
}

