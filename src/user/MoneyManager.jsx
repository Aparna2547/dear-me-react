import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import AddRecordForm from "./AddMoney";

const MoneyManager = () => {
  const [records, setRecords] = useState([
    {
      id: 1,
      type: "expense",
      date: "2025-07-01",
      amount: 100,
      category: "Groceries",
      description: "Vegetables",
    },
    {
      id: 2,
      type: "income",
      date: "2025-07-01",
      amount: 1000,
      category: "Salary",
      description: "Monthly salary",
    },
  ]);

  const [showAddPage, setShowAddPage] = useState(false);

  const totalIncome = records
    .filter((r) => r.type === "income")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter((r) => r.type === "expense")
    .reduce((sum, r) => sum + r.amount, 0);

  const handleDelete = (id) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const handleAdd = (record) => {
    setRecords([...records, { ...record, id: Date.now() }]);
    setShowAddPage(false);
  };

  // Conditionally render Add Form as a full page
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

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#ffe5e5] p-4 rounded-xl shadow text-red-700 font-semibold text-lg">
          Income: ₹{totalIncome}
        </div>
        <div className="bg-[#ffe5e5] p-4 rounded-xl shadow text-red-700 font-semibold text-lg">
          Expenses: ₹{totalExpense}
        </div>
      </div>

      {/* Record List */}
      <div className="space-y-4">
        {records.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#ffe5e5] p-4 rounded-xl shadow"
          >
            <div>
              <h3 className="font-bold text-red-800">
                {item.type === "income" ? "Income" : "Expense"} – ₹{item.amount}
              </h3>
              <p className="text-red-700 text-sm">
                {item.category} | {item.description}
              </p>
              <p className="text-sm text-red-500">{item.date}</p>
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500 hover:text-red-700 mt-2 md:mt-0"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

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
