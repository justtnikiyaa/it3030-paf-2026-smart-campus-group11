import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import AdminPage from "../pages/AdminPage";
import NotificationsPage from "../pages/NotificationsPage";
import NotificationSettingsPage from "../pages/NotificationSettingsPage";
import BookingsPage from "../pages/BookingsPage";
import AdminBookingsPage from "../pages/AdminBookingsPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import OAuthSuccessPage from "../pages/OAuthSuccessPage";
import TicketsPage from "../pages/TicketsPage";
import CreateTicketPage from "../pages/CreateTicketPage";
import TicketDetailPage from "../pages/TicketDetailPage";
import TechnicianDashboardPage from "../pages/TechnicianDashboardPage";
import RoleProtectedRoute from "../components/auth/RoleProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import HomeRedirect from "../components/auth/HomeRedirect";

// Resource Pages
import ResourcesPage from "../pages/resources/ResourcesPage";
import ResourceDetailPage from "../pages/resources/ResourceDetailPage";
import ResourceCreatePage from "../pages/resources/ResourceCreatePage";
import ResourceEditPage from "../pages/resources/ResourceEditPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    )
  },
  { path: "/unauthorized", element: <UnauthorizedPage /> },
  { path: "/oauth-success", element: <OAuthSuccessPage /> },

  // ── USER routes ───────────────────────────────────────────────────────────
  {
    path: "/dashboard",
    element: (
      <RoleProtectedRoute allowRoles={["USER"]}>
        <DashboardPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/bookings",
    element: (
      <RoleProtectedRoute allowRoles={["USER"]}>
        <BookingsPage />
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

  // ── Module C: Ticket routes (USER + ADMIN + TECHNICIAN) ───────────────────
  {
    path: "/tickets",
    element: (
      <RoleProtectedRoute allowRoles={["USER", "ADMIN", "TECHNICIAN"]}>
        <TicketsPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/tickets/new",
    element: (
      <RoleProtectedRoute allowRoles={["USER", "ADMIN"]}>
        <CreateTicketPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/tickets/:id",
    element: (
      <RoleProtectedRoute allowRoles={["USER", "ADMIN", "TECHNICIAN"]}>
        <TicketDetailPage />
      </RoleProtectedRoute>
    )
  },

  // ── Module C: Technician Dashboard ────────────────────────────────────────
  {
    path: "/technician",
    element: (
      <RoleProtectedRoute allowRoles={["TECHNICIAN", "ADMIN"]}>
        <TechnicianDashboardPage />
      </RoleProtectedRoute>
    )
  },

  // ── ADMIN routes ──────────────────────────────────────────────────────────
  {
    path: "/admin",
    element: (
      <RoleProtectedRoute allowRoles={["ADMIN"]}>
        <AdminPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/admin/bookings",
    element: (
      <RoleProtectedRoute allowRoles={["ADMIN"]}>
        <AdminBookingsPage />
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

  // Resource Routes (Module A)
  {
    path: "/resources",
    element: (
      <RoleProtectedRoute allowRoles={["USER", "ADMIN"]}>
        <ResourcesPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/resources/:id",
    element: (
      <RoleProtectedRoute allowRoles={["USER", "ADMIN"]}>
        <ResourceDetailPage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/admin/resources/new",
    element: (
      <RoleProtectedRoute allowRoles={["ADMIN"]}>
        <ResourceCreatePage />
      </RoleProtectedRoute>
    )
  },
  {
    path: "/admin/resources/:id/edit",
    element: (
      <RoleProtectedRoute allowRoles={["ADMIN"]}>
        <ResourceEditPage />
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

  { path: "*", element: <HomeRedirect /> }
]);
