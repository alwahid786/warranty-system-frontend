import { useState } from "react";

import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiEye,
  HiEnvelope,
  HiLockClosed,
  HiArrowRight
} from "react-icons/hi2";
import { HiEyeOff } from "react-icons/hi";

import { useLoginMutation } from "../../../redux/apis/authApis";
import { useForgetPasswordMutation } from "../../../redux/apis/authApis";
import { userExist } from "../../../redux/slices/authSlice";
import logoWithOutBg from "../../../assets/logos/logo-without-bg.png";
import logowithBg from "../../../assets/logos/logo-with-bg.png";

function AdminLogin() {
  const [forgotPassword, setForgotPassword] = useState(false);
  const resetPassword = false;
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: ""
  });

  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const [forgetPassword] = useForgetPasswordMutation();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData).unwrap();

      if (res?.success && res?.data?._id) {
        toast.success(res?.message || "Login successful");
        // clear any existing user and set the freshly-logged-in user
        dispatch(userExist(res?.data));

        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await forgetPassword(formData).unwrap();

      dispatch(userExist(res.data));
      if (res.success) {
        toast.success(res.message, { duration: 3000 });
        setForgotPassword(false);
      }
    } catch (err) {
      toast.error(err.data.message, { duration: 3000 });
    }
  };

  return (
    <section className="grid grid-cols-12 min-h-screen bg-[#F4F8FA] relative overflow-hidden">
      {/* Background subtle decoration shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/30 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/20 rounded-full filter blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Left Banner (desktop only) */}
      <div className="relative bg-gradient h-[100vh] col-span-5 hidden lg:block">
        <img
          className="h-full w-full object-cover"
          src="/Frame 2085666744.png"
          alt="Background"
        />
        <img
          src={logoWithOutBg}
          alt="Precision Warranty Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-auto"
        />
      </div>

      {/* Card Section */}
      <div className="col-span-12 lg:col-span-7 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        <div className="w-full max-w-[460px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 p-6 sm:p-10 flex flex-col gap-6">
          {/* Top Logo & Tagline */}
          <div className="flex flex-col items-center text-center">
            <img
              src={logowithBg}
              alt="Precision Warranty Logo"
              className="h-24 sm:h-28 w-auto object-contain mb-3"
            />
            <p className="text-[11px] sm:text-xs text-gray-400 font-medium tracking-wide">
              Secure Access &bull; Manage Warrantees &bull; Stay Ahead
            </p>
          </div>

          <hr className="border-gray-100 my-0" />

          {/* Header text */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#101421]">
              {forgotPassword
                ? "Forgot Password?"
                : resetPassword
                  ? "Reset Your Password"
                  : "Welcome to Precision Warranty"}
            </h2>
            <p className="text-xs sm:text-sm text-[#71717A]">
              {forgotPassword
                ? "No worries! Enter your email address and we will send you a link to reset your password."
                : resetPassword
                  ? "Create a new password for your account"
                  : "Sign in to your account to continue"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={forgotPassword ? handleReset : handleLogin}
            className="flex flex-col gap-5"
          >
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-semibold text-[#101421]">
                {resetPassword ? "New Password" : "Email Address"}
              </label>
              <div className="relative flex items-center">
                {!resetPassword && (
                  <HiEnvelope className="absolute left-3.5 text-gray-400 text-lg pointer-events-none" />
                )}
                {resetPassword && (
                  <HiLockClosed className="absolute left-3.5 text-gray-400 text-lg pointer-events-none" />
                )}
                <input
                  required
                  type={
                    resetPassword
                      ? showNewPassword
                        ? "text"
                        : "password"
                      : "email"
                  }
                  placeholder={
                    resetPassword
                      ? "Enter new password"
                      : "Enter your email address"
                  }
                  value={resetPassword ? formData.newPassword : formData.email}
                  onChange={(e) => {
                    resetPassword
                      ? setFormData({
                          ...formData,
                          newPassword: e.target.value
                        })
                      : setFormData({ ...formData, email: e.target.value });
                  }}
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0c6189] focus:ring-2 focus:ring-[#0c6189]/20 transition-all"
                />
                {resetPassword && (
                  <button
                    type="button"
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <HiEye size={18} />
                    ) : (
                      <HiEyeOff size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Confirm Password field (if resetPassword) */}
            {resetPassword && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#101421]">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <HiLockClosed className="absolute left-3.5 text-gray-400 text-lg pointer-events-none" />
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value
                      })
                    }
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0c6189] focus:ring-2 focus:ring-[#0c6189]/20 transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <HiEye size={18} />
                    ) : (
                      <HiEyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Password field (Normal Login) */}
            {!forgotPassword && !resetPassword && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#101421]">
                  Password
                </label>
                <div className="relative flex items-center">
                  <HiLockClosed className="absolute left-3.5 text-gray-400 text-lg pointer-events-none" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0c6189] focus:ring-2 focus:ring-[#0c6189]/20 transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <HiEye size={18} />
                    ) : (
                      <HiEyeOff size={18} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password link */}
            {!forgotPassword && !resetPassword && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs sm:text-sm font-semibold text-[#0c6189] hover:text-[#043655] hover:underline transition-colors"
                  onClick={() => {
                    setFormData({ ...formData, email: "" });
                    setForgotPassword(true);
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 mt-2 rounded-xl font-medium text-white bg-[#0c6189] hover:bg-[#073c5b] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>
                {forgotPassword
                  ? "Send Reset Link"
                  : resetPassword
                    ? "Reset Password"
                    : "Login"}
              </span>
              <HiArrowRight className="text-lg" />
            </button>
          </form>

          {/* Back to Login link */}
          {forgotPassword && (
            <div className="flex flex-col items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setForgotPassword(false)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0c6189] hover:text-[#043655] hover:underline transition-colors"
              >
                <HiArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;
