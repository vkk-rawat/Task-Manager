import { ArrowRight, CheckCircle2, FolderKanban, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/Button';

const features = [
  { icon: FolderKanban, title: 'Project planning', copy: 'Create projects, prioritize work, and keep owners visible.' },
  { icon: UsersRound, title: 'Team workflow', copy: 'Assign tasks, comment in context, and track delivery across roles.' },
  { icon: ShieldCheck, title: 'Secure access', copy: 'JWT authentication and role-based authorization across the stack.' }
];

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  usePageTitle('Collaborative project management');

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-slate-950">TT</span>
            <span className="font-semibold">Team Task Manager</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                Login
              </Button>
            </Link>
            <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
              <Button className="bg-white text-slate-950 hover:bg-slate-100" icon={ArrowRight}>
                {isAuthenticated ? 'Dashboard' : 'Start'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section
        className="relative flex min-h-[82vh] items-end bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(15,23,42,0.88), rgba(15,23,42,0.58), rgba(15,23,42,0.24)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80')"
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="text-sm font-semibold uppercase tracking-normal text-emerald-200">Collaborative work OS</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-normal sm:text-6xl">Team Task Manager</h1>
            <p className="mt-5 text-lg leading-8 text-slate-100">
              A secure workspace for projects, tasks, teams, deadlines, comments, dashboards, and admin-controlled workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
                <Button size="lg" className="bg-emerald-500 text-white hover:bg-emerald-600" icon={ArrowRight}>
                  Open workspace
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <feature.icon className="h-6 w-6 text-emerald-600" />
            <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{feature.copy}</p>
          </article>
        ))}
      </section>

      <section className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          {['Role-based routes', 'Kanban workflow', 'Dashboard analytics'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
