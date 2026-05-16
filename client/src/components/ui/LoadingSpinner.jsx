import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ label = "Loading" }) => (
  <div className="glass-panel flex min-h-40 items-center justify-center gap-3 rounded-[24px] px-6 py-10 text-sm text-slate-500 dark:text-slate-400">
    <Loader2 className="h-5 w-5 animate-spin text-cyan-500 dark:text-cyan-300" />
    <span className="font-medium">{label}</span>
  </div>
);
