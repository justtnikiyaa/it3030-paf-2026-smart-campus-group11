import {
  Bell,
  CalendarCheck2,
  CalendarX2,
  CircleCheckBig,
  CircleX,
  Inbox,
  Loader2,
  MessageSquare,
  Ticket,
  Trash2,
  TriangleAlert
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const typeMeta = {
  BOOKING_APPROVED: {
    label: "Booking Approved",
    icon: CalendarCheck2,
    iconClass: "text-emerald-600 dark:text-emerald-300"
  },
  BOOKING_REJECTED: {
    label: "Booking Rejected",
    icon: CalendarX2,
    iconClass: "text-rose-600 dark:text-rose-300"
  },
  TICKET_STATUS_CHANGED: {
    label: "Ticket Updated",
    icon: Ticket,
    iconClass: "text-indigo-600 dark:text-indigo-300"
  },
  NEW_COMMENT: {
    label: "New Comment",
    icon: MessageSquare,
    iconClass: "text-sky-600 dark:text-sky-300"
  }
};

function LoadingState() {
  return (
    <div className="space-y-2 py-2">
      {[1, 2, 3].map((item) => (
        <div key={item} className="animate-pulse rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-cyan-300/20 dark:bg-white/[0.03]">
          <div className="mb-2 h-3.5 w-2/5 rounded bg-slate-200 dark:bg-slate-700/50" />
          <div className="h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-700/40" />
        </div>
      ))}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Loading notifications...
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-9 text-center dark:border-cyan-300/25 dark:bg-white/[0.03]">
      <div className="mb-2 rounded-full bg-slate-200 p-2 dark:bg-slate-800/70">
        <Inbox className="h-5 w-5 text-slate-500 dark:text-slate-300" />
      </div>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">All caught up</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No notifications right now.</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-400/35 dark:bg-rose-400/10">
      <div className="flex items-start gap-2">
        <TriangleAlert className="mt-0.5 h-4 w-4 text-rose-600 dark:text-rose-300" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-rose-700 dark:text-rose-200">Could not load notifications</p>
          <p className="mt-0.5 text-xs text-rose-700/90 dark:text-rose-200/90">{message}</p>
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={onRetry}>
          Retry
        </Button>
      </div>
    </div>
  );
}

function SuccessState({ message }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-xs font-medium text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/10 dark:text-emerald-300">
      {message}
    </div>
  );
}

export default function NotificationPanel({
  open,
  loading,
  error,
  success,
  notifications,
  unreadCount,
  onClose,
  onRetry,
  onMarkAllRead,
  onMarkRead,
  onDelete
}) {
  if (!open) return null;

  return (
    <div className="fixed left-3 right-3 top-[72px] z-50 rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-2xl backdrop-blur-xl dark:border-cyan-300/25 dark:bg-[#0e162b]/95 dark:shadow-[0_0_28px_rgba(56,189,248,0.2)] md:absolute md:left-auto md:right-0 md:top-11 md:w-[400px]">
      <div className="mb-2 flex items-center justify-between gap-3 border-b border-slate-200/70 pb-2 dark:border-cyan-300/15">
        <div className="flex min-w-0 items-center gap-2">
          <Bell className="h-4 w-4 text-blue-600 dark:text-cyan-300" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-500/25 dark:text-blue-200">
            {unreadCount} unread
          </span>
        </div>
        <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={onClose}>
          Close
        </Button>
      </div>

      {success && <SuccessState message={success} />}

      <div className="mb-2 mt-2 flex justify-end">
        <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={onMarkAllRead} disabled={loading || notifications.length === 0}>
          <CircleCheckBig className="mr-1 h-3.5 w-3.5" />
          Mark all read
        </Button>
      </div>

      <div className="max-h-80 space-y-2 overflow-auto pr-1">
        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} onRetry={onRetry} />}

        {!loading && !error && notifications.length === 0 && <EmptyState />}

        {!loading &&
          !error &&
          notifications.map((item) => {
            const meta = typeMeta[item.type] || {
              label: "Notification",
              icon: Bell,
              iconClass: "text-slate-600 dark:text-slate-200"
            };
            const TypeIcon = meta.icon;

            return (
              <article
                key={item.id}
                className={cn(
                  "rounded-xl border p-3 transition",
                  item.unread
                    ? "border-blue-300/80 bg-blue-50/75 dark:border-cyan-300/35 dark:bg-cyan-400/10"
                    : "border-slate-200 bg-slate-50 dark:border-cyan-300/20 dark:bg-white/[0.03]"
                )}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TypeIcon className={cn("h-4 w-4", meta.iconClass)} />
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{meta.label}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{item.time}</span>
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{item.message}</p>

                <div className="mt-2.5 flex items-center justify-end gap-1.5">
                  {item.unread && (
                    <Button size="sm" variant="secondary" className="h-7 px-2.5 text-[11px]" onClick={() => onMarkRead(item.id)}>
                      Mark read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2.5 text-[11px] text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-300 dark:hover:bg-rose-500/10"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </article>
            );
          })}
      </div>

      {!loading && !error && notifications.length > 0 && unreadCount === 0 && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-1.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CircleCheckBig className="h-3.5 w-3.5" />
          All notifications are read
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <CircleX className="h-3.5 w-3.5" />
          No notifications to manage
        </div>
      )}
    </div>
  );
}
