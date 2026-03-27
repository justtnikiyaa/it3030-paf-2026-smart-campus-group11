import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RoleGuard({ allowedRoles, children }) {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
