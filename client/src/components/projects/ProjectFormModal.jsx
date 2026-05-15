import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api, getErrorMessage } from '../../services/api';
import { PRIORITY_OPTIONS } from '../../utils/constants';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  priority: z.enum(PRIORITY_OPTIONS),
  members: z.array(z.string()).optional().default([])
});

const formatDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '');

export const ProjectFormModal = ({ open, onClose, project, users = [], onSaved }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      deadline: '',
      priority: 'Medium',
      members: []
    }
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title || '',
        description: project.description || '',
        deadline: formatDateInput(project.deadline),
        priority: project.priority || 'Medium',
        members: project.members?.map((member) => member._id || member) || []
      });
    } else {
      reset({
        title: '',
        description: '',
        deadline: '',
        priority: 'Medium',
        members: []
      });
    }
  }, [project, reset, open]);

  const onSubmit = async (values) => {
    try {
      if (project) {
        await api.put(`/projects/${project._id}`, values);
        toast.success('Project updated');
      } else {
        await api.post('/projects', values);
        toast.success('Project created');
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit project' : 'Create project'}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Title" error={errors.title?.message} {...register('title')} />
          <Select label="Priority" error={errors.priority?.message} {...register('priority')}>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
        </div>
        <Input label="Deadline" type="date" error={errors.deadline?.message} {...register('deadline')} />
        <Textarea label="Description" error={errors.description?.message} {...register('description')} />
        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Team members</p>
          <div className="grid max-h-52 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3 dark:border-slate-700 sm:grid-cols-2">
            {users.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No users available</p>
            ) : (
              users.map((user) => (
                <label key={user._id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                  <input
                    type="checkbox"
                    value={user._id}
                    className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-400"
                    {...register('members')}
                  />
                  <span className="min-w-0 truncate">{user.name}</span>
                  <span className="ml-auto text-xs text-slate-400">{user.role}</span>
                </label>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" icon={Save} loading={isSubmitting}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};
