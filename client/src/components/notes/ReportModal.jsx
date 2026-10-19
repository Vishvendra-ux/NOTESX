import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Flag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { notesService } from '../../services/api';

export default function ReportModal({ isOpen, onClose, note }) {
  const [reason, setReason] = useState('Incorrect content');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !note) return null;

  const reasons = [
    'Incorrect content',
    'Copyright issue',
    'Spam',
    'Duplicate',
    'Inappropriate content',
    'Malicious file',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      await notesService.report(note._id || note.id, { reason, details });
      setSuccess('Report submitted. Our moderation team will investigate this note.');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-slide-up border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600">
            <Flag size={18} />
            <h3 className="text-base font-extrabold text-slate-900">Report Note</h3>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close modal"
            title="Close (Esc)"
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition flex items-center justify-center cursor-pointer border border-slate-200 hover:border-rose-200"
          >
            <X size={16} className="stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <p className="text-xs text-slate-500">
            Help us maintain academic integrity on NOTESX by flagging inaccurate or problematic uploads.
          </p>

          {error && <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl">{error}</p>}
          {success && <p className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl">{success}</p>}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field py-2 text-xs font-semibold"
            >
              {reasons.map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional Details (Optional)</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any specific links, page numbers, or explanations..."
              className="input-field py-2 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-1.5 px-4 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary py-1.5 px-5 text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
