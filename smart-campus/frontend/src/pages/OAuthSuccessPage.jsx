import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function OAuthSuccessPage() {
  const navigate = useNavigate();
  const { finalizeOAuthLogin } = useAuth();
  const [statusText, setStatusText] = useState("Finishing Google sign in...");

  useEffect(() => {
    let active = true;
    const failSafeTimeout = window.setTimeout(() => {
      if (!active) return;
      setStatusText("Sign in is taking longer than expected. Returning to login...");
      navigate("/login", { replace: true });
    }, 12000);

    async function finishLogin() {
      try {
        const currentUser = await finalizeOAuthLogin();
        if (!active) return;

        if (!currentUser) {
          navigate("/login", { replace: true });
          return;
        }

        navigate(currentUser.role === "ADMIN" ? "/admin" : "/dashboard", { replace: true });
      } catch {
        if (active) navigate("/login", { replace: true });
      } finally {
        window.clearTimeout(failSafeTimeout);
      }
    }

    finishLogin();
    return () => {
      active = false;
      window.clearTimeout(failSafeTimeout);
    };
  }, [finalizeOAuthLogin, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-medium text-slate-600 shadow-sm dark:border-cyan-300/20 dark:bg-[#10192d]/90 dark:text-slate-300">
        {statusText}
      </div>
    </div>
  );
}
