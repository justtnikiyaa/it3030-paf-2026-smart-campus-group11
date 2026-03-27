import { Megaphone, ShieldCheck } from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";
import useAuth from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";

export default function AdminTopbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
        <div className="hidden text-sm font-semibold text-muted-foreground md:block">Smart Campus Operations Hub</div>
        <Badge variant="warning" className="ml-auto hidden md:inline-flex">Admin</Badge>
        <Link to="/admin/notifications">
          <Button size="sm" className="gap-2">
            <Megaphone className="h-4 w-4" />
            Send Alert
          </Button>
        </Link>
        <NotificationBell />
        <div className="hidden items-center gap-2 rounded-lg bg-secondary px-3 py-2 md:flex">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-sm">{user?.name}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}
