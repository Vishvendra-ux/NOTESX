import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Compass size={32} strokeWidth={1.8} />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mb-8 max-w-md text-slate-500">
        The page you're looking for doesn't exist, was moved, or you don't have access to it.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Back to Home
        </Link>
        <Link
          to="/notes"
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Browse Notes
        </Link>
      </div>
    </div>
  );
}
