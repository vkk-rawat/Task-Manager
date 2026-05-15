import { cn } from '../../utils/cn';

export const Select = ({ label, error, children, className, ...props }) => (
  <label className="block">
    {label ? (
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
    ) : null}
    <select
      className={cn(
        'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800',
        error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-800',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">{error}</span> : null}
  </label>
);
