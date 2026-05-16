import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export const AppLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-500/10" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl dark:bg-emerald-500/10" />
      </div>
      <div className="relative z-10 flex min-h-screen">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="min-w-0 flex-1">
          <Topbar onMenuClick={() => setOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="glass-shell rounded-[28px] p-4 sm:p-6 lg:p-7">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
