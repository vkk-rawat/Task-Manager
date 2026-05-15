import { LayoutGrid, List, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { api, getErrorMessage } from '../services/api';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../utils/constants';
import { formatDate } from '../utils/formatters';
import { cn } from '../utils/cn';

export const TasksPage = () => {
  const { isAdmin } = useAuth();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [sort, setSort] = useState('dueDate');
  const [view, setView] = useState('board');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  usePageTitle('Tasks');

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks', {
        params: {
          q: q || undefined,
          status: status || undefined,
          priority: priority || undefined,
          sort,
          limit: 100
        }
      });
      setTasks(data.data.tasks);
      const requestedTask = searchParams.get('task');
      if (requestedTask) {
        const match = data.data.tasks.find((task) => task._id === requestedTask);
        if (match) {
          setSelectedTask(match);
        }
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [{ data: projectData }, { data: teamData }] = await Promise.all([
        api.get('/projects', { params: { limit: 100 } }),
        api.get('/team')
      ]);
      setProjects(projectData.data.projects);
      setUsers(teamData.data.users);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [q, status, priority, sort]);

  useEffect(() => {
    fetchMeta();
  }, []);

  const joinedProjectIds = useMemo(
    () => [...new Set(tasks.map((task) => task.project?._id || task.project).filter(Boolean))],
    [tasks]
  );

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    joinedProjectIds.forEach((projectId) => socket.emit('project:join', projectId));
    socket.on('task:created', fetchTasks);
    socket.on('task:updated', fetchTasks);
    socket.on('task:deleted', fetchTasks);
    socket.on('comment:created', fetchTasks);

    return () => {
      joinedProjectIds.forEach((projectId) => socket.emit('project:leave', projectId));
      socket.off('task:created', fetchTasks);
      socket.off('task:updated', fetchTasks);
      socket.off('task:deleted', fetchTasks);
      socket.off('comment:created', fetchTasks);
    };
  }, [socket, joinedProjectIds.join('|')]);

  const openCreate = () => {
    setEditing(null);
    setTaskModalOpen(true);
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm(`Delete "${task.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleStatusChange = async (task, nextStatus) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: nextStatus });
      setTasks((current) => current.map((item) => (item._id === task._id ? { ...item, status: nextStatus } : item)));
      toast.success(`Moved to ${nextStatus}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCommentAdded = (taskId, comment) => {
    setTasks((current) =>
      current.map((task) =>
        task._id === taskId ? { ...task, comments: [comment, ...(task.comments || [])] } : task
      )
    );
    setSelectedTask((current) =>
      current?._id === taskId ? { ...current, comments: [comment, ...(current.comments || [])] } : current
    );
  };

  if (loading) {
    return <LoadingSpinner label="Loading tasks" />;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_170px_auto] lg:items-end">
          <Input label="Search" placeholder="Search tasks" value={q} onChange={(event) => setQ(event.target.value)} />
          <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All</option>
            {STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select label="Priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
            <option value="">All</option>
            {PRIORITY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select label="Sort" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="dueDate">Due soon</option>
            <option value="-dueDate">Due later</option>
            <option value="-createdAt">Newest</option>
            <option value="createdAt">Oldest</option>
            <option value="status">Status</option>
          </Select>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-slate-200 p-1 dark:border-slate-700">
              <Button
                variant={view === 'board' ? 'primary' : 'ghost'}
                size="icon"
                icon={LayoutGrid}
                onClick={() => setView('board')}
                aria-label="Board view"
              />
              <Button
                variant={view === 'list' ? 'primary' : 'ghost'}
                size="icon"
                icon={List}
                onClick={() => setView('list')}
                aria-label="List view"
              />
            </div>
            {isAdmin ? (
              <Button icon={Plus} onClick={openCreate}>
                New
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {tasks.length ? (
        view === 'board' ? (
          <KanbanBoard
            tasks={tasks}
            canManage={isAdmin}
            onEdit={(task) => {
              setEditing(task);
              setTaskModalOpen(true);
            }}
            onDelete={handleDelete}
            onOpen={setSelectedTask}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="hidden grid-cols-[1.4fr_140px_140px_170px_130px] border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-normal text-slate-400 dark:border-slate-700 lg:grid">
              <span>Task</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Project</span>
              <span>Due</span>
            </div>
            {tasks.map((task) => (
              <button
                key={task._id}
                onClick={() => setSelectedTask(task)}
                className={cn(
                  'grid w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 lg:grid-cols-[1.4fr_140px_140px_170px_130px] lg:items-center',
                  task.status === 'Overdue' && 'bg-rose-50/60 dark:bg-rose-950/20'
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-950 dark:text-white">{task.title}</span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{task.assignedTo?.name}</span>
                </span>
                <Badge value={task.status} />
                <Badge type="priority" value={task.priority} />
                <span className="truncate text-sm text-slate-500 dark:text-slate-400">{task.project?.title}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{formatDate(task.dueDate)}</span>
              </button>
            ))}
          </section>
        )
      ) : (
        <EmptyState
          title="No tasks found"
          message="Use the filters above or create a task."
          action={isAdmin ? <Button icon={Plus} onClick={openCreate}>Create task</Button> : null}
        />
      )}

      <TaskFormModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        task={editing}
        projects={projects}
        users={users}
        onSaved={fetchTasks}
      />

      <TaskDetailModal
        open={Boolean(selectedTask)}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
};
