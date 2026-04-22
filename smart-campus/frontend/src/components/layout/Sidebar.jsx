import { NavLink, useLocation } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { navByRole } from "../../data/nav";
import useAuth from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

export default function Sidebar({ open, onClose }) {
  const { role } = useAuth();
  const location = useLocation();
  const links = navByRole[role] || [];

  return (
    <>
      {open && <button className="fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm md:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full w-64 flex-col border-r border-slate-200/80 bg-white/85 p-3 backdrop-blur-xl transition-transform md:static md:w-[220px] md:translate-x-0 dark:border-cyan-300/15 dark:bg-[#0a1223]/90",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-5 flex items-center gap-2 px-1 pt-1.5">
          <div className="rounded-lg bg-blue-500/15 p-1.5 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
            <GraduationCap className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-[1rem] font-bold tracking-tight text-slate-900 dark:text-slate-100">SMART CAMPUS</span>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                end
                key={item.to + item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => {
                  const isResourcePath = item.to === "/resources" && location.pathname.includes("/resources");
                  const active = isActive || isResourcePath;
                  return cn(
                    "group flex items-center gap-2 rounded-xl px-2.5 py-2 text-[0.92rem] font-medium transition-all",
                    active
                      ? "border border-blue-300/70 bg-blue-50 text-blue-700 shadow-[0_6px_20px_-12px_rgba(37,99,235,0.6)] dark:border-cyan-300/55 dark:bg-blue-500/15 dark:text-blue-100 dark:shadow-[0_0_18px_rgba(37,99,235,0.35)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300/90 dark:hover:bg-white/5 dark:hover:text-slate-100"
                  )
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-200/80 pt-3 text-[11px] text-slate-500 dark:border-cyan-300/15 dark:text-slate-400">
          Role-aware navigation
        </div>
      </aside>
    </>
  );
}
