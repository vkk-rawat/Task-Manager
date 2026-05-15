import { CalendarDays, Plus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { TaskCard } from '../components/tasks/TaskCard';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { api, getErrorMessage } from '../services/api';
import { formatDate } from '../utils/formatters';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  usePageTitle(project?.title || 'Project');

  const fetchProject = async () => {
    try {
      const [{ data: projectData }, { data: taskData }, { data: teamData }] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get('/tasks', { params: { project: id, limit: 100 } }),
        api.get('/team')
      ]);
      setProject(projectData.data.project);
      setTasks(taskData.data.tasks);
      setUsers(teamData.data.users);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return <LoadingSpinner label="Loading project" />;
  }

  if (!project) {
    return <EmptyState title="Project not found" />;
  }

  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge type="priority" value={project.priority} />
              <span className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-4 w-4" />
                {formatDate(project.deadline)}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <Users className="h-4 w-4" />
                {project.members?.length || 0} members
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{project.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">{project.description || 'No description'}</p>
          </div>
          {isAdmin ? (
            <Button icon={Plus} onClick={() => setTaskModalOpen(true)}>
              New task
            </Button>
          ) : null}
        </div>
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>{completed} of {tasks.length} tasks completed</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      </section>

      {tasks.length ? (
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              canManage={false}
              onOpen={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </section>
      ) : (
        <EmptyState title="No tasks yet" action={isAdmin ? <Button icon={Plus} onClick={() => setTaskModalOpen(true)}>Create task</Button> : null} />
      )}

      <div>
        <Link to="/projects" className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
          Back to projects
        </Link>
      </div>

      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        projects={[project]}
        users={users}
        onSaved={fetchProject}
      />
    </div>
  );
};
