import {
  MinusCircle,
  PlusCircle,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Select } from "../components/ui/Select";
import { useAuth } from "../contexts/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, getErrorMessage } from "../services/api";

export const TeamPage = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [projectId, setProjectId] = useState("");
  const [userId, setUserId] = useState("");
  usePageTitle("Team");

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === projectId),
    [projectId, projects],
  );

  const selectedProjectMembers = useMemo(() => {
    if (!selectedProject) {
      return [];
    }

    const ownerId = selectedProject.owner?._id || selectedProject.owner;
    const memberIds = new Set([
      ...(selectedProject.members || []).map((member) => member._id || member),
    ]);

    return users.filter(
      (user) => user._id === ownerId || memberIds.has(user._id),
    );
  }, [selectedProject, users]);

  const fetchData = async () => {
    try {
      const [{ data: teamData }, { data: projectData }] = await Promise.all([
        api.get("/team"),
        api.get("/projects", { params: { limit: 100 } }),
      ]);
      setUsers(teamData.data.users);
      setProjects(projectData.data.projects);
      setProjectId(projectData.data.projects[0]?._id || "");
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
        user.role.toLowerCase().includes(needle),
    );
  }, [query, users]);

  const handleMemberChange = async (mode) => {
    if (!projectId || !userId) {
      toast.error("Select a project and user");
      return;
    }

    try {
      if (mode === "add") {
        await api.post("/team/add-member", { projectId, userId });
        toast.success("Member added");
      } else {
        await api.delete("/team/remove-member", {
          data: { projectId, userId },
        });
        toast.success("Member removed");
      }
      fetchData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleRemoveProjectMember = async (memberId) => {
    if (!projectId || !memberId) {
      return;
    }

    try {
      await api.delete("/team/remove-member", {
        data: { projectId, userId: memberId },
      });
      toast.success("Member removed");
      fetchData();
      setUserId("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading team" />;
  }

  const selectedProjectCount = selectedProjectMembers.length;

  return (
    <div className="space-y-5">
      {isAdmin ? (
        <section className="glass-panel rounded-[28px] p-5">
          <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">
                Team
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Add and remove members per project.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                Choose a project, manage access, and keep the assigned team in
                sync with the workspace.
              </p>
            </div>
            <span className="rounded-full border border-white/40 bg-white/75 px-3 py-1 text-sm font-medium text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200">
              {selectedProjectCount} visible members
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
            <Select
              label="Project"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </Select>
            <Select
              label="User"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            >
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </Select>
            <Button icon={PlusCircle} onClick={() => handleMemberChange("add")}>
              Add
            </Button>
            <Button
              variant="secondary"
              icon={MinusCircle}
              onClick={() => handleMemberChange("remove")}
            >
              Remove
            </Button>
          </div>
        </section>
      ) : null}

      {isAdmin && selectedProject ? (
        <section className="glass-panel rounded-[28px] p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Project members
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {selectedProject.title}
              </p>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {selectedProjectMembers.length} members
            </span>
          </div>

          {selectedProjectMembers.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {selectedProjectMembers.map((member) => {
                const isOwner =
                  (selectedProject.owner?._id || selectedProject.owner) ===
                  member._id;

                return (
                  <article
                    key={member._id}
                    className="glass-surface rounded-[24px] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar user={member} size="lg" />
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                          {member.name}
                        </h3>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        {member.role === "admin" ? (
                          <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <UserRound className="h-4 w-4" />
                        )}
                        <span>{member.role}</span>
                        {isOwner ? (
                          <span className="text-xs text-slate-400">owner</span>
                        ) : null}
                      </div>
                      {!isOwner ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={MinusCircle}
                          onClick={() => handleRemoveProjectMember(member._id)}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No project members"
              message="Add a user to this project to see them here."
            />
          )}
        </section>
      ) : null}

      <section className="glass-panel rounded-[28px] p-4">
        <Input
          label="Search team"
          placeholder="Name, email, or role"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </section>

      {filteredUsers.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => (
            <article
              key={user._id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3">
                <Avatar user={user} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-slate-950 dark:text-white">
                    {user.name}
                  </h2>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                {user.role === "admin" ? (
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
                {user.role}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="No team members found"
          action={
            <Button
              variant="secondary"
              icon={Search}
              onClick={() => setQuery("")}
            >
              Clear search
            </Button>
          }
        />
      )}
    </div>
  );
};
