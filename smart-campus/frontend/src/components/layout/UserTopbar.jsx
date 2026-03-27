import { LogOut, Search, UserCircle2 } from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";
import useAuth from "../../hooks/useAuth";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

export default function UserTopbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-6">
        <div className="hidden text-sm font-semibold text-muted-foreground md:block">Smart Campus Operations Hub</div>
        <div className="relative ml-auto hidden w-72 md:block">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search updates..." />
        </div>
        <Badge className="hidden md:inline-flex">Student</Badge>
        <NotificationBell />
        <div className="hidden items-center gap-2 rounded-lg bg-secondary px-3 py-2 md:flex">
          <UserCircle2 className="h-4 w-4" />
          <span className="text-sm">{user?.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
