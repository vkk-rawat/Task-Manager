import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api, getErrorMessage } from '../../services/api';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  project: z.string().min(1, 'Project is required'),
  assignedTo: z.string().min(1, 'Assigned member is required'),
  status: z.enum(STATUS_OPTIONS),
  priority: z.enum(PRIORITY_OPTIONS),
  dueDate: z.string().min(1, 'Due date is required'),
  attachmentName: z.string().optional(),
  attachmentUrl: z.string().url('Enter a valid URL').or(z.literal('')).optional()
});

const formatDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '');

export const TaskFormModal = ({ open, onClose, task, projects = [], users = [], onSaved }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      project: '',
      assignedTo: '',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '',
      attachmentName: '',
      attachmentUrl: ''
    }
  });

  const selectedProjectId = watch('project');

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        project: task.project?._id || task.project || '',
        assignedTo: task.assignedTo?._id || task.assignedTo || '',
        status: task.status || 'Todo',
        priority: task.priority || 'Medium',
        dueDate: formatDateInput(task.dueDate),
        attachmentName: task.attachments?.[0]?.name || '',
        attachmentUrl: task.attachments?.[0]?.url || ''
      });
    } else {
      reset({
        title: '',
        description: '',
        project: projects[0]?._id || '',
        assignedTo: '',
        status: 'Todo',
        priority: 'Medium',
        dueDate: '',
        attachmentName: '',
        attachmentUrl: ''
      });
    }
  }, [task, reset, open, projects]);

  const availableUsers = useMemo(() => {
    const project = projects.find((item) => item._id === selectedProjectId);

    if (!project) {
      return users;
    }

    const ids = new Set([
      project.owner?._id || project.owner,
      ...(project.members || []).map((member) => member._id || member)
    ]);

    return users.filter((user) => ids.has(user._id));
  }, [projects, selectedProjectId, users]);

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      description: values.description || '',
      project: values.project,
      assignedTo: values.assignedTo,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate,
      attachments:
        values.attachmentUrl && values.attachmentName
          ? [{ name: values.attachmentName, url: values.attachmentUrl }]
          : []
    };

    try {
      if (task) {
        await api.put(`/tasks/${task._id}`, payload);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', payload);
        toast.success('Task created');
      }
      onSaved();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit task' : 'Create task'}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <Textarea label="Description" error={errors.description?.message} {...register('description')} />
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Project" error={errors.project?.message} {...register('project')}>
            <option value="">Select project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </Select>
          <Select label="Assignee" error={errors.assignedTo?.message} {...register('assignedTo')}>
            <option value="">Select member</option>
            {availableUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>
          <Select label="Priority" error={errors.priority?.message} {...register('priority')}>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </Select>
          <Input label="Due date" type="date" error={errors.dueDate?.message} {...register('dueDate')} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Attachment name" error={errors.attachmentName?.message} {...register('attachmentName')} />
          <Input label="Attachment URL" error={errors.attachmentUrl?.message} {...register('attachmentUrl')} />
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
