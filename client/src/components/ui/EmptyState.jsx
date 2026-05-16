import { Inbox } from "lucide-react";

export const EmptyState = ({ title, message, action }) => (
  <div className="glass-panel flex min-h-52 flex-col items-center justify-center rounded-[24px] border-dashed p-8 text-center">
    <Inbox className="h-10 w-10 text-cyan-500 dark:text-cyan-300" />
    <h3 className="mt-3 text-base font-semibold text-slate-950 dark:text-white">
      {title}
    </h3>
    {message ? (
      <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>
    ) : null}
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);
