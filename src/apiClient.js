import axios from "axios";
import { BACKEND_URL } from "./consts";

const TOKEN_EXPIRATION = 1800; // Access token expiration time in seconds

// Create an axios instance
const api = axios.create({
  baseURL: `${BACKEND_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh token function
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken"); // Get stored refresh token
    const response = await axios.post(
      `${BACKEND_URL}/account/api/token/refresh/`,
      {
        refresh: refreshToken,
      },
    );
    const newAccessToken = response.data.access;
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("lastAccessToken", new Date().toISOString());
    return newAccessToken;
  } catch (error) {
    // window.location.href = "/login";
  }
};

// Axios request interceptor to include the access token in requests
api.interceptors.request.use(
  async (config) => {
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const lastAccessToken = localStorage.getItem("lastAccessToken");
      const timeDifference = new Date() - new Date(lastAccessToken);
      const secondsPassed = Math.floor(timeDifference / 1000);
      if (secondsPassed > TOKEN_EXPIRATION) {
        // If the access token has expired, refresh it
        accessToken = await refreshAccessToken();
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    }
    // else just send them to the login page
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Axios response interceptor to catch 401 (Unauthorized) errors
api.interceptors.response.use((response) => {
  return response;
});

export default api;
