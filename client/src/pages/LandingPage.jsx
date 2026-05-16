import {
  ArrowRight,
  CheckCircle2,
  FolderKanban,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { Button } from "../components/ui/Button";

const features = [
  {
    icon: FolderKanban,
    title: "Project planning",
    copy: "Create projects, prioritize work, and keep owners visible.",
  },
  {
    icon: UsersRound,
    title: "Team workflow",
    copy: "Assign tasks, comment in context, and track delivery across roles.",
  },
  {
    icon: ShieldCheck,
    title: "Secure access",
    copy: "JWT authentication and role-based authorization across the stack.",
  },
];

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  usePageTitle("Collaborative project management");

  return (
    <div className="min-h-screen text-slate-950 dark:text-white">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-slate-950 dark:text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-800 to-cyan-600 text-sm font-bold text-white shadow-lg shadow-cyan-950/20 dark:from-white dark:via-slate-100 dark:to-cyan-200 dark:text-slate-950">
              TT
            </span>
            <span>
              <span className="block font-semibold">Team Task Manager</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Glassmorphism workspace
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button icon={ArrowRight}>
                {isAuthenticated ? "Dashboard" : "Start"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10" />
          <div className="absolute right-8 top-36 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/10" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/50 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/50 dark:text-cyan-300">
              Collaborative work OS
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Task planning that feels calm, sharp, and real-time.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A secure workspace for projects, tasks, teams, deadlines,
              comments, dashboards, and admin-controlled workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
                <Button size="lg" icon={ArrowRight}>
                  Open workspace
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Sign in
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Projects", "Tasks", "Members"].map((item) => (
                <div
                  key={item}
                  className="glass-panel rounded-2xl px-4 py-3 text-sm"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    {item}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-950 dark:text-white">
                    Live collaboration
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div className="glass-shell rounded-[32px] p-4 sm:p-6">
              <div className="rounded-[28px] border border-white/40 bg-slate-950/90 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.28)] dark:border-white/10 dark:bg-slate-950/80">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">
                      Workspace preview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Productive by design
                    </h2>
                  </div>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
                    Live
                  </span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Projects", value: "12" },
                    { label: "Tasks", value: "48" },
                    { label: "Overdue", value: "3" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                    >
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                        {item.label}
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl border border-white/10 bg-white/6 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-slate-200">
                    <span>Weekly progress</span>
                    <span>84%</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[32, 48, 68, 52, 76, 88, 64].map((height, index) => (
                      <div
                        key={index}
                        className="flex h-28 items-end rounded-2xl bg-white/8 p-2"
                      >
                        <div
                          className="w-full rounded-full bg-gradient-to-t from-cyan-400 via-sky-400 to-emerald-300 shadow-lg shadow-cyan-500/20"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="glass-panel rounded-[24px] p-5 transition duration-200 hover:-translate-y-1"
          >
            <feature.icon className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
            <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {feature.copy}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="glass-panel grid gap-4 rounded-[28px] px-5 py-4 sm:grid-cols-3">
          {["Role-based routes", "Kanban workflow", "Dashboard analytics"].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {item}
              </div>
            ),
          )}
        </div>
      </section>
    </div>
  );
};
