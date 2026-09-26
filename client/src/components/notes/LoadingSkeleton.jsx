import React from 'react';

export default function LoadingSkeleton({ type = 'card', count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {Array.from({ length: count }, (_, idx) => (
        <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="h-11 w-11 rounded-xl bg-slate-200" />
            <div className="h-5 w-16 rounded-md bg-slate-200" />
          </div>
          <div className="h-5 w-3/4 rounded-md bg-slate-200 mb-2" />
          <div className="h-3 w-full rounded-md bg-slate-100 mb-1" />
          <div className="h-3 w-4/5 rounded-md bg-slate-100 mb-4" />
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-4 w-14 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
