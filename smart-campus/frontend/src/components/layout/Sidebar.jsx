import { NavLink } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { navByRole } from "../../data/nav";
import useAuth from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

export default function Sidebar({ open, onClose }) {
  const { role } = useAuth();
  const links = navByRole[role] || [];

  return (
    <>
      {open && <button className="fixed inset-0 z-20 bg-slate-950/60 md:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 flex h-full w-72 flex-col border-r border-slate-200 bg-white p-3 transition-transform md:static md:w-[228px] md:translate-x-0 dark:border-cyan-300/15 dark:bg-[#0b1324]",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-5 flex items-center gap-2 px-1.5 pt-2">
          <div className="rounded-lg bg-blue-500/20 p-1.5 text-blue-500 dark:text-blue-400">
            <GraduationCap className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-slate-900 dark:text-slate-100">SMART CAMPUS</span>
        </div>

        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "border border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/60 dark:bg-blue-500/15 dark:text-blue-200 dark:shadow-[0_0_18px_rgba(37,99,235,0.3)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300/85 dark:hover:bg-white/5 dark:hover:text-slate-100"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-4 text-[11px] text-slate-500 dark:border-cyan-300/15 dark:text-slate-400">Role-aware navigation</div>
      </aside>
    </>
  );
}
