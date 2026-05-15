import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const variants = {
  primary:
    'bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-400 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200',
  secondary:
    'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800',
  ghost:
    'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-300 dark:text-slate-200 dark:hover:bg-slate-800',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-300',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-300'
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
  icon: 'h-10 w-10 p-0'
};

export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    className={cn(
      'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium transition focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
      variants[variant],
      sizes[size],
      className
    )}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
    {children}
  </button>
);
