import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { notifications } from "../../data/notifications";
import { Button } from "../ui/button";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unread = useMemo(() => notifications.filter((n) => n.unread).length, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((v) => !v)}
        className="relative h-8 w-8 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-blue-500 px-1 py-0.5 text-[9px] font-semibold text-white">
            {unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-10 z-40 w-[320px] max-w-[92vw] rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl dark:border-cyan-300/25 dark:bg-[#0e162b] dark:shadow-[0_0_28px_rgba(56,189,248,0.2)]">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
            <button className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-cyan-300">
              <CheckCheck className="h-3 w-3" /> Mark all read
            </button>
          </div>
          <div className="max-h-64 space-y-1.5 overflow-auto pr-1">
            {notifications.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 hover:bg-slate-100 dark:border-cyan-300/20 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
                  {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400" />}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">{item.message}</p>
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{item.time}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
