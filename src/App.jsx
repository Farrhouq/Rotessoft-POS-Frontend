import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./css/main.css";

import "./charts/ChartjsConfig";

// Import pages
import Dashboard from "./pages/Dashboard";
import SideBar from "./partials/Sidebar";
import Sales from "./pages/Sales";
import Products from "./pages/Products";

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
      </Routes>
    </div>
  );
}

export default App;
