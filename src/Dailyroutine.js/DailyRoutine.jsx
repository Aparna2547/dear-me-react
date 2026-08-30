import React, { useState, useEffect } from "react";
import { dailyRoutineApi as routineApi } from "../utils/fetchApi";
const formatTime = (isoTime) => {
  if (!isoTime) return "";
  return new Date(isoTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DailyRoutine = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await routineApi.getAll();
        setTasks(data);
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

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-16 font-[Poppins]">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
        Daily Routines
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Loading routines...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500">No routines yet.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`flex flex-col md:flex-row justify-between items-start md:items-center bg-[#ffe5e5] rounded-xl p-4 shadow transition ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <div className="text-sm text-red-800 font-semibold w-full md:w-1/6">
                {formatTime(task.time)}
              </div>

              <div className="flex-1 w-full md:ml-4">
                <h2
                  className={`text-lg font-semibold ${
                    task.completed ? "line-through text-gray-500" : "text-red-700"
                  }`}
                >
                  {task.title}
                </h2>
                <p
                  className={`text-sm ${
                    task.completed ? "line-through text-gray-400" : "text-red-600"
                  }`}
                >
                  {task.description}
                </p>
              </div>

              <div className="mt-2 md:mt-0">
                <button
                  onClick={() => toggleDone(task._id, task.completed)}
                  disabled={togglingId === task._id}
                  className={`border-2 rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50 ${
                    task.completed ? "bg-red-500 border-red-500" : "border-red-400"
                  }`}
                  aria-label="Mark as done"
                >
                  {task.completed && (
                    <span className="text-white font-bold text-sm">✓</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyRoutine;