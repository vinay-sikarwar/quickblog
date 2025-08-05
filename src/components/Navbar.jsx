import React from "react";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 py-3">
        {/* Logo */}
        <img
          src={assets.logo}
          alt="logo"
          className="w-24 sm:w-28 md:w-36 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Login/Admin Button */}
        <button
          onClick={() => navigate(user ? "/admin" : "/login")}
          className="flex items-center gap-2 rounded-full text-xs sm:text-sm bg-primary text-white px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 hover:bg-primary/90 transition-all"
        >
          {user ? "Admin Panel" : "Login"}
          <img src={assets.arrow} alt="arrow" className="w-2.5 sm:w-3" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
