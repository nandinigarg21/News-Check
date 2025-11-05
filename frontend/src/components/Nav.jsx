import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import toast from "react-hot-toast";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    dispatch(logout());
    setTimeout(() => navigate("/login"), 300); // ✅ prevents toast from disappearing instantly
  };

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-extrabold select-none tracking-tight hover:text-blue-400 transition duration-200"
        >
          Fake<span className="text-blue-500">News</span>{" "}
          <span className="hidden sm:inline">Detector</span>
        </Link>

        {/* Right Side */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm sm:text-base">
              Hi,{" "}
              <span className="font-semibold text-blue-400">
                {user?.username || user?.name || "User"}
              </span>
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
