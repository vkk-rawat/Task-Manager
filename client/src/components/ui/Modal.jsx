import { X } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({ open, title, children, onClose, width = 'max-w-2xl' }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div
        className={`max-h-[90vh] w-full ${width} overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-panel dark:border-slate-700 dark:bg-slate-900`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h2>
          <Button variant="ghost" size="icon" icon={X} onClick={onClose} aria-label="Close" />
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
