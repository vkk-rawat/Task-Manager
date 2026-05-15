import { useEffect } from 'react';

export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Team Task Manager`;
  }, [title]);
};
