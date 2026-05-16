import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ProjectFormModal } from "../components/projects/ProjectFormModal";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Select } from "../components/ui/Select";
import { useAuth } from "../contexts/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, getErrorMessage } from "../services/api";
import { PRIORITY_OPTIONS } from "../utils/constants";

export const ProjectsPage = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  usePageTitle("Projects");

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects", {
        params: {
          q: q || undefined,
          priority: priority || undefined,
          limit: 100,
        },
      });
      setProjects(data.data.projects);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/team");
      setUsers(data.data.users);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [q, priority]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.title}" and all related tasks?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projects/${project._id}`);
      toast.success("Project deleted");
      fetchProjects();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading projects" />;
  }

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">
              Projects
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Plan the work, keep owners visible.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Search projects, filter by priority, and create new workspaces
              with member access already defined.
            </p>
          </div>
          {isAdmin ? (
            <Button icon={Plus} onClick={openCreate} className="lg:mb-0">
              New project
            </Button>
          ) : null}
        </div>
      </section>

      <section className="glass-panel rounded-[28px] p-4">
        <div className="grid flex-1 gap-3 sm:grid-cols-[1fr_220px]">
          <Input
            label="Search"
            placeholder="Search projects"
            value={q}
            onChange={(event) => setQ(event.target.value)}
          />
          <Select
            label="Priority"
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            <option value="">All priorities</option>
            {PRIORITY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
      </section>

      {projects.length ? (
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              canManage={isAdmin}
              onEdit={(item) => {
                setEditing(item);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No projects found"
          message="Adjust the filters or create a new project."
          action={
            isAdmin ? (
              <Button icon={Plus} onClick={openCreate}>
                Create project
              </Button>
            ) : null
          }
        />
      )}

      <ProjectFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={editing}
        users={users}
        onSaved={fetchProjects}
      />
    </div>
  );
};
