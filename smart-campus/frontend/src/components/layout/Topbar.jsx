import { Menu, Bell, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import useAuth from "../../hooks/useAuth";

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>
      <h1 className="font-display text-lg font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="secondary" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden rounded-lg bg-secondary px-3 py-2 text-sm md:block">{user?.name}</div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
