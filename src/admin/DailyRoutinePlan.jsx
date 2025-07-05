import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import AddRoutineForm from "./AddroutinePlan";

const DailyRoutinePlan = () => {
  const [routines, setRoutines] = useState([
    { id: 1, title: "Exercise", description: "Go for a 30-minute run" },
    { id: 2, title: "Meditation", description: "Meditate for 10 minutes" },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleAddRoutine = (routine) => {
    setRoutines([...routines, { ...routine, id: Date.now() }]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-16 font-[Poppins] relative">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
        Daily Routines Plan
      </h1>

      {/* Routines List */}
      <div className="space-y-4">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="bg-[#ffe5e5] p-4 rounded-xl shadow"
          >
            <h2 className="text-lg font-semibold text-red-700">
              {routine.title}
            </h2>
            <p className="text-red-600 text-sm">{routine.description}</p>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition z-50"
        aria-label="Add new routine"
      >
        <Plus size={24} />
      </button>

      {showForm && (
        <AddRoutineForm onClose={() => setShowForm(false)} onSave={handleAddRoutine} />
      )}
    </div>
  );
};

export default DailyRoutinePlan;
