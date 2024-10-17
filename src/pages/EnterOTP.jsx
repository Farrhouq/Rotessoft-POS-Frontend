import React, { useState, useRef, useEffect } from "react";
import apiClient from "../apiClient";
import toaster from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkLogin } from "../utils/Utils";

export default function Component() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handlePaste = (e, index) => {
    e.preventDefault();
    if (index != 0) return;
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    if (inputRefs.current[5]) {
      inputRefs.current[5].focus();
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move focus to the previous input on backspace
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      console.log("Submitted OTP:", otpValue);
      // Here you would typically verify the OTP with your backend
      axios
        .post("http://localhost:8000/otp/verify/", {
          username: localStorage.getItem("username"),
          otp: otpValue,
        })
        .then((res) => {
          localStorage.setItem("accessToken", res.data.access);
          localStorage.setItem("refreshToken", res.data.refresh);
          localStorage.setItem("lastAccessToken", new Date().toISOString());
          localStorage.setItem("lastRefreshToken", new Date().toISOString());
          toaster.success(res.data.message);
          let userRole = checkLogin();
          if (userRole == "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        });
    } else {
      console.log("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter Verification Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a code to your phone. Please enter it below.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((data, index) => {
              return (
                <input
                  onPaste={(e) => handlePaste(e, index)}
                  className="w-12 h-12 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition"
                  type="text"
                  name="otp"
                  maxLength="1"
                  key={index}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  ref={(input) => (inputRefs.current[index] = input)}
                />
              );
            })}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Verify
            </button>
          </div>
        </form>
        <div className="text-center">
          <a
            href="#"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Didn't receive a code? Resend
          </a>
        </div>
      </div>
    </div>
  );
}
