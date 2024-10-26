import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./css/main.css";

import "./charts/ChartjsConfig";

import { processQueue } from "./utils/requestQueue";

// Import pages
import Dashboard from "./pages/Dashboard";
import SideBar from "./partials/Sidebar";
import Sales from "./pages/Sales";
import Products from "./pages/Products";
import Header from "./partials/Header";
import AddSale from "./pages/AddSale";
import LoginPage from "./pages/LoginPage";
import DashboardOfDashboards from "./pages/admin/DashboardOfDashboards";
import MasterDashboard from "./pages/MasterDashboard";
import EnterOTP from "./pages/EnterOTP";
import Employee from "./pages/admin/Employee";
import EditProductForm from "./pages/admin/EditProduct";
import SaleDetail from "./pages/SaleDetail";

function App() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [AdminRegistration, setAdminRegistration] = useState(null);
  const [AdminAddStore, setAdminAddStore] = useState(null);

  useEffect(() => {
    const isDevelopment = import.meta.env.VITE_ENV === "development";
    if (isDevelopment) {
      import("./pages/admin/AdminRegistration").then((module) => {
        setAdminRegistration(() => module.default);
      });
      import("./pages/admin/AddStore").then((module) => {
        setAdminAddStore(() => module.default);
      });
    }
  });

  useEffect(() => {
    window.addEventListener("online", () => {
      processQueue();
    });

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
              <MasterDashboard
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
            }
          />
          <Route exact path="/sales/" element={<Sales />} />
          <Route exact path="/sale-detail/" element={<SaleDetail />} />
          <Route exact path="/products/" element={<Products />} />
          <Route exact path="/sales/add/" element={<AddSale />} />
          <Route exact path="/login/" element={<LoginPage />} />
          <Route exact path="/login/enter-code/" element={<EnterOTP />} />
          {AdminRegistration && (
            <>
              <Route exact path="/register/" element={<AdminRegistration />} />
              <Route exact path="/add-store/" element={<AdminAddStore />} />
            </>
          )}
          <Route exact path="/admin/" element={<DashboardOfDashboards />} />
          <Route exact path="/admin/shop/staff/" element={<Employee />} />
          <Route
            exact
            path="/admin/shop/edit-product/"
            element={<EditProductForm />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
