import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function OAuthSuccessPage() {
  const navigate = useNavigate();
  const { finalizeOAuthLogin } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    async function finishLogin() {
      try {
        const currentUser = await finalizeOAuthLogin();
        if (!currentUser) {
          navigate("/login", { replace: true });
          return;
        }
        // Navigate based on role
        if (currentUser.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else if (currentUser.role === "TECHNICIAN") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      } catch {
        navigate("/login", { replace: true });
      }
    }

    finishLogin();
  }, []); // empty deps — run exactly once

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0f1c] px-4">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-cyan-400" />
        </div>
        <p className="text-sm font-medium text-slate-300">
          Signing you in&hellip;
        </p>
      </div>
    </div>
  );
}
