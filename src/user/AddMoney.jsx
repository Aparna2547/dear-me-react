import React from "react";
import { useForm } from "react-hook-form";

const AddRecordForm = ({ onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      category: "",
      description: "",
    },
  });

  const onSubmit = (data) => {
    onSave({ ...data, amount: parseFloat(data.amount) });
  };

  return (
    <div className="min-h-screen bg-white font-[Poppins] px-4 py-6 md:px-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-red-600">Add New Record</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Type & Date */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <label className="text-red-700 text-sm mb-1 block">Type</label>
            <select
              {...register("type")}
              className="w-full border border-red-300 px-3 py-2 rounded-md"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <label className="text-red-700 text-sm mb-1 block">Date</label>
            <input
              type="date"
              {...register("date")}
              className="w-full border border-red-300 px-3 py-2 rounded-md"
            />
          </div>
        </div>

        {/* Row 2: Amount & Category */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <label className="text-red-700 text-sm mb-1 block">Amount</label>
            <input
              type="number"
              {...register("amount", { required: "Amount is required" })}
              className="w-full border border-red-300 px-3 py-2 rounded-md"
              placeholder="e.g. 1000"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          <div className="w-full md:w-1/2">
            <label className="text-red-700 text-sm mb-1 block">Category</label>
            <input
              type="text"
              {...register("category", { required: "Category is required" })}
              className="w-full border border-red-300 px-3 py-2 rounded-md"
              placeholder="e.g. Salary, Groceries"
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-red-700 text-sm mb-1 block">Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            className="w-full border border-red-300 px-3 py-2 rounded-md"
            placeholder="Add notes..."
            rows={3}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
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
