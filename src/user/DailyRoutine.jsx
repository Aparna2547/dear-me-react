import React, { useState } from "react";

const initialTasks = [
  {
    id: 1,
    time: "07:00 AM",
    title: "Morning Walk",
    description: "30-minute walk in the park",
    done: false,
  },
  {
    id: 2,
    time: "08:00 AM",
    title: "Breakfast",
    description: "Healthy meal with fruits and oats",
    done: false,
  },
  {
    id: 3,
    time: "09:00 AM",
    title: "Read Book",
    description: "Read 20 pages of a motivational book",
    done: false,
  },
];

const DailyRoutine = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleDone = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updated);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-16 font-[Poppins]">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
        Daily Routines
      </h1>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex flex-col md:flex-row justify-between items-start md:items-center bg-[#ffe5e5] rounded-xl p-4 shadow transition ${
              task.done ? "opacity-60" : ""
            }`}
          >
            <div className="text-sm text-red-800 font-semibold w-full md:w-1/6">
              {task.time}
            </div>

            <div className="flex-1 w-full md:ml-4">
              <h2
                className={`text-lg font-semibold ${
                  task.done ? "line-through text-gray-500" : "text-red-700"
                }`}
              >
                {task.title}
              </h2>
              <p
                className={`text-sm ${
                  task.done ? "line-through text-gray-400" : "text-red-600"
                }`}
              >
                {task.description}
              </p>
            </div>

            <div className="mt-2 md:mt-0">
              <button
                onClick={() => toggleDone(task.id)}
                className={`border-2 rounded-full w-6 h-6 flex items-center justify-center ${
                  task.done
                    ? "bg-red-500 border-red-500"
                    : "border-red-400"
                }`}
                aria-label="Mark as done"
              >
                {task.done && (
                  <span className="text-white font-bold text-sm">✓</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyRoutine;
