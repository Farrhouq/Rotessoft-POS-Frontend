import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import ThemeProvider from "./utils/ThemeContext";
import App from "./App";

const isDevelopment = process.env.NODE_ENV === "development";

ReactDOM.createRoot(document.getElementById("root")).render(
  isDevelopment ? (
    <React.StrictMode>
      <Router>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </Router>
    </React.StrictMode>
  ) : (
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  ),
);
