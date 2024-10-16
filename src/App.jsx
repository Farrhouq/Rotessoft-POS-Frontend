import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./css/main.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import SideBar from "./partials/Sidebar";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Header from "./partials/Header";
import AddSale from "./pages/AddSale";
import LoginPage from "./pages/LoginPage";
import AdminRegistration from "./pages/admin/AdminRegistration";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EnterOTP from "./pages/EnterOTP";
import Employee from "./pages/admin/Employee";

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <div className="flex h-screen overflow-hidden">
      <Toaster />
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Dashboard
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route exact path="/sales/" element={<Sales />} />
          <Route exact path="/products/" element={<Products />} />
          <Route exact path="/sales/add/" element={<AddSale />} />
          <Route exact path="/login/" element={<LoginPage />} />
          <Route exact path="/login/enter-code/" element={<EnterOTP />} />
          <Route exact path="/register/" element={<AdminRegistration />} />
          <Route exact path="/admin/" element={<AdminDashboard />} />
          <Route exact path="/admin/shop/staff/" element={<Employee />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
