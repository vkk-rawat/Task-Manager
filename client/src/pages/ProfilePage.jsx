import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { api, getErrorMessage } from '../services/api';
import { formatDate } from '../utils/formatters';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  avatar: z.string().url('Enter a valid URL').or(z.literal('')).optional()
});

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  usePageTitle('Profile');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      avatar: user?.avatar || ''
    }
  });

  useEffect(() => {
    reset({
      name: user?.name || '',
      avatar: user?.avatar || ''
    });
  }, [reset, user]);

  const onSubmit = async (values) => {
    try {
      const { data } = await api.put('/users/me', values);
      setUser(data.data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <Avatar user={user} size="lg" />
        <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">{user?.name}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Role</span>
            <span className="font-medium text-slate-900 dark:text-white">{user?.role}</span>
          </div>
          <div className="flex justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Joined</span>
            <span className="font-medium text-slate-900 dark:text-white">{formatDate(user?.createdAt)}</span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Profile settings</h2>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Name" error={errors.name?.message} {...register('name')} />
          <Input label="Avatar URL" error={errors.avatar?.message} {...register('avatar')} />
          <Button type="submit" icon={Save} loading={isSubmitting}>
            Save changes
          </Button>
        </form>
      </section>
    </div>
  );
};
