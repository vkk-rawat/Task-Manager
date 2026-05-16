import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-900 text-white shadow-lg shadow-slate-950/15 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-950/20 focus-visible:ring-slate-400 dark:from-white dark:via-slate-100 dark:to-cyan-100 dark:text-slate-950 dark:shadow-slate-950/10 dark:hover:shadow-slate-950/15",
  secondary:
    "glass-surface text-slate-800 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:ring-slate-300 dark:text-slate-100 dark:hover:bg-slate-900/80",
  ghost:
    "text-slate-700 hover:bg-white/70 hover:backdrop-blur focus-visible:ring-slate-300 dark:text-slate-200 dark:hover:bg-white/10",
  danger:
    "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-600/25 focus-visible:ring-rose-300",
  success:
    "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-600/25 focus-visible:ring-emerald-300",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
  icon: "h-10 w-10 p-0",
};

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={cn(
      "inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-transparent font-medium transition duration-200 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
      variants[variant],
      sizes[size],
      className,
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : Icon ? (
      <Icon className="h-4 w-4" />
    ) : null}
    {children}
  </button>
);
