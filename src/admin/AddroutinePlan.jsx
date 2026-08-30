import React, { useState } from "react";
import { X } from "lucide-react";

const AddRoutineForm = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;

    setSaving(true);
    setError("");
    try {
      await onSave(form); // parent does the actual API call
      setForm({ title: "", description: "" });
    } catch (err) {
      setError(err.message || "Failed to save routine");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
        <button className="absolute top-3 right-3 text-red-500" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-red-600 mb-4">Add Routine</h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="space-y-4">
          {/* Title */}
          <div className="flex items-center gap-4 mb-4">
            <label className="text-red-700 text-sm w-24">Title:</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="flex-1 border-0 border-b border-red-300 focus:border-red-500 focus:ring-0 focus:outline-none px-2 py-1 bg-transparent"
              placeholder="e.g. Exercise"
            />
          </div>

          {/* Description */}
          <div className="flex items-start gap-4 mb-4">
            <label className="text-red-700 text-sm w-24 pt-2">Description:</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="flex-1 border border-red-300 focus:border-red-500 focus:outline-none focus:ring-0 px-3 py-2 rounded-md bg-white"
              placeholder="e.g. 30-minute walk or workout"
              rows={1}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Routine"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoutineForm;