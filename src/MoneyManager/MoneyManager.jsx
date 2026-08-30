import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import AddRecordForm from "./component/AddMoney";
import { moneyApi } from "../utils/fetchApi";

const MoneyManager = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddPage, setShowAddPage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await moneyApi.getAll();
        setRecords(data);
      } catch (err) {
        setError(err.message || "Failed to load records");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const totalIncome = records
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      await moneyApi.remove(id);
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete record");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAdd = async (record) => {
    const newRecord = await moneyApi.create(record);
    setRecords((prev) => [newRecord, ...prev]);
    setShowAddPage(false);
  };

  if (showAddPage) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 md:px-16 font-[Poppins]">
        <AddRecordForm onClose={() => setShowAddPage(false)} onSave={handleAdd} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 md:px-16 font-[Poppins] relative">
      <h1 className="text-3xl font-bold text-red-600 text-center mb-6">Money Manager</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Balance */}
      <div
        className={`p-5 rounded-xl shadow mb-4 text-center font-bold text-2xl ${
          balance >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        Balance: ₹{balance.toFixed(2)}
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#ffe5e5] p-4 rounded-xl shadow text-red-700 font-semibold text-lg">
          Income: ₹{totalIncome.toFixed(2)}
        </div>
        <div className="bg-[#ffe5e5] p-4 rounded-xl shadow text-red-700 font-semibold text-lg">
          Expenses: ₹{totalExpense.toFixed(2)}
        </div>
      </div>

      {/* Record List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading records...</p>
      ) : records.length === 0 ? (
        <p className="text-center text-gray-500">No records yet.</p>
      ) : (
        <div className="space-y-4">
          {records.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#ffe5e5] p-4 rounded-xl shadow"
            >
              <div>
                <h3 className="font-bold text-red-800">
                  {item.type === "income" ? "Income" : "Expense"} – ₹{item.amount}
                </h3>
                <p className="text-red-700 text-sm">
                  {item.category}
                  {item.description ? ` | ${item.description}` : ""}
                </p>
                <p className="text-sm text-red-500">
                  {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={deletingId === item._id}
                className="text-red-500 hover:text-red-700 mt-2 md:mt-0 disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddPage(true)}
        className="fixed bottom-6 right-6 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition z-50"
        aria-label="Add new record"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default MoneyManager;