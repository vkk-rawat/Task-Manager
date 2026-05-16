import { cn } from "../../utils/cn";

export const StatCard = ({
  title,
  value,
  icon: Icon,
  tone = "slate",
  detail,
}) => {
  const tones = {
    slate: "from-slate-950 via-slate-700 to-slate-500 text-white",
    emerald: "from-emerald-600 via-teal-500 to-cyan-500 text-white",
    amber: "from-amber-500 via-orange-500 to-rose-500 text-white",
    rose: "from-rose-500 via-pink-500 to-fuchsia-500 text-white",
    sky: "from-sky-500 via-cyan-500 to-blue-500 text-white",
  };

  return (
    <div className="glass-panel rounded-[24px] p-5 transition duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
        {Icon ? (
          <div
            className={cn(
              "rounded-2xl bg-gradient-to-br p-3 shadow-lg",
              tones[tone],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {detail ? (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          {detail}
        </p>
      ) : null}
    </div>
  );
};
