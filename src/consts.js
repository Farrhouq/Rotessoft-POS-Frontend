export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_ENV === "local"
    ? "http://127.0.0.1:8000"
    : "https://rotessoft-pos-backend.vercel.app";
export const FRONTEND_URL = "http://localhost:3000";
