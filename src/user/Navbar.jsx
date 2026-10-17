import React, { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut, Bell, CheckCircle2 } from "lucide-react";
import DailyRoutinePlan from "../admin/DailyRoutinePlan";
import DailyRoutine from "../Dailyroutine.js/DailyRoutine";
import MoneyManager from "../MoneyManager/MoneyManager";
import Profile from "./Profile";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import NotificationToast from "../components/NotificationToast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Daily Routine");
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const notifRef = useRef(null);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const { permission, requestPermission, history } = useNotification();

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotificationMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signup");
  };

  const navItems = [
    { label: "Daily Routine", id: "daily-routine" },
    { label: "Routine Planner", id: "admin" },
    { label: "Money Manager", id: "money-manager" },
    { label: "Profile", id: "profile" },
  ];

  const handleNavClick = (item) => {
    setActiveItem(item.label);
    setIsOpen(false);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Routine Planner":
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

        {/* Logout Section */}
        <div className="p-4 border-t border-red-300">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 py-2.5 px-3 rounded-lg text-red-700 hover:bg-red-200 transition-colors duration-200 text-sm font-medium"
          >
            <LogOut size={18} className="text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar with Notification Bell */}
        <header className="bg-white shadow-xs border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              <Menu size={22} />
            </button>
            <span className="font-bold text-lg text-red-600 lg:hidden">Dear Me</span>
            <span className="hidden lg:inline text-sm font-semibold text-gray-700">
              {activeItem}
            </span>
          </div>

          {/* Right Header Actions: Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotificationMenu(!showNotificationMenu)}
              className="relative p-2 rounded-full hover:bg-red-50 text-red-700 transition"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {history.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Dropdown Menu */}
            {showNotificationMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-red-100 rounded-2xl shadow-xl z-50 p-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    <Bell size={16} className="text-red-500" />
                    <span>Reminders & Notifications</span>
                  </h4>
                  {permission !== "granted" && (
                    <button
                      onClick={requestPermission}
                      className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 rounded-md font-medium transition"
                    >
                      Allow Push
                    </button>
                  )}
                </div>

                {permission === "granted" ? (
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-2 mb-2 font-medium">
                    <CheckCircle2 size={13} /> Desktop push notifications enabled
                  </p>
                ) : (
                  <div className="text-xs text-amber-700 mt-2 mb-2 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    Click <strong>Allow Push</strong> to receive reminders even when your browser tab is in the background.
                  </div>
                )}

                <div className="max-h-60 overflow-y-auto space-y-2 mt-2">
                  {history.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No reminder alerts yet. When your scheduled routine time arrives, you'll see it here!
                    </p>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-red-50/60 border border-red-100 text-xs">
                        <div className="flex justify-between font-semibold text-red-800">
                          <span>{item.title}</span>
                          <span className="text-gray-400 font-normal">{item.timestamp}</span>
                        </div>
                        <p className="text-gray-600 mt-0.5">{item.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <NotificationToast />

        <main className="flex-1 p-2 lg:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Navbar;