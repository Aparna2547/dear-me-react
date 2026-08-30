import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import DailyRoutinePlan from "../admin/DailyRoutinePlan";
import DailyRoutine from "../Dailyroutine.js/DailyRoutine";
import MoneyManager from "../MoneyManager/MoneyManager";
import Profile from "./Profile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Admin");

  const navItems = [
    { label: "Admin", id: "admin" },
    { label: "Daily Routine", id: "daily-routine" },
    { label: "Money Manager", id: "money-manager" },
    { label: "Profile", id: "profile" },
  ];

  const handleNavClick = (item) => {
    setActiveItem(item.label);
    setIsOpen(false);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Admin":
        return (
          <div className="space-y-2">
            <DailyRoutinePlan />
          </div>
        );
      case "Daily Routine":
        return (
          <div className="space-y-2">
            <DailyRoutine />
          </div>
        );
      case "Money Manager":
        return (
          <div className="space-y-2">
            <MoneyManager />
          </div>
        );
      case "Profile":
        return <Profile />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#ffe5e5] text-red-700 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:relative lg:translate-x-0 lg:flex lg:flex-col`}
      >
        <div className="p-4 flex justify-between items-center border-b border-red-300">
          <span className="font-bold text-xl">Dear Me</span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden hover:bg-red-200 p-1 rounded"
          >
            <X size={18} className="text-red-700" />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center space-x-3 py-3 px-3 rounded-lg transition-colors duration-200 text-sm font-medium text-left
                    ${activeItem === item.label
                      ? "bg-red-200 text-red-800"
                      : "hover:bg-red-200 text-red-700"
                    }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${activeItem === item.label
                      ? "bg-red-700 text-white"
                      : "bg-red-600 text-white"
                    }`}>
                    {item.label.charAt(0)}
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsOpen(true)}
              className="text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-lg text-red-600">Dear Me</span>
            <div className="w-10"></div>
          </div>
        </header>

        <main className="flex-1 p-2 lg:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Navbar;