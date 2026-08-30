import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import DailyRoutinePlan from "../admin/DailyRoutinePlan";
import DailyRoutine from "./DailyRoutine";
import MoneyManager from "./MoneyManager";

const Sidebar = () => {
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
    setIsOpen(false); // Close sidebar on mobile after selection
  };

  const renderContent = () => {
    switch(activeItem) {
      case "Admin":
        return (
          <div className="space-y-2">
           <DailyRoutinePlan/>
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
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" defaultValue="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" defaultValue="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" defaultValue="+1 (555) 123-4567" />
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Overlay for Mobile/Tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-[#ffe5e5] text-red-700 shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:relative lg:translate-x-0 lg:flex lg:flex-col`}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-red-300">
          <span className="font-bold text-xl">Dear Me</span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden hover:bg-red-200 p-1 rounded"
          >
            <X size={18} className="text-red-700" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`w-full flex items-center space-x-3 py-3 px-3 rounded-lg transition-colors duration-200 text-sm font-medium text-left
                    ${activeItem === item.label 
                      ? 'bg-red-200 text-red-800' 
                      : 'hover:bg-red-200 text-red-700'
                    }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${activeItem === item.label 
                      ? 'bg-red-700 text-white' 
                      : 'bg-red-600 text-white'
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile/Tablet Header - Shows up to lg breakpoint */}
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

        {/* Content */}
        <main className="flex-1 p-2 lg:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;