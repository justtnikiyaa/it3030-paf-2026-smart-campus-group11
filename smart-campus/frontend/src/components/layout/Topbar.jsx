import { Menu, Search, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import NotificationBell from "./NotificationBell";
import ProfileArea from "./ProfileArea";

export default function Topbar({ onMenuClick, title, titleIcon: TitleIcon }) {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/85 bg-white/85 backdrop-blur-xl dark:border-cyan-400/15 dark:bg-[#0b1326]/85">
      <div className="mx-auto flex h-[58px] w-full max-w-[1120px] items-center gap-2.5 px-3 md:gap-3 md:px-5">
        <div className="flex min-w-0 items-center gap-1.5 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-700 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10 md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <h1 className="truncate font-display text-[1.3rem] font-semibold tracking-tight text-slate-900 dark:text-blue-50 md:text-[1.55rem] flex items-center gap-2.5 transition-all dark:drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]">
            {TitleIcon && <TitleIcon className="w-5 h-5 text-blue-600 dark:text-cyan-400" />}
            {title}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <div className="relative hidden w-full min-w-[250px] max-w-[320px] xl:block">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              className="h-8 rounded-full border-slate-300/80 bg-slate-50/85 pl-9 text-xs shadow-none placeholder:text-slate-400 dark:border-cyan-300/20 dark:bg-[#111c33]"
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
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>

          <NotificationBell />

          <div className="hidden md:block">
            <ProfileArea />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            onClick={logout}
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

