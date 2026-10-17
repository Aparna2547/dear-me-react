import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Heart, KeyRound, X, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../utils/fetchApi";
import { useAuth } from "../context/AuthContext";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [showResetPasswordEye, setShowResetPasswordEye] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      let res;
      if (activeTab === "signup") {
        res = await authApi.signup(data.fullName, data.email, data.password);
      } else {
        res = await authApi.login(data.email, data.password);
      }

      login(res.token); // saves token to localStorage + context
      navigate("/landing");
    } catch (err) {
      setServerError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setServerError("");
    reset();
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");

    if (!forgotEmail || !forgotNewPassword || !forgotConfirmPassword) {
      setForgotError("Please fill in all fields");
      return;
    }

    if (forgotNewPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authApi.resetPassword(forgotEmail, forgotNewPassword);
      setForgotSuccess(res.message || "Password reset successfully!");
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotEmail("");
        setForgotNewPassword("");
        setForgotConfirmPassword("");
        setForgotSuccess("");
      }, 2000);
    } catch (err) {
      setForgotError(err.message || "Failed to reset password");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-red-400 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>
      <div className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-white/5 rounded-full blur-xl"></div>

      {/* Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Branding */}
          <div className="lg:w-1/2 bg-gradient-to-br from-pink-500 to-red-500 p-8 lg:p-12 flex flex-col justify-center items-center text-white relative">
            <div className="absolute top-6 left-6 flex items-center space-x-2 mb-3">
              <Heart className="w-6 h-6 fill-white" />
              <span className="font-bold text-lg">Dear Me</span>
            </div>
            <div className="text-center mt-6">
              <h1 className="text-4xl lg:text-4xl font-bold mb-4">
                hey beautiful
                <br />
                <span className="text-3xl text-pink-200">This is for you</span>
              </h1>
              <p className="text-lg text-pink-100 mb-8">
                Track your routines, build healthy habits, and become the best version of yourself.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {activeTab === "signup" ? (
                <>
                  {/* Sign Up Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      {...register("fullName", { required: "Full name is required" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === watch("password") || "Passwords do not match",
                        })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Login Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      {...register("email", { required: "Email is required" })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotError("");
                          setForgotSuccess("");
                        }}
                        className="text-xs text-pink-600 hover:text-pink-800 hover:underline font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password", { required: "Password is required" })}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>
                </>
              )}

              {serverError && (
                <p className="text-red-500 text-sm text-center -mt-2">{serverError}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium text-lg hover:from-pink-600 hover:to-red-600 disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : activeTab === "signup"
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>

            {/* Toggle Tabs */}
            <div className="mt-8 text-center text-sm text-gray-600">
              {activeTab === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => switchTab("login")}
                    className="text-pink-600 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button
                    onClick={() => switchTab("signup")}
                    className="text-pink-600 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 relative animate-fadeIn">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                <KeyRound size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
                <p className="text-xs text-gray-500">Enter your email and create a new password</p>
              </div>
            </div>

            {forgotError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {forgotError}
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center space-x-2">
                <CheckCircle size={18} className="text-green-600 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPasswordEye ? "text" : "password"}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordEye(!showResetPasswordEye)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showResetPasswordEye ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showResetPasswordEye ? "text" : "password"}
                  value={forgotConfirmPassword}
                  onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="w-1/2 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-1/2 py-2.5 bg-gradient-to-r from-pink-500 to-red-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-red-600 transition disabled:opacity-60 text-sm"
                >
                  {forgotLoading ? "Resetting..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;