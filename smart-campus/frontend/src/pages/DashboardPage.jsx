import {
  AlertTriangle,
  BellDot,
  Box,
  CircleAlert,
  CircleCheck,
  Info
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";

const urgentItems = [
  {
    title: "Maintenance in Building A",
    time: "13:57 AM",
    detail: "Maintenance in Building A, to ensure smooth operations throughout the day.",
    badge: "Critical",
    badgeClass: "bg-red-500/25 text-red-700 dark:text-red-200"
  },
  {
    title: "Library Hours Extended",
    time: "11:99 AM",
    detail: "Library hours extended for all floors during exam week operations.",
    badge: "Important",
    badgeClass: "bg-amber-500/25 text-amber-700 dark:text-amber-200"
  },
  {
    title: "Campus WiFi Update",
    time: "11:39 AM",
    detail: "The campus WiFi update is now rolling out to all major zones.",
    badge: "Info",
    badgeClass: "bg-blue-500/20 text-blue-700 dark:text-blue-200"
  }
];

const trendPathA = "M 0 140 C 70 95, 130 180, 200 115 C 250 70, 310 95, 380 48 C 450 10, 520 85, 600 150";
const trendPathB = "M 0 150 C 85 55, 165 180, 245 95 C 300 52, 360 95, 430 118 C 510 146, 560 92, 600 72";
const trendPathC = "M 0 155 C 75 125, 140 115, 210 162 C 265 198, 340 88, 410 88 C 470 88, 545 138, 600 186";

function MetricCard({ title, value, icon: Icon, center }) {
  return (
    <article className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-cyan-300/65 dark:bg-[#0f182d] dark:shadow-[0_0_16px_rgba(6,182,212,0.24)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(45,212,191,0.06),rgba(8,15,30,0)_60%)] dark:bg-[radial-gradient(circle_at_50%_45%,rgba(45,212,191,0.13),rgba(8,15,30,0)_60%)]" />
      <div className="relative flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="relative mt-6 flex items-center justify-center">{center || <p className="text-5xl font-bold text-slate-900 dark:text-white">{value}</p>}</div>
    </article>
  );
}

function DeliveryRing() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center rounded-full md:h-36 md:w-36">
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,rgba(56,189,248,0.95)_0%,rgba(37,99,235,0.98)_70%,rgba(30,41,59,0.25)_70%)]" />
      <div className="absolute inset-3 rounded-full bg-white shadow-inner dark:bg-[#0f182d] dark:shadow-cyan-400/20" />
      <span className="relative text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">99.1%</span>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppLayout title="Dashboard">
      <div className="space-y-3">
        <section className="grid grid-cols-1 gap-2.5 xl:grid-cols-3">
          <MetricCard title="Today Alerts" value="12" icon={AlertTriangle} />
          <MetricCard title="Unread Notices" value="34" icon={BellDot} />
          <MetricCard title="Delivery Rate" icon={Box} center={<DeliveryRing />} />
        </section>

        <section className="grid grid-cols-1 gap-2.5 xl:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-cyan-300/25 dark:bg-[#111a2d] dark:shadow-[0_0_20px_rgba(15,23,42,0.35)]">
            <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">Urgent Notifications</h2>
            <div className="space-y-2.5">
              {urgentItems.map((item) => (
                <div key={item.title} className="border-b border-slate-200 pb-2.5 last:border-b-0 last:pb-0 dark:border-cyan-300/15">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <h3 className="text-xl font-medium text-slate-900 dark:text-white md:text-2xl">{item.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.badgeClass}`}>{item.badge}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.time}</p>
                  <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 md:text-sm">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-cyan-300/25 dark:bg-[#111a2d] dark:shadow-[0_0_20px_rgba(15,23,42,0.35)]">
            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">Campus Activity</h2>
            <div className="mb-3 flex flex-wrap gap-2 text-[10px] text-slate-600 dark:text-slate-300 md:text-xs">
              <span className="inline-flex items-center gap-1"><CircleCheck className="h-3 w-3 text-emerald-500 dark:text-emerald-300" /> Energy</span>
              <span className="inline-flex items-center gap-1"><CircleAlert className="h-3 w-3 text-orange-500 dark:text-orange-300" /> Occupancy</span>
              <span className="inline-flex items-center gap-1"><Info className="h-3 w-3 text-blue-500 dark:text-blue-300" /> Network</span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-cyan-300/15 dark:bg-[#0e1628]">
              <svg viewBox="0 0 600 220" className="h-44 w-full">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <line key={i} x1="0" y1={30 + i * 30} x2="600" y2={30 + i * 30} stroke="rgba(148,163,184,0.3)" strokeWidth="1" />
                ))}
                <path d={trendPathA} fill="none" stroke="#34d399" strokeWidth="2.5" />
                <path d={trendPathB} fill="none" stroke="#60a5fa" strokeWidth="2.5" />
                <path d={trendPathC} fill="none" stroke="#fb923c" strokeWidth="2.5" />
              </svg>
            </div>
          </article>
        </section>
      </div>
    </AppLayout>
  );
}
