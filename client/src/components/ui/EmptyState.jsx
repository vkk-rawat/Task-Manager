import { Inbox } from 'lucide-react';

export const EmptyState = ({ title, message, action }) => (
  <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
    <Inbox className="h-9 w-9 text-slate-400" />
    <h3 className="mt-3 text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
    {message ? <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">{message}</p> : null}
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);
