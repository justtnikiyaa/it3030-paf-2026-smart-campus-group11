import { NavLink } from "react-router-dom";
import { roleNavConfig } from "../../data/mock";
import useAuth from "../../hooks/useAuth";
import { cn } from "../../lib/utils";

export default function RoleBasedNav() {
  const { role } = useAuth();
  const links = roleNavConfig[role] || [];

  return (
    <nav className="flex flex-wrap items-center gap-2 md:flex-col md:items-stretch">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
