import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute({ children, allowRoles }) {
  const { isAuthenticated, role, isAuthLoading } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return <div style={{ padding: "16px" }}>Checking login...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowRoles && !allowRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
