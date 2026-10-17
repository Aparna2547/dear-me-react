import React from "react";
import { Bell, X, Check } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { dailyRoutineApi } from "../utils/fetchApi";

const NotificationToast = ({ onTaskCompleted }) => {
  const { activeToast, dismissToast } = useNotification();

  if (!activeToast) return null;

  const handleMarkDone = async () => {
    try {
      if (activeToast.routineId) {
        await dailyRoutineApi.toggleComplete(activeToast.routineId, true);
        if (onTaskCompleted) onTaskCompleted(activeToast.routineId);
      }
    } catch (err) {
      console.warn("Failed to mark task done from toast:", err);
    } finally {
      dismissToast();
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full bg-white border border-red-200 rounded-2xl shadow-2xl p-4 animate-bounce-short">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
          <Bell className="w-5 h-5 animate-wiggle" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
              {activeToast.category}
            </span>
            <span className="text-xs text-gray-400">{activeToast.timestamp}</span>
          </div>

          <h4 className="text-sm font-bold text-gray-800 mt-1 truncate">
            {activeToast.title}
          </h4>
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
            {activeToast.description}
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={handleMarkDone}
              className="flex items-center gap-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition"
            >
              <Check size={14} />
              Mark Done
            </button>
            <button
              onClick={dismissToast}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1.5"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={dismissToast}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
