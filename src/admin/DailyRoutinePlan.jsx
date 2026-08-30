import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import AddRoutineForm from "./AddroutinePlan";
import { routineApi } from "../utils/fetchApi";

const DailyRoutinePlan = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await routineApi.getAll();
        setRoutines(data);
      } catch (err) {
        setError(err.message || "Failed to load routines");
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const handleAddRoutine = async (form) => {
    const newRoutine = await routineApi.create(form.title, form.description);
    setRoutines((prev) => [newRoutine, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-16 font-[Poppins] relative">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
        Daily Routines Plan
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-500">Loading routines...</p>
      ) : routines.length === 0 ? (
        <p className="text-center text-gray-500">No routines yet. Add one below.</p>
      ) : (
        <div className="space-y-4">
          {routines.map((routine) => (
            <div key={routine._id} className="bg-[#ffe5e5] p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold text-red-700">{routine.title}</h2>
              <p className="text-red-600 text-sm">{routine.description}</p>
            </div>
          ))}
        </div>
      )}

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