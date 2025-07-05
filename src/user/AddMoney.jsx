import React, { useState } from "react";
import { X } from "lucide-react";

const AddRecordForm = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!form.amount || !form.category || !form.description) return;
    onSave({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <div className="min-h-screen bg-white font-[Poppins] px-4 py-6 md:px-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-red-600">Add New Record</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Row 1: Type & Date */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Type */}
          <div className="w-full md:w-1/2">
            <label className="text-red-700 text-sm mb-1 block">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border border-red-300 px-3 py-2 rounded-md"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Date */}
          <div className="w-full md:w-1/2">
            <label className="text-red-700 text-sm mb-1 block">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border border-red-300 px-3 py-2 rounded-md"
            />
          </div>
        </div>

        {/* Row 2: Amount & Category */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Amount */}
          <div className="w-full md:w-1/2">
            <label className="text-red-700 text-sm mb-1 block">Amount</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full border border-red-300 px-3 py-2 rounded-md"
              placeholder="e.g. 1000"
            />
          </div>

          {/* Category */}
          <div className="w-full md:w-1/2">
            <label className="text-red-700 text-sm mb-1 block">Category</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-red-300 px-3 py-2 rounded-md"
              placeholder="e.g. Salary, Groceries"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-red-700 text-sm mb-1 block">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border border-red-300 px-3 py-2 rounded-md"
            placeholder="Add notes..."
            rows={3}
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="border border-red-300 text-red-500 px-6 py-2 rounded-md hover:bg-red-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecordForm;
