import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../services/operations/authOperation";
import toast from "react-hot-toast";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    const { firstName, lastName, username, email, password, confirmPassword } =
      formData;

    // ✅ Validations
    if (!firstName.trim()) return toast.error("First name is required");
    if (!lastName.trim()) return toast.error("Last name is required");
    if (!username.trim()) return toast.error("Username is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!emailRegex.test(email)) return toast.error("Enter a valid email");
    if (!password.trim()) return toast.error("Password is required");
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    dispatch(signUp(formData, navigate));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-slate-950 text-white px-4">
      <div className="bg-slate-900 p-10 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-800 mt-8 mb-8">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account ✨</h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* First + Last name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-400">First Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-400">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 focus:ring-2 focus:ring-blue-500"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block mb-1 text-gray-400">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 focus:ring-2 focus:ring-blue-500"
              placeholder="yourusername"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password(s) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Password */}
            <div>
              <label className="block mb-1 text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {formData.password.length > 0 && formData.password.length < 6 && (
                <p className="text-xs text-red-400 mt-1">Min 6 characters</p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block mb-1 text-gray-400">Confirm Password</label>
              <div className="relative">
                <input
                  type={showCPass ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full p-3 rounded-lg bg-slate-800 text-gray-100 focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowCPass(!showCPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showCPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold mt-4 transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
