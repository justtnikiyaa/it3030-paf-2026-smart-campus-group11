import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-hero-glow md:grid md:grid-cols-[256px_1fr]">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0">
        <Topbar title={title} onMenuClick={() => setMobileOpen((prev) => !prev)} />
        <main className="mx-auto max-w-7xl p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
