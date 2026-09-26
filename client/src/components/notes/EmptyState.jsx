import React from 'react';
import { BookOpen, Upload } from 'lucide-react';

export default function EmptyState({
  icon: Icon = BookOpen,
  title = 'No notes available yet',
  description = 'Be the first student to upload handwritten notes, previous year question solutions, or assignments for this subject.',
  actionText = 'Upload Notes',
  onAction
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-xs">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-2xs">
        <Icon size={26} />
      </div>
      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary py-2.5 px-5 text-xs font-bold gap-2 shadow-sm shadow-indigo-200"
        >
          <Upload size={14} /> {actionText}
        </button>
      )}
    </div>
  );
}
