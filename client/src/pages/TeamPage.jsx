import { MinusCircle, PlusCircle, Search, ShieldCheck, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { api, getErrorMessage } from '../services/api';

export const TeamPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [projectId, setProjectId] = useState('');
  const [userId, setUserId] = useState('');
  usePageTitle('Team');

  const fetchData = async () => {
    try {
      const [{ data: teamData }, { data: projectData }] = await Promise.all([
        api.get('/team'),
        api.get('/projects', { params: { limit: 100 } })
      ]);
      setUsers(teamData.data.users);
      setProjects(projectData.data.projects);
      setProjectId(projectData.data.projects[0]?._id || '');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return users;
    }

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle) ||
        user.role.toLowerCase().includes(needle)
    );
  }, [query, users]);

  const handleMemberChange = async (mode) => {
    if (!projectId || !userId) {
      toast.error('Select a project and user');
      return;
    }

    try {
      if (mode === 'add') {
        await api.post('/team/add-member', { projectId, userId });
        toast.success('Member added');
      } else {
        await api.delete('/team/remove-member', { data: { projectId, userId } });
        toast.success('Member removed');
      }
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading team" />;
  }

  return (
    <div className="space-y-5">
      {isAdmin ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
            <Select label="Project" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </Select>
            <Select label="User" value={userId} onChange={(event) => setUserId(event.target.value)}>
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </Select>
            <Button icon={PlusCircle} onClick={() => handleMemberChange('add')}>
              Add
            </Button>
            <Button variant="secondary" icon={MinusCircle} onClick={() => handleMemberChange('remove')}>
              Remove
            </Button>
          </div>
        </section>
      ) : null}

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <Input label="Search team" placeholder="Name, email, or role" value={query} onChange={(event) => setQuery(event.target.value)} />
      </section>

      {filteredUsers.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => (
            <article key={user._id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <Avatar user={user} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-slate-950 dark:text-white">{user.name}</h2>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                {user.role === 'admin' ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : <UserRound className="h-4 w-4" />}
                {user.role}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState title="No team members found" action={<Button variant="secondary" icon={Search} onClick={() => setQuery('')}>Clear search</Button>} />
      )}
    </div>
  );
};
