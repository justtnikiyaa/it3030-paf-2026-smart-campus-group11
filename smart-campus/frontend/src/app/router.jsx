import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AdminPage from "../pages/AdminPage";
import NotificationsPage from "../pages/NotificationsPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import OAuthSuccessPage from "../pages/OAuthSuccessPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/oauth-success", element: <OAuthSuccessPage /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowRoles={["ADMIN"]}>
        <AdminPage />
      </ProtectedRoute>
    )
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> }
]);
