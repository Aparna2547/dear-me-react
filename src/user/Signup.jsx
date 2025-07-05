import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
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
      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
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


              {/* Submit Button */}
              <button
                type="submit"
                onClick={()=>{
navigate("/landing")

                }}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium text-lg hover:from-pink-600 hover:to-red-600"
              >
                {activeTab === "signup" ? "Create Account" : "Sign In"}
              </button>
            </form>

            {/* Toggle Tabs */}
            <div className="mt-8 text-center text-sm text-gray-600">
              {activeTab === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => {setActiveTab("login")}}
                    className="text-pink-600 hover:underline font-medium"
                    
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => setActiveTab("signup")}
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
    </div>
  );
};

export default SignUpForm;
