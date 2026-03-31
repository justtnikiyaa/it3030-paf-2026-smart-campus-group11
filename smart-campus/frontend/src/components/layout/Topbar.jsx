import { Menu, Search, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import NotificationBell from "./NotificationBell";
import ProfileArea from "./ProfileArea";

export default function Topbar({ onMenuClick, title }) {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-cyan-400/20 dark:bg-[#0d1529]/95">
      <div className="flex h-14 items-center gap-2 px-3 md:px-4">
        <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10 md:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>

        <h1 className="font-display text-lg font-semibold text-slate-900 md:text-2xl dark:text-slate-100">{title}</h1>

        <div className="relative ml-auto hidden w-full max-w-[250px] lg:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            className="h-9 rounded-full border-slate-300 bg-slate-50 pl-9 text-xs text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-400 dark:border-cyan-300/20 dark:bg-[#0f1a31] dark:text-slate-100"
            placeholder="Search"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <NotificationBell />
        <ProfileArea />
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10" onClick={logout}>
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  );
}
