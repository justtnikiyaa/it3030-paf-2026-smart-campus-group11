import { UserCircle2, ChevronDown } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function ProfileArea() {
  const { user, role } = useAuth();

  return (
    <div className="hidden items-center gap-1.5 md:flex">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-600 dark:border-cyan-300/30 dark:bg-[#10203c] dark:text-slate-200">
        <UserCircle2 className="h-4.5 w-4.5" />
      </div>
      <div className="leading-tight">
        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{user?.name || "Student User"}</p>
        <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-500/25 dark:text-blue-200">
          {role || "STUDENT"}
        </span>
      </div>
      <ChevronDown className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
    </div>
  );
}
