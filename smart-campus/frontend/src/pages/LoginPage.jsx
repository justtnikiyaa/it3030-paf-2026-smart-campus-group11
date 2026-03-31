import { GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const { loginAs, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const loginAndGo = (role) => {
    loginAs(role);
    navigate(role === "ADMIN" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-2 backdrop-blur">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-display text-lg font-semibold tracking-wide">Smart Campus Operations Hub</span>
          </div>

          <div className="relative z-10 max-w-md">
            <h1 className="font-display text-4xl font-bold leading-tight">Welcome back to your campus command center.</h1>
            <p className="mt-4 text-sm text-blue-100">
              Manage operations, notifications, and role-based workflows from one modern dashboard.
            </p>

            <div className="mt-8 grid gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Secure role-based access
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Smart notifications and alerts
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-blue-100/90">Designed for universities, built for speed.</div>
        </section>

        <section className="flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Smart Campus</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">Sign in</h2>
              <p className="mt-1 text-sm text-slate-600">Continue with your university Google account.</p>
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.7 39.5 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.6-2.5 4.8-4.9 6.3l.1-.1 6.3 5.2C36.4 39.1 44 33 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              Continue with Google
            </button>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button variant="secondary" onClick={() => loginAndGo("USER")}>Demo User</Button>
              <Button variant="outline" onClick={() => loginAndGo("ADMIN")}>Demo Admin</Button>
            </div>

            <p className="mt-5 text-center text-xs text-slate-500">By continuing, you agree to campus access policies.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
