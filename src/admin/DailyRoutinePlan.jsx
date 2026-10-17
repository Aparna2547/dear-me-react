import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check, Clock, Bell, Calendar } from "lucide-react";
import AddRoutineForm, { ROUTINE_CATEGORIES, WEEK_DAYS } from "./AddroutinePlan";
import { routineApi } from "../utils/fetchApi";
import { useNotification } from "../context/NotificationContext";

const formatTimeDisplay = (time) => {
  if (!time) return "";
  if (typeof time === "string" && !time.includes("T") && time.includes(":")) {
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  }
  return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const DailyRoutinePlan = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { scheduleReminder, syncRoutines, cancelReminder } = useNotification();

  // Default to today's day of week
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [selectedDay, setSelectedDay] = useState(todayName);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "General",
    time: "",
    reminder: true,
    days: [todayName],
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Routines without days (legacy entries) apply to every day
  const filteredRoutines =
    selectedDay === "All"
      ? routines
      : routines.filter(
          (r) => !r.days || r.days.length === 0 || r.days.includes(selectedDay)
        );

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await routineApi.getAll();
        setRoutines(data);
        syncRoutines(data); // Register exact-time reminder timers
      } catch (err) {
        setError(err.message || "Failed to load routines");
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const handleAddRoutine = async (form) => {
    const newRoutine = await routineApi.create(
      form.title,
      form.description,
      form.category,
      form.time,
      form.reminder,
      form.days
    );
    setRoutines((prev) => [newRoutine, ...prev]);
    scheduleReminder(newRoutine); // schedule exact timer
    setShowForm(false);
  };

  const startEdit = (routine) => {
    setEditingId(routine._id);
    setEditForm({
      title: routine.title,
      description: routine.description,
      category: routine.category || "General",
      time: routine.time || "",
      reminder: routine.reminder !== false,
      days: routine.days && routine.days.length > 0 ? routine.days : [...WEEK_DAYS],
    });
    setError("");
  };

  const toggleEditDay = (day) => {
    setEditForm((prev) => {
      const exists = prev.days.includes(day);
      if (exists) {
        if (prev.days.length === 1) return prev;
        return { ...prev, days: prev.days.filter((d) => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      category: "General",
      time: "",
      reminder: true,
      days: [todayName],
    });
  };

  const handleUpdate = async (id) => {
    if (!editForm.title || !editForm.description) return;

    setSavingEdit(true);
    setError("");
    try {
      const updated = await routineApi.update(id, editForm);
      setRoutines((prev) => prev.map((r) => (r._id === id ? updated : r)));
      scheduleReminder(updated); // Reschedule exact timer
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Failed to update routine");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this routine?")) return;

    setDeletingId(id);
    setError("");
    try {
      await routineApi.remove(id);
      cancelReminder(id); // Cancel exact timer
      setRoutines((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete routine");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-16 font-[Poppins] relative">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
        Daily Routines Plan
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Weekly Day Selector Tabs */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-6">
        {["All Plans", ...WEEK_DAYS].map((dayOption) => {
          const val = dayOption === "All Plans" ? "All" : dayOption;
          const isSelected = selectedDay === val;
          const isToday = val === todayName;

          return (
            <button
              key={dayOption}
              onClick={() => setSelectedDay(val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-red-600 text-white shadow-sm scale-105"
                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-100"
              }`}
            >
              <span>{dayOption === "All Plans" ? "📋" : "📅"}</span>
              <span>{dayOption === "All Plans" ? dayOption : dayOption.slice(0, 3)}</span>
              {isToday && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isSelected ? "bg-white text-red-700" : "bg-red-200 text-red-800"
                  }`}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center text-xs text-gray-500 mb-6">
        {selectedDay === "All"
          ? "Showing all planned routines across the week"
          : `Showing your specific routine plan for ${selectedDay}`}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading routines...</p>
      ) : filteredRoutines.length === 0 ? (
        <div className="text-center py-12 bg-pink-50/40 rounded-2xl border border-dashed border-red-200">
          <p className="text-gray-500 text-sm">
            {selectedDay === "All"
              ? "No routines yet. Click the + button below to add your first daily routine!"
              : `No routine planned for ${selectedDay}. Click the + button below to add meals, workouts, or tasks for ${selectedDay}!`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRoutines.map((routine) => (
            <div key={routine._id} className="bg-[#ffe5e5] p-4 rounded-xl shadow">
              {editingId === routine._id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-3 py-1.5 border border-red-300 rounded-md bg-white text-red-700 font-semibold text-sm"
                      placeholder="Title"
                    />
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      className="w-full px-3 py-1.5 border border-red-300 rounded-md bg-white text-red-700 text-sm font-medium"
                    >
                      {ROUTINE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Edit Days */}
                  <div>
                    <label className="text-xs font-semibold text-red-800 block mb-1">
                      Applies to Days:
                    </label>
                    <div className="grid grid-cols-7 gap-1">
                      {WEEK_DAYS.map((d) => {
                        const isDaySelected = editForm.days.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => toggleEditDay(d)}
                            className={`py-1 text-xs rounded-md font-semibold text-center transition ${
                              isDaySelected
                                ? "bg-red-600 text-white"
                                : "bg-white text-red-700 border border-red-200 hover:bg-red-50"
                            }`}
                          >
                            {d.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                    <input
                      type="time"
                      value={editForm.time}
                      onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                      className="w-full px-3 py-1.5 border border-red-300 rounded-md bg-white text-red-700 text-sm"
                    />
                    <label className="flex items-center gap-2 text-xs font-semibold text-red-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.reminder}
                        onChange={(e) => setEditForm({ ...editForm, reminder: e.target.checked })}
                        className="rounded text-red-600 accent-red-600"
                      />
                      <span>Remind me at this time</span>
                    </label>
                  </div>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-1.5 border border-red-300 rounded-md bg-white text-red-600 text-sm"
                    placeholder="Description"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="p-2 text-gray-600 hover:bg-white rounded-md"
                      aria-label="Cancel edit"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => handleUpdate(routine._id)}
                      disabled={savingEdit}
                      className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-md disabled:opacity-60"
                      aria-label="Save edit"
                    >
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-red-700 border border-red-200 shadow-xs">
                        {routine.category || "General"}
                      </span>
                      {routine.days && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                          {routine.days.length === 7
                            ? "Everyday"
                            : routine.days.map((d) => d.slice(0, 3)).join(", ")}
                        </span>
                      )}
                      {routine.time && (
                        <span className="text-xs text-red-700 bg-white/80 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                          <Clock size={12} />
                          {formatTimeDisplay(routine.time)}
                          {routine.reminder !== false && <Bell size={11} className="text-red-500 fill-red-400 ml-0.5" />}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-semibold text-red-700">{routine.title}</h2>
                    <p className="text-red-600 text-sm">{routine.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(routine)}
                      className="p-2 text-red-600 hover:bg-white rounded-md transition"
                      aria-label="Edit routine"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(routine._id)}
                      disabled={deletingId === routine._id}
                      className="p-2 text-red-600 hover:bg-white rounded-md transition disabled:opacity-60"
                      aria-label="Delete routine"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition z-50 flex items-center gap-2 px-5"
        aria-label="Add new routine"
      >
        <Plus size={22} />
        <span className="text-sm font-semibold hidden md:inline">Add Routine</span>
      </button>

      {showForm && (
        <AddRoutineForm
          initialDay={selectedDay === "All" ? todayName : selectedDay}
          onClose={() => setShowForm(false)}
          onSave={handleAddRoutine}
        />
      )}
    </div>
  );
};

export default DailyRoutinePlan;