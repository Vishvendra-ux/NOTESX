import React from 'react';
import { ChevronRight, Home, GraduationCap, BookOpen, Layers, Calendar, FileText } from 'lucide-react';

export default function BreadcrumbNav({
  category,
  course,
  branch,
  year,
  semester,
  subject,
  note,
  onNavigate
}) {
  const items = [
    { label: 'All Courses', level: 'root', icon: Home, active: !category && !course && !branch }
  ];

  if (category) {
    items.push({
      label: category.name || category,
      level: 'category',
      icon: GraduationCap,
      active: !course && !branch
    });
  }

  if (course) {
    items.push({
      label: course.name || course,
      level: 'course',
      icon: Layers,
      active: !branch
    });
  }

  if (branch) {
    items.push({
      label: branch.shortCode || branch.name || branch,
      fullName: branch.name,
      level: 'branch',
      icon: BookOpen,
      active: !year && !semester && !subject
    });
  }

  if (year) {
    items.push({
      label: typeof year === 'object' ? year.name : `${year}${typeof year === 'number' ? (year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th') + ' Year' : ''}`,
      level: 'year',
      icon: Calendar,
      active: !semester && !subject
    });
  }

  if (semester) {
    items.push({
      label: typeof semester === 'object' ? semester.name : `Semester ${semester}`,
      level: 'semester',
      icon: Calendar,
      active: !subject
    });
  }

  if (subject) {
    items.push({
      label: typeof subject === 'object' ? subject.name : subject,
      level: 'subject',
      icon: FileText,
      active: !note
    });
  }

  if (note) {
    items.push({
      label: typeof note === 'object' ? (note.title.length > 28 ? note.title.slice(0, 28) + '...' : note.title) : note,
      level: 'note',
      icon: FileText,
      active: true
    });
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto py-1 scrollbar-hide">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={13} className="text-slate-400 shrink-0" />}
            {isLast ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-indigo-700 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-100/80 shadow-2xs">
                {Icon && <Icon size={12} className="text-indigo-600" />}
                <span title={item.fullName || item.label}>{item.label}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(item.level)}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80 px-2 py-1 rounded-lg transition"
                title={item.fullName || item.label}
              >
                {Icon && <Icon size={12} className="text-slate-400" />}
                <span>{item.label}</span>
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
