import { format, formatDistanceToNowStrict, isPast, parseISO } from 'date-fns';

export const formatDate = (date, fallback = 'No date') => {
  if (!date) {
    return fallback;
  }

  return format(new Date(date), 'MMM d, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) {
    return '';
  }

  return format(new Date(date), 'MMM d, yyyy, h:mm a');
};

export const fromNow = (date) => {
  if (!date) {
    return '';
  }

  return `${formatDistanceToNowStrict(new Date(date))} ago`;
};

export const isPastDue = (date, status) => {
  if (!date || status === 'Completed') {
    return false;
  }

  return isPast(parseISO(date));
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
