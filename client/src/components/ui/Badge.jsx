import { PRIORITY_META, STATUS_META } from '../../utils/constants';
import { cn } from '../../utils/cn';

export const Badge = ({ type = 'status', value, className }) => {
  const meta = type === 'priority' ? PRIORITY_META[value] : STATUS_META[value];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium',
        meta?.className ||
          'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
        className
      )}
    >
      {meta?.label || value}
    </span>
  );
};
