import { useEffect, useId, useState } from 'react'

const fieldClass =
  'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200'

const labelClass = 'block text-xs font-medium uppercase tracking-wide text-slate-500'

export function StudentEditModal({ student, onClose, onSave }) {
  const titleId = useId()
  const [draft, setDraft] = useState(() => ({ ...student }))

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

  function patch(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const name = String(draft.studentName ?? '').trim()
    if (!name) return

    const abs = Math.max(0, Number.parseInt(String(draft.abs), 10) || 0)
    const late = Math.max(0, Number.parseInt(String(draft.late), 10) || 0)

    onSave({
      ...draft,
      id: student.id,
      studentName: name,
      subject: String(draft.subject ?? '').trim(),
      studentClass: String(draft.studentClass ?? '').trim(),
      section: String(draft.section ?? '').trim(),
      abs,
      late,
      material: String(draft.material ?? '').trim(),
      classwork: String(draft.classwork ?? '').trim(),
      homework: String(draft.homework ?? '').trim(),
      behaviour: String(draft.behaviour ?? '').trim(),
      participation: String(draft.participation ?? '').trim(),
      remarks: String(draft.remarks ?? '').trim(),
      date: String(draft.date ?? '').trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight text-slate-900">
              Edit record
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Update fields and save — press Esc to cancel.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="edit-name">
                  Student name
                </label>
                <input
                  id="edit-name"
                  required
                  value={draft.studentName}
                  onChange={(e) => patch('studentName', e.target.value)}
                  className={fieldClass}
                  autoComplete="name"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="edit-subject">
                  Subject
                </label>
                <input
                  id="edit-subject"
                  value={draft.subject}
                  onChange={(e) => patch('subject', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-class">
                  Class
                </label>
                <input
                  id="edit-class"
                  value={draft.studentClass}
                  onChange={(e) => patch('studentClass', e.target.value)}
                  className={fieldClass}
                  inputMode="numeric"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-section">
                  Section
                </label>
                <input
                  id="edit-section"
                  value={draft.section}
                  onChange={(e) => patch('section', e.target.value)}
                  className={fieldClass}
                  maxLength={4}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-abs">
                  Absences
                </label>
                <input
                  id="edit-abs"
                  type="number"
                  min={0}
                  value={draft.abs}
                  onChange={(e) => patch('abs', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-late">
                  Late
                </label>
                <input
                  id="edit-late"
                  type="number"
                  min={0}
                  value={draft.late}
                  onChange={(e) => patch('late', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-material">
                  Material
                </label>
                <input
                  id="edit-material"
                  value={draft.material}
                  onChange={(e) => patch('material', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-behaviour">
                  Behaviour
                </label>
                <input
                  id="edit-behaviour"
                  value={draft.behaviour}
                  onChange={(e) => patch('behaviour', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-classwork">
                  Classwork
                </label>
                <input
                  id="edit-classwork"
                  value={draft.classwork}
                  onChange={(e) => patch('classwork', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="edit-homework">
                  Homework
                </label>
                <input
                  id="edit-homework"
                  value={draft.homework}
                  onChange={(e) => patch('homework', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="edit-participation">
                  Participation
                </label>
                <input
                  id="edit-participation"
                  value={draft.participation}
                  onChange={(e) => patch('participation', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="edit-date">
                  Date
                </label>
                <input
                  id="edit-date"
                  type="date"
                  value={draft.date}
                  onChange={(e) => patch('date', e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="edit-remarks">
                  Remarks
                </label>
                <textarea
                  id="edit-remarks"
                  rows={3}
                  value={draft.remarks}
                  onChange={(e) => patch('remarks', e.target.value)}
                  className={`${fieldClass} min-h-[5rem] resize-y`}
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
