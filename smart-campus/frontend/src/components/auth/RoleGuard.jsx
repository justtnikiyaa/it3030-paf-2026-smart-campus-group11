import React from "react";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ hasAccess, children }) {
  if (!hasAccess) return <Navigate to="/unauthorized" replace />;
  return children;
}
