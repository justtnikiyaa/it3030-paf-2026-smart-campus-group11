import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function PublicRoute({ children }) {
  const { isAuthenticated, isAuthLoading, role } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-medium text-slate-600 shadow-sm dark:border-cyan-300/20 dark:bg-[#10192d]/90 dark:text-slate-300">
          Checking login...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={role === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }

  return children;
}
