import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import AddRoutineForm from "./AddroutinePlan";
import { routineApi } from "../utils/fetchApi";

const DailyRoutinePlan = () => {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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

  const startEdit = (routine) => {
    setEditingId(routine._id);
    setEditForm({ title: routine.title, description: routine.description });
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", description: "" });
  };

  const handleUpdate = async (id) => {
    if (!editForm.title || !editForm.description) return;

    setSavingEdit(true);
    setError("");
    try {
      const updated = await routineApi.update(id, editForm);
      setRoutines((prev) => prev.map((r) => (r._id === id ? updated : r)));
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

      {loading ? (
        <p className="text-center text-gray-500">Loading routines...</p>
      ) : routines.length === 0 ? (
        <p className="text-center text-gray-500">No routines yet. Add one below.</p>
      ) : (
        <div className="space-y-4">
          {routines.map((routine) => (
            <div key={routine._id} className="bg-[#ffe5e5] p-4 rounded-xl shadow">
              {editingId === routine._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-2 py-1 border border-red-300 rounded-md bg-white text-red-700 font-semibold"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2}
                    className="w-full px-2 py-1 border border-red-300 rounded-md bg-white text-red-600 text-sm"
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
                  <div>
                    <h2 className="text-lg font-semibold text-red-700">{routine.title}</h2>
                    <p className="text-red-600 text-sm">{routine.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(routine)}
                      className="p-2 text-red-600 hover:bg-white rounded-md"
                      aria-label="Edit routine"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(routine._id)}
                      disabled={deletingId === routine._id}
                      className="p-2 text-red-600 hover:bg-white rounded-md disabled:opacity-60"
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