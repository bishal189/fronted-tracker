import { useEffect, useId, useState } from 'react'
import toast from 'react-hot-toast'
import { exportStudent, fetchStudents } from '../api/students.js'
import { isIsoDateOnly } from '../lib/recordDate.js'
import { StudentRecordsTable } from './StudentRecordsTable'

function dateOnly(value) {
  const s = String(value ?? '').trim()
  return isIsoDateOnly(s) ? s : ''
}

function recordDate(row) {
  return dateOnly(row.date)
}

function formatExportError(err) {
  const data = err?.response?.data
  if (data == null) return err?.message || 'Could not export.'
  if (typeof data === 'string') return data
  if (typeof data.message === 'string') return data.message
  if (typeof data.error === 'string') return data.error
  if (Array.isArray(data.message)) return data.message.join(', ')
  return err?.message || 'Could not export.'
}

const dateInputClassName =
  'rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-50'

export function StudentRecordsModal({ studentId, studentName, onClose, onEdit, onDelete }) {
  const titleId = useId()
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ac = new AbortController()
    const sid = String(studentId)
    const from = dateOnly(filterFrom)
    const to = dateOnly(filterTo)

    /* eslint-disable react-hooks/set-state-in-effect -- align UI with in-flight GET /students */
    setLoading(true)
    setError(null)
    /* eslint-enable react-hooks/set-state-in-effect */

    fetchStudents({
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      signal: ac.signal,
    })
      .then((payload) => {
        if (!payload?.recordRows) {
          setRecords([])
          return
        }
        setRecords(payload.recordRows.filter((r) => String(r.studentApiId) === sid))
      })
      .catch((err) => {
        if (err?.code === 'ERR_CANCELED' || ac.signal.aborted) return
        setError(err?.message || 'Could not load records.')
        setRecords([])
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false)
      })

    return () => ac.abort()
  }, [studentId, filterFrom, filterTo])

  function handleRowClickInModal(row) {
    const d = recordDate(row)
    if (!d) return
    setFilterFrom(d)
    setFilterTo(d)
  }

  function clearDateFilter() {
    setFilterFrom('')
    setFilterTo('')
  }

  function handleModalDownload() {
    const sid = studentId != null ? String(studentId).trim() : ''
    if (!sid) {
      toast.error('Cannot export: missing student id.')
      return
    }
    const from = dateOnly(filterFrom)
    const to = dateOnly(filterTo)
    void toast.promise(exportStudent(sid, { ...(from ? { from } : {}), ...(to ? { to } : {}) }), {
      loading: 'Preparing download…',
      success: 'Download started',
      error: (err) => formatExportError(err),
    })
  }

  function handleDuplicateRow(row) {
    const newId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `copy-${crypto.randomUUID()}`
        : `copy-${row.id}-${Date.now()}`
    const replica = { ...row, id: newId, recordApiId: undefined }
    setRecords((prev) => {
      const idx = prev.findIndex((s) => s.id === row.id)
      if (idx === -1) return [...prev, replica]
      return [...prev.slice(0, idx + 1), replica, ...prev.slice(idx + 1)]
    })
  }

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

  const hasActiveFilter = Boolean(dateOnly(filterFrom) || dateOnly(filterTo))

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
              {loading ? (
                <>Loading records…</>
              ) : error ? (
                <span className="text-rose-700">{error}</span>
              ) : hasActiveFilter ? (
                <>
                  {records.length} record{records.length !== 1 ? 's' : ''} in the selected date range (from the
                  server).
                </>
              ) : (
                <>
                  {records.length} record{records.length !== 1 ? 's' : ''} for this student.
                </>
              )}
              <span className="mt-0.5 block text-xs text-slate-500">
                Duplicate adds a draft row—open Edit and save to append it via the server.
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

        <div className="shrink-0 border-b border-emerald-100/80 bg-slate-50/90 px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
              <label className="flex min-w-0 flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">From</span>
                <input
                  type="date"
                  value={filterFrom}
                  onChange={(e) => setFilterFrom(e.target.value)}
                  disabled={loading}
                  className={dateInputClassName}
                />
              </label>
              <label className="flex min-w-0 flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">To</span>
                <input
                  type="date"
                  value={filterTo}
                  onChange={(e) => setFilterTo(e.target.value)}
                  disabled={loading}
                  className={dateInputClassName}
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={handleModalDownload}
                disabled={loading}
                title={
                  hasActiveFilter
                    ? 'Download export for the selected From / To range'
                    : 'Download full export (no date filter)'
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-teal-200 bg-white px-3 py-2 text-sm font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download
              </button>
              {hasActiveFilter ? (
                <button
                  type="button"
                  onClick={clearDateFilter}
                  disabled={loading}
                  className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 disabled:opacity-50"
                >
                  Clear range
                </button>
              ) : null}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Click a row to set From and To to that record&apos;s date and reload from the server. Adjust the dates to
            widen the range. Download sends the same From / To to the export URL (leave both empty for a full export).
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-2 sm:p-4">
          <div className="overflow-hidden rounded-xl border border-emerald-200/60 bg-white shadow-sm ring-1 ring-emerald-50/80">
            {loading ? (
              <div className="px-4 py-12 text-center text-sm text-slate-500">Loading…</div>
            ) : (
              <StudentRecordsTable
                rows={records}
                onRowClick={handleRowClickInModal}
                rowClickTitle="Set date filter to this row's date (when date is YYYY-MM-DD)"
                onEdit={onEdit}
                onDelete={onDelete}
                onCopy={handleDuplicateRow}
                showDownload={false}
                emptyMessage={
                  error
                    ? 'Could not load records. Try again or adjust the date range.'
                    : hasActiveFilter
                      ? 'No records in this date range from the server. Try widening From / To or clear the filter.'
                      : 'No records for this student.'
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
