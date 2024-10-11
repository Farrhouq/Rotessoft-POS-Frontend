import axios from "axios";

const TOKEN_EXPIRATION = 60; // 15 minutes in milliseconds

// Create an axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh token function
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken"); // Get stored refresh token
    const response = await axios.post(
      "http://localhost:8000/account/api/token/refresh/",
      {
        refresh: refreshToken,
      },
    );
    const newAccessToken = response.data.access;
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("lastAccessToken", new Date().toISOString());
    return newAccessToken;
  } catch (error) {
    window.location.href = "/login";
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
      console.log(secondsPassed);
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
api.interceptors.response.use(
  (response) => {
    return response;
  },
  // async (error) => {
  //   const originalRequest = error.config;

  //   if (error.response.status === 401 && !originalRequest._retry) {
  //     originalRequest._retry = true; // Prevent infinite loops by checking this flag

  //     try {
  //       const newAccessToken = await refreshAccessToken(); // Get new access token
  //       originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // Update the request with the new token

  //       // Retry the original request with the new token
  //       return api(originalRequest);
  //     } catch (refreshError) {
  //       // If refreshing the token fails, handle logout or re-authentication
  //       console.error("Could not refresh token", refreshError);
  //       // Optionally, log out the user here if the refresh token is also invalid.
  //       return Promise.reject(refreshError);
  //     }
  //   }

  //   return Promise.reject(error); // If it's not a 401 or retry failed, reject the error
  // },
);

// Usage example for making requests
// const getData = async () => {
//   try {
//     const response = await api.get("/protected-resource");
//     console.log("Data:", response.data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// };

export default api;
