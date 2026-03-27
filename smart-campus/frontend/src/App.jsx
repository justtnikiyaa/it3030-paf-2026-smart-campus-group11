import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import AuthGuard from "./components/auth/AuthGuard";
import RoleGuard from "./components/auth/RoleGuard";
import SessionExpiredModal from "./components/auth/SessionExpiredModal";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotificationCenterPage from "./pages/NotificationCenterPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminNotificationPage from "./pages/AdminNotificationPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AppShell from "./components/layout/AppShell";
import UserTopbar from "./components/layout/UserTopbar";
import AdminTopbar from "./components/layout/AdminTopbar";

function RoleAwareShell({ children }) {
  const { role } = useAuth();
  const topbar = role === "ADMIN" ? <AdminTopbar /> : <UserTopbar />;
  return <AppShell topbar={topbar}>{children}</AppShell>;
}

function ProtectedPage({ children }) {
  return (
    <AuthGuard>
      <RoleAwareShell>{children}</RoleAwareShell>
    </AuthGuard>
  );
}

export default function App() {
  const { isSessionExpired, loginWithRole } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/dashboard" element={<ProtectedPage><StudentDashboardPage /></ProtectedPage>} />
        <Route path="/notifications" element={<ProtectedPage><NotificationCenterPage /></ProtectedPage>} />
        <Route path="/profile" element={<ProtectedPage><UserProfilePage /></ProtectedPage>} />

        <Route
          path="/admin"
          element={
            <ProtectedPage>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminDashboardPage />
              </RoleGuard>
            </ProtectedPage>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedPage>
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminNotificationPage />
              </RoleGuard>
            </ProtectedPage>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <SessionExpiredModal open={isSessionExpired} onRelogin={() => loginWithRole("STUDENT")} />
    </>
  );
}
