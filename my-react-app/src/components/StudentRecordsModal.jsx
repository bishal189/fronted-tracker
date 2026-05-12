import { useEffect, useId } from 'react'
import { StudentRecordsTable } from './StudentRecordsTable'

export function StudentRecordsModal({ studentName, records, onClose, onEdit, onDelete, onCopy }) {
  const titleId = useId()

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-[min(1200px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-2xl shadow-slate-900/15"
      >
        <div className="relative flex shrink-0 items-start justify-between gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 px-4 py-3 sm:px-5">
          <div className="min-w-0 pr-8">
            <h2 id={titleId} className="truncate text-lg font-semibold tracking-tight text-emerald-950">
              {studentName}
            </h2>
            <p className="text-sm text-slate-600">
              {records.length} record{records.length !== 1 ? 's' : ''} for this student.
              <span className="mt-0.5 block text-xs text-slate-500">
                Use the duplicate icon to copy a row into the main list.
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-2 text-slate-500 transition hover:bg-white/80 hover:text-slate-800 sm:right-4 sm:top-3.5"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-2 sm:p-4">
          <div className="overflow-hidden rounded-xl border border-emerald-200/60 bg-white shadow-sm ring-1 ring-emerald-50/80">
            <StudentRecordsTable
              rows={records}
              onEdit={onEdit}
              onDelete={onDelete}
              onCopy={onCopy}
              emptyMessage="No records for this student."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
