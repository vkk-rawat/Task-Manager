import { forwardRef } from "react";
import { cn } from "../../utils/cn";

export const Input = forwardRef(
  ({ label, error, className, ...props }, ref) => (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
      ) : null}
      <input
        ref={ref}
        className={cn(
          "glass-surface h-11 w-full rounded-2xl px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-300/40 dark:text-slate-100 dark:focus:ring-cyan-400/30",
          error &&
            "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-800",
          className,
        )}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-xs text-rose-600 dark:text-rose-300">
          {error}
        </span>
      ) : null}
    </label>
  ),
);
