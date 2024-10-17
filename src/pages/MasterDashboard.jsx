import React from "react";
import Dashboard from "./Dashboard"; // staff dashboard
import AdminDashboard from "./AdminDashboard"; // admin dashboard
import { checkLogin } from "../utils/Utils";

export default function MasterDashboard({ sidebarOpen, setSidebarOpen }) {
  const userRole = checkLogin();

  return userRole === "admin" ? (
    <AdminDashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  ) : (
    <Dashboard sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
  );
}
