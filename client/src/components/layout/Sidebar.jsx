import {
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  LogOut,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../utils/cn";
import { Button } from "../ui/Button";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/team", label: "Team", icon: Users },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export const Sidebar = ({ open, onClose }) => {
  const { logout, user } = useAuth();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/60 bg-white/70 shadow-[16px_0_40px_rgba(15,23,42,0.12)] backdrop-blur-2xl transition-transform dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[16px_0_40px_rgba(15,23,42,0.42)] lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/50 px-5 dark:border-white/10">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-800 to-cyan-600 text-sm font-bold text-white shadow-lg shadow-cyan-950/20 dark:from-white dark:via-slate-100 dark:to-cyan-200 dark:text-slate-950">
              TT
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                Team Task
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                Manager
              </span>
            </span>
          </NavLink>
          <Button
            variant="ghost"
            size="icon"
            icon={X}
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close menu"
          />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition duration-200",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-sky-600 text-white shadow-lg shadow-cyan-500/25 dark:from-cyan-400 dark:to-sky-500 dark:text-slate-950"
                    : "text-slate-600 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/50 p-4 dark:border-white/10">
          <div className="glass-surface mb-3 min-w-0 rounded-2xl p-3">
            <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
              {user?.name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
          <Button
            variant="secondary"
            icon={LogOut}
            className="w-full"
            onClick={logout}
          >
            Sign out
          </Button>
        </div>
      </aside>
    </>
  );
};
