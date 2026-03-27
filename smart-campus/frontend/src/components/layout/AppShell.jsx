import RoleBasedNav from "./RoleBasedNav";

export default function AppShell({ topbar, children }) {
  return (
    <div className="min-h-screen bg-hero-glow">
      {topbar}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="rounded-xl border bg-card p-3">
          <RoleBasedNav />
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
