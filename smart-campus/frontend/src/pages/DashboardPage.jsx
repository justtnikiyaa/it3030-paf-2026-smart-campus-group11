import { useState, useEffect } from "react";
import {
  AlertTriangle,
  BellDot,
  Box,
  CalendarCheck2,
  CircleAlert,
  CircleCheck,
  Info,
  Ticket,
  Loader2
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import notificationService from "../services/notificationService";
import { bookingService } from "../services/bookingService";
import ticketService from "../services/ticketService";

function MetricCard({ title, value, icon: Icon, center, loading }) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_14px_36px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-cyan-300/30 dark:bg-[#111b31]/90 dark:shadow-[0_0_16px_rgba(6,182,212,0.18)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(45,212,191,0.08),rgba(8,15,30,0)_60%)] dark:bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.12),rgba(8,15,30,0)_62%)]" />

      <div className="relative flex items-center justify-between">
        <h3 className="text-[1.1rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100">{title}</h3>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>

      <div className="relative mt-6 flex items-center justify-center">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        ) : center || (
          <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
        )}
      </div>
    </article>
  );
}

function DeliveryRing({ percentage }) {
  const pct = Math.min(100, Math.max(0, percentage));
  const gradientStop = `${pct}%`;
  return (
    <div className="relative flex h-28 w-28 items-center justify-center rounded-full md:h-32 md:w-32">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 90deg, rgba(56,189,248,0.95) 0%, rgba(37,99,235,0.98) ${gradientStop}, rgba(30,41,59,0.22) ${gradientStop})`
        }}
      />
      <div className="absolute inset-3 rounded-full bg-white shadow-inner dark:bg-[#10192d] dark:shadow-cyan-400/20" />
      <span className="relative text-[1.6rem] font-bold tracking-tight text-slate-900 dark:text-slate-100">{pct.toFixed(1)}%</span>
    </div>
  );
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h ago`;
  return date.toLocaleDateString();
}

function getBadge(type) {
  switch (type) {
    case "CAMPUS_ALERT":
      return { text: "Alert", cls: "bg-red-500/20 text-red-700 dark:text-red-200" };
    case "BOOKING_APPROVED":
      return { text: "Approved", cls: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-200" };
    case "BOOKING_REJECTED":
      return { text: "Rejected", cls: "bg-amber-500/20 text-amber-700 dark:text-amber-200" };
    case "TICKET_STATUS_CHANGED":
      return { text: "Ticket", cls: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-200" };
    case "NEW_COMMENT":
      return { text: "Comment", cls: "bg-blue-500/15 text-blue-700 dark:text-blue-200" };
    default:
      return { text: "Info", cls: "bg-blue-500/15 text-blue-700 dark:text-blue-200" };
  }
}

export default function DashboardPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [notifs, unread, bk, tk] = await Promise.allSettled([
          notificationService.getMyNotifications(),
          notificationService.getUnreadCount(),
          bookingService.getMyBookings(),
          ticketService.getMyTickets()
        ]);

        if (notifs.status === "fulfilled") setNotifications(notifs.value);
        if (unread.status === "fulfilled") setUnreadCount(unread.value.count ?? unread.value);
        if (bk.status === "fulfilled") setBookings(bk.value);
        if (tk.status === "fulfilled") setTickets(tk.value);
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Compute real metrics
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayNotifs = notifications.filter(n => n.createdAt && n.createdAt.startsWith(todayStr));
  const todayAlerts = todayNotifs.length;

  const totalNotifs = notifications.length;
  const readNotifs = notifications.filter(n => !n.unread).length;
  const deliveryRate = totalNotifs > 0 ? (readNotifs / totalNotifs) * 100 : 100;

  // Recent notifications for the "Urgent Notifications" section
  const recentNotifs = [...notifications].slice(0, 5);

  // Active bookings & tickets for the activity section
  const activeBookings = bookings.filter(b => b.status === "PENDING" || b.status === "APPROVED").length;
  const openTickets = tickets.filter(t => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
  const resolvedTickets = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-3.5">
        <section className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <MetricCard title="Today's Notifications" value={todayAlerts} icon={AlertTriangle} loading={loading} />
          <MetricCard title="Unread Notices" value={unreadCount} icon={BellDot} loading={loading} />
          <MetricCard title="Read Rate" icon={Box} loading={loading} center={!loading ? <DeliveryRing percentage={deliveryRate} /> : undefined} />
        </section>

        <section className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {/* Recent Notifications */}
          <article className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_14px_36px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90 dark:shadow-[0_14px_36px_-24px_rgba(3,105,161,0.3)]">
            <h2 className="mb-3 font-display text-[1.65rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100">Recent Notifications</h2>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : recentNotifs.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">No notifications yet. You'll see updates here.</p>
            ) : (
              <div className="space-y-2.5">
                {recentNotifs.map((item) => {
                  const badge = getBadge(item.type);
                  return (
                    <div key={item.id} className="border-b border-slate-200/80 pb-2.5 last:border-b-0 last:pb-0 dark:border-cyan-300/12">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <h3 className="text-[1.05rem] font-medium leading-tight tracking-tight text-slate-900 dark:text-white">{item.title}</h3>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${badge.cls}`}>
                          {badge.text}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{timeAgo(item.createdAt)}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          {/* Live Stats */}
          <article className="rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_14px_36px_-26px_rgba(15,23,42,0.45)] backdrop-blur-sm dark:border-cyan-300/20 dark:bg-[#111a2d]/90 dark:shadow-[0_14px_36px_-24px_rgba(3,105,161,0.3)]">
            <h2 className="mb-4 font-display text-[1.65rem] font-semibold tracking-tight text-slate-900 dark:text-slate-100">My Activity Summary</h2>

            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Bookings summary */}
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/85 p-4 dark:border-cyan-300/15 dark:bg-[#0d1628]">
                  <div className="mb-2 flex items-center gap-2">
                    <CalendarCheck2 className="h-5 w-5 text-blue-500" />
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Bookings</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{bookings.length}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Total</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeBookings}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Active</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{bookings.filter(b => b.status === "APPROVED").length}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Approved</p>
                    </div>
                  </div>
                </div>

                {/* Tickets summary */}
                <div className="rounded-lg border border-slate-200/80 bg-slate-50/85 p-4 dark:border-cyan-300/15 dark:bg-[#0d1628]">
                  <div className="mb-2 flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Tickets</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{tickets.length}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Total</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{openTickets}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Open</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{resolvedTickets}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Resolved</p>
                    </div>
                  </div>
                </div>

                {/* Quick stats row */}
                <div className="flex flex-wrap gap-2.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1.5">
                    <CircleCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" />
                    {readNotifs} notifications read
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CircleAlert className="h-3.5 w-3.5 text-orange-500 dark:text-orange-300" />
                    {unreadCount} unread
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-blue-500 dark:text-blue-300" />
                    {todayAlerts} today
                  </span>
                </div>
              </div>
            )}
          </article>
        </section>
      </div>
    </AppLayout>
  );
}
