import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ title, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-[#070c18] dark:text-slate-100 md:grid md:grid-cols-[228px_1fr]">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0 border-l border-slate-200 dark:border-cyan-400/15">
        <Topbar title={title} onMenuClick={() => setMobileOpen((prev) => !prev)} />
        <main className="mx-auto w-full max-w-[1060px] p-2 md:p-4">{children}</main>
      </div>
    </div>
  );
}
