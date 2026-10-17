import React, { useState, useEffect } from "react";
import { dailyRoutineApi as routineApi } from "../utils/fetchApi";
import { Sparkles, CheckCircle2, Clock, Bell, Calendar } from "lucide-react";
import { ROUTINE_CATEGORIES, WEEK_DAYS } from "../admin/AddroutinePlan";
import { useNotification } from "../context/NotificationContext";

const formatTime = (time) => {
  if (!time) return "";
  if (typeof time === "string" && !time.includes("T") && time.includes(":")) {
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  }
  return new Date(time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CATEGORY_ICONS = {
  "Breakfast & Food": "🍳",
  "Workout & Fitness": "🏃",
  "Hydration & Health": "💧",
  "Skincare & Self-Care": "🌸",
  "Work & Study": "💼",
  "Evening & Sleep": "🌙",
  General: "📌",
};

const DailyRoutine = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Default to today's day of week
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [selectedDay, setSelectedDay] = useState(todayName);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const { syncRoutines } = useNotification();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await routineApi.getAll();
        setTasks(data);
        syncRoutines(data);
      } catch (err) {
        setError(err.message || "Failed to load routines");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const toggleDone = async (id, currentStatus) => {
    setTogglingId(id);
    setError("");
    try {
      const updated = await routineApi.toggleComplete(id, !currentStatus);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setTogglingId(null);
    }
  };

  const categories = ["All", ...ROUTINE_CATEGORIES];

  // 1. Filter by Selected Day (Monday, Tuesday, etc.)
  const dayTasks = tasks.filter((t) => {
    const routineDays = t.days && t.days.length > 0 ? t.days : WEEK_DAYS;
    return routineDays.includes(selectedDay);
  });

  // 2. Filter by Category (e.g. Breakfast & Food, Workout, All)
  const filteredTasks =
    selectedCategory === "All"
      ? dayTasks
      : dayTasks.filter(
          (t) => (t.category || "General").toLowerCase() === selectedCategory.toLowerCase()
        );

  // 3. Sort chronologically by time (e.g. 07:00 -> 07:30 -> 08:30 -> 18:30)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  const completedCount = dayTasks.filter((t) => t.completed).length;
  const progressPercent = dayTasks.length > 0 ? Math.round((completedCount / dayTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-12 font-[Poppins]">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-red-600 flex items-center justify-center gap-2">
          <span>Daily Routines</span>
          <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Your personalized day-by-day self-care and habit schedule.
        </p>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Day of Week Selector */}
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-2.5 mb-6">
        <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
          {WEEK_DAYS.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = day === todayName;
            const dayTaskCount = tasks.filter((t) => (t.days || WEEK_DAYS).includes(day)).length;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center min-w-[56px] md:min-w-[72px] px-2.5 py-2 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-b from-red-500 to-pink-500 text-white shadow-md scale-105"
                    : "bg-white text-red-800 hover:bg-red-100/70 border border-red-100"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {day.slice(0, 3)}
                </span>
                <span className="text-xs font-semibold mt-0.5">
                  {dayTaskCount} {dayTaskCount === 1 ? "task" : "tasks"}
                </span>
                {isToday && (
                  <span
                    className={`text-[8px] font-extrabold uppercase px-1 rounded-full mt-1 ${
                      isSelected ? "bg-white text-red-600" : "bg-red-200 text-red-800"
                    }`}
                  >
                    Today
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Title Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 bg-gradient-to-r from-pink-50 to-red-50 p-4 rounded-2xl border border-pink-100">
        <div>
          <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
            <span>📅 {selectedDay}'s Schedule</span>
            {selectedDay === todayName && (
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
                Today
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {dayTasks.length} {dayTasks.length === 1 ? "habit planned" : "habits planned"} for {selectedDay}
          </p>
        </div>

        {dayTasks.length > 0 && (
          <div className="mt-3 sm:mt-0 text-right">
            <span className="text-xs font-bold text-red-600">
              {completedCount} of {dayTasks.length} done ({progressPercent}%)
            </span>
            <div className="w-36 bg-red-100 rounded-full h-2.5 mt-1 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-red-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count =
            cat === "All"
              ? dayTasks.length
              : dayTasks.filter((t) => (t.category || "General").toLowerCase() === cat.toLowerCase()).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs md:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                isSelected
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-red-50 text-red-700 hover:bg-red-100"
              }`}
            >
              <span>{CATEGORY_ICONS[cat] || "✨"}</span>
              <span>{cat}</span>
              <span
                className={`text-xs px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-red-800 text-white" : "bg-red-200/60 text-red-800"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-10">Loading your routines...</p>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-12 bg-pink-50/40 rounded-2xl border border-dashed border-red-200">
          <p className="text-gray-500 text-sm">
            {selectedCategory === "All"
              ? `No routine planned for ${selectedDay}. Go to Routine Planner to add your ${selectedDay} schedule!`
              : `No ${selectedCategory} planned for ${selectedDay}. Add one in Routine Planner!`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => {
            const taskCategory = task.category || "General";
            const icon = CATEGORY_ICONS[taskCategory] || "📌";

            return (
              <div
                key={task._id}
                className={`flex flex-col md:flex-row justify-between items-start md:items-center bg-[#ffe5e5] rounded-2xl p-4 md:p-5 shadow-sm transition-all duration-200 ${
                  task.completed ? "opacity-60 bg-red-50/60" : "hover:shadow-md"
                }`}
              >
                {/* Time & Category */}
                <div className="flex items-center gap-2 w-full md:w-1/4 mb-2 md:mb-0">
                  <span className="text-base">{icon}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/80 text-red-700 inline-block w-fit">
                      {taskCategory}
                    </span>
                    {task.time && (
                      <span className="text-xs text-red-800 font-medium flex items-center gap-1 mt-1">
                        <Clock size={12} />
                        {formatTime(task.time)}
                        {task.reminder !== false && <Bell size={11} className="text-red-500 fill-red-400 ml-0.5" />}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div className="flex-1 w-full md:ml-4">
                  <h2
                    className={`text-lg font-semibold ${
                      task.completed ? "line-through text-gray-500" : "text-red-800"
                    }`}
                  >
                    {task.title}
                  </h2>
                  <p
                    className={`text-sm mt-0.5 ${
                      task.completed ? "line-through text-gray-400" : "text-red-600"
                    }`}
                  >
                    {task.description}
                  </p>
                </div>

                {/* Completion Toggle */}
                <div className="mt-3 md:mt-0 shrink-0">
                  <button
                    onClick={() => toggleDone(task._id, task.completed)}
                    disabled={togglingId === task._id}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 disabled:opacity-50 ${
                      task.completed
                        ? "bg-red-500 text-white shadow-xs"
                        : "bg-white text-red-600 border border-red-300 hover:bg-red-50"
                    }`}
                    aria-label="Mark as done"
                  >
                    <CheckCircle2 size={16} />
                    <span>{task.completed ? "Done" : "Mark Done"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DailyRoutine;