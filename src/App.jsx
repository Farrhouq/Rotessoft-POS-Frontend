import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
          <Route exact path="/sales" element={<Sales />} />
          <Route exact path="/products" element={<Products />} />
          <Route exact path="/sales/add/" element={<AddSale />} />
          <Route exact path="/login/" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
