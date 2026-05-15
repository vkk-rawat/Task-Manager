import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquarePlus, Paperclip } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { api, getErrorMessage } from '../../services/api';
import { formatDate, formatDateTime, fromNow } from '../../utils/formatters';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';

const schema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1200)
});

export const TaskDetailModal = ({ task, open, onClose, onCommentAdded }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { content: '' }
  });

  if (!task) {
    return null;
  }

  const onSubmit = async (values) => {
    try {
      const { data } = await api.post(`/tasks/${task._id}/comments`, values);
      onCommentAdded(task._id, data.data.comment);
      reset();
      toast.success('Comment added');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={task.title} width="max-w-3xl">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="space-y-5">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge value={task.status} />
              <Badge type="priority" value={task.priority} />
            </div>
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {task.attachments?.length ? (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-950 dark:text-white">Attachments</h3>
              <div className="space-y-2">
                {task.attachments.map((attachment) => (
                  <a
                    key={attachment._id || attachment.url}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Paperclip className="h-4 w-4" />
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">Comments</h3>
            <form className="mb-4 space-y-2" onSubmit={handleSubmit(onSubmit)}>
              <Textarea label="Add comment" error={errors.content?.message} {...register('content')} />
              <div className="flex justify-end">
                <Button type="submit" icon={MessageSquarePlus} loading={isSubmitting}>
                  Comment
                </Button>
              </div>
            </form>
            <div className="space-y-3">
              {task.comments?.length ? (
                task.comments.map((comment) => (
                  <div key={comment._id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Avatar user={comment.user} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-950 dark:text-white">{comment.user?.name}</p>
                        <p className="text-xs text-slate-400">{fromNow(comment.createdAt)}</p>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  No comments yet
                </p>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-slate-400">Project</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{task.project?.title}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-slate-400">Assignee</p>
            <div className="mt-2 flex items-center gap-2">
              <Avatar user={task.assignedTo} size="sm" />
              <span className="text-sm text-slate-700 dark:text-slate-200">{task.assignedTo?.name}</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-slate-400">Assigned by</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{task.assignedBy?.name}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-slate-400">Due date</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{formatDate(task.dueDate)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-normal text-slate-400">Updated</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">{formatDateTime(task.updatedAt)}</p>
          </div>
        </aside>
      </div>
    </Modal>
  );
};
