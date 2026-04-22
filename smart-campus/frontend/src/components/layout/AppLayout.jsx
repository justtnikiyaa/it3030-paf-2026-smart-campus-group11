import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ title, titleIcon, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden text-slate-900 dark:text-slate-100 md:grid md:grid-cols-[220px_1fr]">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex h-screen flex-col min-w-0 border-l border-slate-200/80 dark:border-cyan-400/15">
        <Topbar title={title} titleIcon={titleIcon} onMenuClick={() => setMobileOpen((prev) => !prev)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-[1120px] px-3 pb-6 pt-3 md:px-5 md:pb-8 md:pt-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
