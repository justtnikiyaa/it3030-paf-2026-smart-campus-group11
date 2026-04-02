import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarCheck2, CalendarX2, Loader2, MessageSquare, Ticket, TriangleAlert } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { Button } from "../components/ui/button";
import notificationService from "../services/notificationService";

const typeMeta = {
  BOOKING_APPROVED: { icon: CalendarCheck2, color: "text-emerald-600 dark:text-emerald-300", label: "Booking Approved" },
  BOOKING_REJECTED: { icon: CalendarX2, color: "text-rose-600 dark:text-rose-300", label: "Booking Rejected" },
  TICKET_STATUS_CHANGED: { icon: Ticket, color: "text-indigo-600 dark:text-indigo-300", label: "Ticket Update" },
  NEW_COMMENT: { icon: MessageSquare, color: "text-sky-600 dark:text-sky-300", label: "New Comment" }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications]
  );

  const loadNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <AppLayout title="Notifications">
      <section className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.5)] backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90 dark:shadow-[0_16px_40px_-26px_rgba(3,105,161,0.35)] md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3 dark:border-cyan-300/15">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-3xl">
            Recent Notifications
          </h2>
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
            {loading ? "..." : `${notifications.length} total`}
          </span>
        </div>

        {!loading && !error && notifications.length > 0 && (
          <div className="mb-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-200">
            {unreadCount} unread
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-8 text-sm text-slate-600 dark:border-cyan-300/20 dark:bg-[#0f182d] dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading notifications...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-400/35 dark:bg-rose-500/10">
            <div className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 text-rose-600 dark:text-rose-300" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-200">Could not load notifications</p>
                <p className="mt-0.5 text-xs text-rose-700/90 dark:text-rose-200/90">{error}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={loadNotifications}>
                Retry
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center dark:border-cyan-300/25 dark:bg-[#0f182d]">
            <Bell className="mx-auto mb-2 h-5 w-5 text-slate-500 dark:text-slate-300" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">All caught up</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">No notifications right now.</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="space-y-2.5">
            {notifications.map((item) => {
              const meta = typeMeta[item.type] || { icon: Bell, color: "text-slate-600 dark:text-slate-300", label: "Notification" };
              const Icon = meta.icon;

              return (
                <article
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/85 p-3 transition hover:border-slate-300 dark:border-cyan-300/20 dark:bg-[#0f182d]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <div className="mt-0.5 rounded-lg bg-white p-1.5 shadow-sm dark:bg-[#15223a]">
                        <Icon className={`h-4 w-4 ${meta.color}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                          {item.unread && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                              Unread
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{meta.label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.message}</p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{item.time}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
