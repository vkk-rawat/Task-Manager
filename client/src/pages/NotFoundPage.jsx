import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { usePageTitle } from '../hooks/usePageTitle';

export const NotFoundPage = () => {
  usePageTitle('Not found');

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div>
        <p className="text-sm font-semibold uppercase tracking-normal text-slate-400">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">The page you are looking for does not exist.</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button icon={ArrowLeft}>Back to dashboard</Button>
        </Link>
      </div>
    </main>
  );
};
