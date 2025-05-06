// pages/templates.js
import { useState } from "react";

export default function TemplatesPage() {
  const [title, setTitle] = useState("Red, White & Blue");
  const [cta, setCta] = useState("Just For $1");
  const [slots, setSlots] = useState([
    { label: "$1", sublabel: "$0.4 BONUS" },
    { label: "20", sublabel: "Gems" },
    { label: "?", sublabel: "Mystery" },
  ]);

  const updateSlot = (index, field, value) => {
    const updated = [...slots];
    updated[index][field] = value;
    setSlots(updated);
  };

  const addSlot = () => {
    setSlots([...slots, { label: "", sublabel: "" }]);
  };

  const removeSlot = (index) => {
    const updated = [...slots];
    updated.splice(index, 1);
    setSlots(updated);
  };

  return (
    <div className="flex h-screen p-6 bg-gray-100">
      {/* Left Panel: Form */}
      <div className="w-1/2 pr-6 space-y-6">
        <h2 className="text-xl font-bold">Template Editor</h2>

        <div>
          <label className="block text-sm font-semibold">Title</label>
          <input
            className="w-full mt-1 p-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">CTA Text</label>
          <input
            className="w-full mt-1 p-2 border rounded"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold">Offer Slots</label>
            <button
              onClick={addSlot}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Slot
            </button>
          </div>
          {slots.map((slot, index) => (
            <div key={index} className="border p-3 rounded bg-white shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Slot {index + 1}</span>
                <button
                  onClick={() => removeSlot(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              <input
                className="w-full mt-2 p-1 border rounded"
                placeholder="Label"
                value={slot.label}
                onChange={(e) => updateSlot(index, "label", e.target.value)}
              />
              <input
                className="w-full mt-1 p-1 border rounded"
                placeholder="Sub-label"
                value={slot.sublabel}
                onChange={(e) => updateSlot(index, "sublabel", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-1/2 p-6 bg-white shadow-md rounded">
        <h2 className="text-center text-2xl font-bold mb-4">{title}</h2>

        <div className="space-y-4">
          {slots.map((slot, index) => (
            <div
              key={index}
              className="p-4 bg-gray-200 rounded shadow text-center"
            >
              <div className="text-xl font-bold">{slot.label}</div>
              <div className="text-sm text-gray-700">{slot.sublabel}</div>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full py-3 bg-green-500 text-white rounded font-semibold hover:bg-green-600">
          {cta}
        </button>
      </div>
    </div>
  );
}




  