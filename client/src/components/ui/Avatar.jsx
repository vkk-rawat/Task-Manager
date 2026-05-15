import { initials } from '../../utils/formatters';

export const Avatar = ({ user, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizes[size]} rounded-full border border-slate-200 object-cover dark:border-slate-700`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} inline-flex items-center justify-center rounded-full border border-slate-200 bg-white font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100`}
    >
      {initials(user?.name)}
    </div>
  );
};
