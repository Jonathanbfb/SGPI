import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthenticatedUser } from "./auth";

const PrivateRoute = ({ allowedRoles }) => {
  const user = getAuthenticatedUser();

  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default PrivateRoute;
