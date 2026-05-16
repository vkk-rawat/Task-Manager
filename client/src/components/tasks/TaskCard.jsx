import {
  CalendarClock,
  Edit,
  MessageSquare,
  Paperclip,
  Trash2,
  UserRound,
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { formatDate, isPastDue } from "../../utils/formatters";
import { cn } from "../../utils/cn";

export const TaskCard = ({ task, canManage, onEdit, onDelete, onOpen }) => (
  <article
    className={cn(
      "glass-panel rounded-[24px] p-4 transition duration-200 hover:-translate-y-0.5",
      isPastDue(task.dueDate, task.status) &&
        "border-rose-200 dark:border-rose-900",
    )}
  >
    <div className="flex items-start justify-between gap-3">
      <button className="min-w-0 text-left" onClick={() => onOpen(task)}>
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-950 dark:text-white">
          {task.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {task.description || "No description"}
        </p>
      </button>
      <Badge type="priority" value={task.priority} />
    </div>

    <div className="mt-4 flex flex-wrap items-center gap-2">
      <Badge value={task.status} />
      <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <CalendarClock className="h-3.5 w-3.5" />
        {formatDate(task.dueDate)}
      </span>
    </div>

    <div className="mt-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <Avatar user={task.assignedTo} size="sm" />
        <span className="truncate text-xs text-slate-500 dark:text-slate-400">
          <UserRound className="mr-1 inline h-3.5 w-3.5" />
          {task.assignedTo?.name || "Unassigned"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          {task.comments?.length || 0}
        </span>
        {task.attachments?.length ? (
          <span className="inline-flex items-center gap-1">
            <Paperclip className="h-3.5 w-3.5" />
            {task.attachments.length}
          </span>
        ) : null}
      </div>
    </div>

    {canManage ? (
      <div className="mt-4 flex justify-end gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={Edit}
          onClick={() => onEdit(task)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={Trash2}
          onClick={() => onDelete(task)}
        >
          Delete
        </Button>
      </div>
    ) : null}
  </article>
);
