import AppLayout from "../components/layout/AppLayout";
import { notifications } from "../data/notifications";

export default function NotificationsPage() {
  return (
    <AppLayout title="Notifications">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-cyan-300/25 dark:bg-[#111a2d] dark:shadow-[0_0_20px_rgba(15,23,42,0.35)] md:p-5">
        <h2 className="mb-3 text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Notifications</h2>

        <div className="space-y-2.5">
          {notifications.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-cyan-300/20 dark:bg-[#0f182d]"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">{item.time}</span>
              </div>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{item.message}</p>
            </article>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
