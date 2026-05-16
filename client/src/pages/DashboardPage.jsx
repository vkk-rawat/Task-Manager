import {
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { ProgressBar } from "../components/ui/ProgressBar";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { StatCard } from "../components/ui/StatCard";
import { usePageTitle } from "../hooks/usePageTitle";
import { api, getErrorMessage } from "../services/api";
import { fromNow, formatDate } from "../utils/formatters";
import { useSocket } from "../contexts/SocketContext";

const COLORS = ["#0f172a", "#0284c7", "#7c3aed", "#10b981", "#e11d48"];

export const DashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  usePageTitle("Dashboard");

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/dashboard");
      setDashboard(data.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    socket.on("task:created", fetchDashboard);
    socket.on("task:updated", fetchDashboard);
    socket.on("activity:new", fetchDashboard);

    return () => {
      socket.off("task:created", fetchDashboard);
      socket.off("task:updated", fetchDashboard);
      socket.off("activity:new", fetchDashboard);
    };
  }, [socket]);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard" />;
  }

  const summary = dashboard?.summary || {};
  const statusCounts = dashboard?.charts?.statusBreakdown || [];
  const activeStatus = statusCounts.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <section className="glass-panel overflow-hidden rounded-[28px] p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700 dark:text-cyan-300">
              Workspace pulse
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              A clear overview of projects, progress, and overdue work.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Track delivery across every project with real-time updates, status
              distribution, and weekly productivity charts.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Projects", value: summary.totalProjects || 0 },
              { label: "Active tasks", value: activeStatus || 0 },
              {
                label: "Completion rate",
                value: `${summary.completionRate || 0}%`,
              },
              { label: "Overdue", value: summary.overdueTasks || 0 },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/40 bg-white/75 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/40"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Projects"
          value={summary.totalProjects || 0}
          icon={FolderKanban}
          tone="sky"
        />
        <StatCard
          title="Total tasks"
          value={summary.totalTasks || 0}
          icon={ListTodo}
        />
        <StatCard
          title="Done"
          value={summary.completedTasks || 0}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          title="Pending"
          value={summary.pendingTasks || 0}
          icon={TrendingUp}
          tone="amber"
        />
        <StatCard
          title="Overdue"
          value={summary.overdueTasks || 0}
          icon={AlertTriangle}
          tone="rose"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass-panel rounded-[28px] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Weekly productivity
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {summary.completionRate || 0}% completion rate
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard?.charts?.weeklyProductivity || []}>
                <defs>
                  <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  fill="url(#completed)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-5">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
            Status mix
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboard?.charts?.statusBreakdown || []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {(dashboard?.charts?.statusBreakdown || []).map(
                    (entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ),
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="glass-panel rounded-[28px] p-5">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
            Priority distribution
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard?.charts?.priorityBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-5">
          <h2 className="text-base font-semibold text-slate-950 dark:text-white">
            Recent activity
          </h2>
          <div className="mt-4 space-y-3">
            {dashboard?.recentActivity?.length ? (
              dashboard.recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800"
                >
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      <span className="font-medium">
                        {activity.actor?.name}
                      </span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-400">
                      {activity.metadata?.title ||
                        activity.metadata?.projectTitle ||
                        "Workspace update"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">
                    {fromNow(activity.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-[28px] p-5">
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">
          Project progress
        </h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {dashboard?.projectProgress?.length ? (
            dashboard.projectProgress.map((project) => (
              <div
                key={project._id}
                className="glass-surface rounded-[24px] p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {project.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Due {formatDate(project.deadline)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {project.progress}%
                  </span>
                </div>
                <ProgressBar value={project.progress} />
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No projects yet
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
