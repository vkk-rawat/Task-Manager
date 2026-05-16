import { Menu, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/Button";
import { NotificationsMenu } from "./NotificationsMenu";

const titles = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/team": "Team",
  "/profile": "Profile",
};

export const Topbar = ({ onMenuClick }) => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const title = pathname.startsWith("/projects/")
    ? "Project details"
    : titles[pathname] || "Workspace";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/50 bg-white/60 px-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          icon={Menu}
          onClick={onMenuClick}
          className="lg:hidden"
          aria-label="Open menu"
        />
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold text-slate-950 dark:text-white">
            {title}
          </h1>
          <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
            Team Task Manager
          </p>
        </div>
      </div>
      <div className="glass-surface flex items-center gap-1 rounded-full px-1.5 py-1">
        <NotificationsMenu />
        <Button
          variant="ghost"
          size="icon"
          icon={theme === "dark" ? Sun : Moon}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        />
      </div>
    </header>
  );
};
