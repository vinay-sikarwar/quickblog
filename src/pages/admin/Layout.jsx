import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate("/");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-8 md:px-12 py-3 h-[70px] border-b border-gray-200 bg-white z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-600 focus:outline-none"
          >
            <svg
              className={`h-6 w-6 transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isSidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <img
            src={assets.logo}
            alt="logo"
            className="w-28 sm:w-36 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={handleLogout}
            className="px-6 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 h-full mt-[70px] overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed top-[70px] md:top-0 bottom-0 left-0 z-50 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 md:w-64 bg-white border-r border-gray-200 overflow-y-auto`}
        >
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 bg-gray-50">
          <div className="text-lg font-semibold text-gray-700 mb-6 hidden md:block">
            Welcome, {user?.email}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
