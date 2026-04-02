import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AdminPage from "../pages/AdminPage";
import NotificationsPage from "../pages/NotificationsPage";
import NotificationSettingsPage from "../pages/NotificationSettingsPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import OAuthSuccessPage from "../pages/OAuthSuccessPage";
import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/oauth-success", element: <OAuthSuccessPage /> },
  {
    path: "/dashboard",
    element: (
      <RoleProtectedRoute allowRoles={["USER"]}>
        <DashboardPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/notifications",
    element: (
      <RoleProtectedRoute allowRoles={["USER"]}>
        <NotificationsPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <RoleProtectedRoute allowRoles={["ADMIN"]}>
        <AdminPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/admin/notifications",
    element: (
      <RoleProtectedRoute allowRoles={["ADMIN"]}>
        <NotificationsPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/settings/notifications",
    element: (
      <RoleProtectedRoute allowRoles={["USER", "ADMIN"]}>
        <NotificationSettingsPage />
      </RoleProtectedRoute>
    )
  },
  { path: "*", element: <Navigate to="/dashboard" replace /> }
]);
