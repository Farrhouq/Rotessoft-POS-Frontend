import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import apiClient from "../apiClient"; // Adjust to where your axios instance is
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toaster from "react-hot-toast";
import { BACKEND_URL } from "../consts";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  // const [password, setPasswoxrd] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email) {
      setError("Both email/phone and password are required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${BACKEND_URL}/otp/send/`, {
        username: email,
      });
      localStorage.setItem("username", email);

      // Assuming you get access token and refresh token in the response
      // console.log(response.data);
      // const { access, refresh } = response.data;

      // Store tokens in localStorage (or secure storage depending on the use case)
      navigate("/login/enter-code/");

      // Redirect or do other stuff here, e.g. redirect to dashboard
    } catch (error) {
      setError("Invalid email or phone");
      toaster.error("Invalid email or phone");
      console.error("Login error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-[95vw] md:w-[45vw]">
        <div className="flex justify-center mb-8">
          <div className="flex gap-4 items-center w-full justify-center">
            {/* logo */}
            <div className="flex gap-2">
              <div className="w-12 h-12 transform scale-[80%] bg-purple-500 rounded-full flex items-center justify-center">
                <svg
                  className="fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width={32}
                  height={32}
                >
                  <path d="M31.956 14.8C31.372 6.92 25.08.628 17.2.044V5.76a9.04 9.04 0 0 0 9.04 9.04h5.716ZM14.8 26.24v5.716C6.92 31.372.63 25.08.044 17.2H5.76a9.04 9.04 0 0 1 9.04 9.04Zm11.44-9.04h5.716c-.584 7.88-6.876 14.172-14.756 14.756V26.24a9.04 9.04 0 0 1 9.04-9.04ZM.044 14.8C.63 6.92 6.92.628 14.8.044V5.76a9.04 9.04 0 0 1-9.04 9.04H.044Z" />
                </svg>
              </div>
              <div className="flex text-xs font-extrabold flex-col justify-center">
                <span className="text-violet-500">Rotessoft</span>{" "}
                <span className="text-violet-500">
                  P<span className="mx-1.5">.</span>O
                  <span className="mx-1.5">.</span>S
                </span>
              </div>
            </div>

            {/* login text */}
            <h2 className="text-2xl font-bold text border-l pl-3 border-black text-gray-800">
              Login
            </h2>
          </div>
        </div>

        <form className="space-y-6" onSubmit={login}>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email or phone
            </label>
            <input
              id="email"
              name="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter email or phone number"
            />
          </div>
          {/* <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div> */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                Forgot your password?
              </a>
            </div>
          </div> */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
