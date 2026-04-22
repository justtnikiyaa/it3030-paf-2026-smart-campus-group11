import { GraduationCap } from "lucide-react";
import useAuth from "../hooks/useAuth";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f1c] text-white">
      {/* Performance-optimized Pure CSS Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/40 via-[#0a0f1c] to-[#0a0f1c]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-900/20 blur-[120px]" />
      <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[100px]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="px-5 pt-5 sm:px-8 sm:pt-7">
          <div className="inline-flex items-center gap-2.5 text-white/90">
            <div className="rounded-lg border border-white/20 bg-white/10 p-1.5 backdrop-blur">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-medium tracking-tight">Smart Campus Operations Hub</span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-[540px] rounded-[22px] border border-white/35 bg-white/[0.14] p-6 shadow-[0_24px_75px_-26px_rgba(7,12,28,0.9)] backdrop-blur-2xl sm:p-8">
            <h1 className="mx-auto max-w-[360px] text-center font-display text-[2.65rem] font-medium leading-tight tracking-tight text-white/95 sm:text-[3rem]">
              Welcome to the Command Center
            </h1>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="mt-7 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-sky-100/60 bg-white/92 px-4 text-[1.02rem] font-semibold text-slate-700 shadow-[0_12px_26px_-20px_rgba(96,165,250,0.95)] transition hover:bg-white"
            >
              <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2c-2 1.5-4.6 2.4-7.3 2.4-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.7 39.5 16.3 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.6-2.5 4.8-4.9 6.3l.1-.1 6.3 5.2C36.4 39.1 44 33 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </main>

        <footer className="px-5 pb-6 text-sm text-white/80 sm:px-8 sm:pb-7">
          Designed for universities, built for speed.
        </footer>
      </div>
    </div>
  );
}
