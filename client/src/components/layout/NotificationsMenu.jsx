import { Bell, CheckCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useSocket } from '../../contexts/SocketContext';
import { api, getErrorMessage } from '../../services/api';
import { fromNow } from '../../utils/formatters';
import { Button } from '../ui/Button';

export const NotificationsMenu = () => {
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const unread = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data.notifications);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) {
      return undefined;
    }

    const onNotification = (notification) => {
      setNotifications((current) => [notification, ...current].slice(0, 30));
      toast.info(notification.title);
    };

    socket.on('notification:new', onNotification);

    return () => {
      socket.off('notification:new', onNotification);
    };
  }, [socket]);

  const markAllRead = async () => {
    await api.patch('/notifications/read-all');
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        icon={Bell}
        onClick={() => setOpen((current) => !current)}
        aria-label="Notifications"
      />
      {unread ? (
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
      ) : null}
      {open ? (
        <div className="absolute right-0 top-12 z-20 w-80 rounded-lg border border-slate-200 bg-white shadow-panel dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Notifications</h3>
            <Button variant="ghost" size="sm" icon={CheckCheck} onClick={markAllRead}>
              Read
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification._id}
                  to={notification.link || '/dashboard'}
                  className="block border-b border-slate-100 px-4 py-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-1 h-2 w-2 rounded-full ${notification.read ? 'bg-slate-300' : 'bg-emerald-500'}`} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                      <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{notification.message}</p>
                      <p className="mt-1 text-xs text-slate-400">{fromNow(notification.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
