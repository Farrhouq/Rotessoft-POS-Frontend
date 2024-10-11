// ProtectedRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";

// A function to check if the user is authenticated
const isAuthenticated = () => {
  // Check if the token exists in localStorage (or wherever you're storing it)
  return !!localStorage.getItem("token"); // Adjust as per your token storage
};

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" /> // Redirect to login if not authenticated
        )
      }
    />
  );
};

export default ProtectedRoute;
