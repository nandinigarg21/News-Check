import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/operations/authOperation";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    // ✅ Validations
    if (!username.trim()) return toast.error("Username is required");
    if (!password.trim()) return toast.error("Password is required");

    dispatch(login(formData, navigate)); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-slate-950 text-white px-4">
      <div className="bg-slate-900 p-10 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-800 mt-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back 👋</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block mb-1 text-gray-400">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              onChange={handleChange}
              value={formData.username}
            />
          </div>

          {/* Password + Toggle */}
          <div>
            <label className="block mb-1 text-gray-400">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                placeholder="Enter your password"
                onChange={handleChange}
                value={formData.password}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all mt-4 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
