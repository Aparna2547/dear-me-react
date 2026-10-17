import React, { useState } from "react";
import { X, Tag, Clock, Calendar } from "lucide-react";

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const ROUTINE_CATEGORIES = [
  "Breakfast & Food",
  "Workout & Fitness",
  "Hydration & Health",
  "Skincare & Self-Care",
  "Work & Study",
  "Evening & Sleep",
  "General",
];

const AddRoutineForm = ({ onClose, onSave, initialDay }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Breakfast & Food",
    time: "",
    reminder: true,
    days: initialDay ? [initialDay] : ["Monday"],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const toggleDay = (day) => {
    setForm((prev) => {
      const exists = prev.days.includes(day);
      if (exists) {
        // keep at least 1 day selected
        if (prev.days.length === 1) return prev;
        return { ...prev, days: prev.days.filter((d) => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  const setAllDays = () => setForm((prev) => ({ ...prev, days: [...WEEK_DAYS] }));
  const setWeekdays = () =>
    setForm((prev) => ({ ...prev, days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }));
  const setOnlyDay = (day) => setForm((prev) => ({ ...prev, days: [day] }));

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      setError("Please fill in both title and description");
      return;
    }

    if (!form.days || form.days.length === 0) {
      setError("Please select at least one day for this routine");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        time: form.time || "",
        reminder: form.reminder,
        days: form.days,
      }); // parent does the actual API call
      setForm({
        title: "",
        description: "",
        category: "Breakfast & Food",
        time: "",
        reminder: true,
        days: initialDay ? [initialDay] : ["Monday"],
      });
    } catch (err) {
      setError(err.message || "Failed to save routine");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-red-600 mb-1">Add Routine</h2>
        <p className="text-xs text-gray-500 mb-4">Set up a daily habit or routine activity</p>

        {error && <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}

        <div className="space-y-4">
          {/* Category Selector */}
          <div>
            <label className="text-xs font-semibold text-red-700 uppercase tracking-wide flex items-center gap-1 mb-1.5">
              <Tag size={14} /> Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 px-3 py-2 rounded-xl bg-red-50/50 text-gray-800 text-sm font-medium"
            >
              {ROUTINE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Days of Week Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-red-700 uppercase tracking-wide flex items-center gap-1">
                <Calendar size={14} /> Plan for Days
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={setAllDays}
                  className="text-[10px] text-red-600 hover:underline font-medium"
                >
                  All Days
                </button>
                <span className="text-[10px] text-gray-300">|</span>
                <button
                  type="button"
                  onClick={setWeekdays}
                  className="text-[10px] text-red-600 hover:underline font-medium"
                >
                  Mon-Fri
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {WEEK_DAYS.map((day) => {
                const isSelected = form.days.includes(day);
                const shortName = day.substring(0, 3);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition text-center ${
                      isSelected
                        ? "bg-red-500 text-white shadow-xs"
                        : "bg-red-50/70 text-red-700 hover:bg-red-100 border border-red-100"
                    }`}
                    title={day}
                  >
                    {shortName}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Active: {form.days.length === 7 ? "Everyday" : form.days.join(", ")}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-red-700 uppercase tracking-wide block mb-1">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 px-3 py-2 rounded-xl text-gray-800 text-sm"
              placeholder="e.g. Healthy Breakfast, 30m Workout, Drink 2 Glasses of Water"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-red-700 uppercase tracking-wide block mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 px-3 py-2 rounded-xl text-gray-800 text-sm"
              placeholder="e.g. Oats, boiled eggs, and green tea"
              rows={2}
            />
          </div>

          {/* Time (optional) */}
          <div>
            <label className="text-xs font-semibold text-red-700 uppercase tracking-wide flex items-center gap-1 mb-1">
              <Clock size={14} /> Scheduled Reminder Time <span className="text-gray-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full border border-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 px-3 py-2 rounded-xl text-gray-800 text-sm"
            />
          </div>

          {/* Reminder Toggle */}
          {form.time && (
            <div className="flex items-center gap-2.5 p-3 bg-red-50/70 border border-red-100 rounded-xl">
              <input
                type="checkbox"
                id="reminderCheck"
                checked={form.reminder}
                onChange={(e) => setForm({ ...form, reminder: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600"
              />
              <label htmlFor="reminderCheck" className="text-xs font-medium text-red-800 cursor-pointer select-none">
                🔔 Notify me at this exact time (Desktop & In-App)
              </label>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-1/2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-60 text-sm shadow-md"
            >
              {saving ? "Saving..." : "Save Routine"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoutineForm;