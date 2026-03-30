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
      {open && <button className="fixed inset-0 z-20 bg-slate-950/40 md:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 h-full w-72 border-r bg-card p-4 transition-transform md:static md:w-64 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center gap-2 px-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-display text-base font-semibold">Campus Hub</span>
        </div>
        <nav className="space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
