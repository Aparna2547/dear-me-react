import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [permission, setPermission] = useState(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default"
  );
  const [activeToast, setActiveToast] = useState(null);
  const [history, setHistory] = useState([]);
  const timersRef = useRef({});

  // Request browser desktop notification permission
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications.");
      return "denied";
    }
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res;
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      return "default";
    }
  };

  // Play a soft, pleasant chime sound using Web Audio API (no external file needed)
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Audio autoplay policy may suppress audio until user interacts
    }
  };

  // Trigger the notification: Desktop Web Notification + Audio Chime + In-App Toast
  const triggerNotification = (routine) => {
    playChime();

    // 1. Desktop Browser Notification
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(`Dear Me: ${routine.title}`, {
          body: `⏰ Time for ${routine.category || "Routine"}: ${routine.description}`,
          icon: "/vite.svg",
        });
      } catch (err) {
        console.warn("Desktop notification error:", err);
      }
    }

    // 2. In-App Toast Banner
    const toastData = {
      id: `${routine._id}-${Date.now()}`,
      routineId: routine._id,
      title: routine.title,
      description: routine.description,
      category: routine.category || "General",
      time: routine.time,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setActiveToast(toastData);
    setHistory((prev) => [toastData, ...prev.slice(0, 19)]); // keep last 20 notifications
  };

  // Directly schedule an exact setTimeout timer for a routine time without polling
  const scheduleReminder = (routine) => {
    if (!routine || !routine._id || !routine.time) return;

    // Clear any existing timer for this routine
    if (timersRef.current[routine._id]) {
      clearTimeout(timersRef.current[routine._id]);
      delete timersRef.current[routine._id];
    }

    if (routine.reminder === false) return;

    let targetHours = 0;
    let targetMinutes = 0;

    // Parse time: supports "08:30" string or ISO date string
    if (typeof routine.time === "string" && routine.time.includes(":")) {
      if (routine.time.includes("T")) {
        const d = new Date(routine.time);
        targetHours = d.getHours();
        targetMinutes = d.getMinutes();
      } else {
        const parts = routine.time.split(":");
        targetHours = parseInt(parts[0], 10);
        targetMinutes = parseInt(parts[1], 10);
      }
    } else {
      return;
    }

    const routineDays =
      routine.days && routine.days.length > 0
        ? routine.days
        : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const now = new Date();

    // Find the next upcoming occurrence matching one of the routine's planned days
    for (let i = 0; i <= 7; i++) {
      const candidate = new Date();
      candidate.setDate(candidate.getDate() + i);
      candidate.setHours(targetHours, targetMinutes, 0, 0);

      const candidateDayName = candidate.toLocaleDateString("en-US", { weekday: "long" });

      if (routineDays.includes(candidateDayName) && candidate.getTime() > now.getTime()) {
        const delay = candidate.getTime() - now.getTime();

        timersRef.current[routine._id] = setTimeout(() => {
          triggerNotification(routine);
          // Re-schedule for next planned day
          scheduleReminder(routine);
        }, delay);
        break;
      }
    }
  };

  // Schedule multiple routines at once
  const syncRoutines = (routines) => {
    if (!Array.isArray(routines)) return;
    routines.forEach((routine) => {
      scheduleReminder(routine);
    });
  };

  // Cancel a scheduled reminder (e.g. When routine is deleted)
  const cancelReminder = (routineId) => {
    if (timersRef.current[routineId]) {
      clearTimeout(timersRef.current[routineId]);
      delete timersRef.current[routineId];
    }
  };

  const dismissToast = () => setActiveToast(null);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timerId) => clearTimeout(timerId));
      timersRef.current = {};
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        permission,
        requestPermission,
        activeToast,
        dismissToast,
        history,
        scheduleReminder,
        syncRoutines,
        cancelReminder,
        triggerNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
