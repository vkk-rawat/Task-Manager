import { Notification } from '../models/Notification.js';
import { emitToUser } from './socket.service.js';

export const createNotification = async ({
  recipient,
  actor,
  type,
  title,
  message,
  link = ''
}) => {
  if (!recipient || recipient.toString() === actor?.toString()) {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    actor,
    type,
    title,
    message,
    link
  });

  await notification.populate('actor', 'name email avatar role');
  emitToUser(recipient, 'notification:new', notification);

  return notification;
};
