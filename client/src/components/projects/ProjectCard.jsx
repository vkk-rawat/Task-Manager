import { CalendarDays, Edit, Trash2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatters';

export const ProjectCard = ({ project, canManage, onEdit, onDelete }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-panel dark:border-slate-700 dark:bg-slate-900">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <Link to={`/projects/${project._id}`} className="text-lg font-semibold text-slate-950 hover:text-slate-700 dark:text-white dark:hover:text-slate-300">
          {project.title}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{project.description || 'No description'}</p>
      </div>
      <Badge type="priority" value={project.priority} />
    </div>

    <div className="mt-5 grid gap-3 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-2">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        {formatDate(project.deadline)}
      </div>
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        {project.members?.length || 0} members
      </div>
    </div>

    {canManage ? (
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" size="sm" icon={Edit} onClick={() => onEdit(project)}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => onDelete(project)}>
          Delete
        </Button>
      </div>
    ) : null}
  </article>
);
