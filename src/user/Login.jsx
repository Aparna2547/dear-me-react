import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 md:px-10 lg:px-20 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-[#ffe5e5] rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side (only visible on desktop) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-red-100 p-8">
          <h2 className="text-4xl font-bold text-red-500">Dear Me</h2>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          <h3 className="text-2xl font-semibold text-red-600 mb-6 text-center md:text-left">Welcome Back</h3>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-red-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
            >
              Login
            </button>
          </form>

          <a className="text-sm text-center text-red-600 mt-6" href="/signup">
            Don't have an account?{" "}
            <span className="underline cursor-pointer hover:text-red-800">
              Sign Up
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
