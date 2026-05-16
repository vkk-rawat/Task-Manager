export const TASK_STATUS_OPTIONS = ['To Do', 'In Progress', 'Done'];

export const STATUS_OPTIONS = [...TASK_STATUS_OPTIONS, 'Overdue'];

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export const STATUS_META = {
  'To Do': {
    label: 'To Do',
    className: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700'
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-200 dark:border-sky-800'
  },
  Done: {
    label: 'Done',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800'
  },
  Overdue: {
    label: 'Overdue',
    className: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800'
  }
};

export const PRIORITY_META = {
  Low: {
    label: 'Low',
    className: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-200 dark:border-teal-800'
  },
  Medium: {
    label: 'Medium',
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800'
  },
  High: {
    label: 'High',
    className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800'
  },
  Critical: {
    label: 'Critical',
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
  }
};
