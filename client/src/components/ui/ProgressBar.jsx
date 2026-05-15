export const ProgressBar = ({ value = 0 }) => (
  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
    <div
      className="h-full rounded-full bg-emerald-500 transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);
