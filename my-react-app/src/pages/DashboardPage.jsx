import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  appendStudentRecordFromRow,
  createStudentFromRow,
  deleteStudentFromRow,
  exportStudent,
  fetchStudents,
  patchStudentFromRow,
} from '../api/students.js'
import { DEFAULT_SELECT_FIELDS } from '../constants/studentRecordFieldOptions.js'
import { StudentEditModal } from '../components/StudentEditModal'
import { StudentDeleteModal } from '../components/StudentDeleteModal'
import { StudentRecordsModal } from '../components/StudentRecordsModal'
import { StudentRecordsTable } from '../components/StudentRecordsTable'

const PAGE_SIZE = 10

function matchesSearch(student, query) {
  if (!query) return true
  const q = query.toLowerCase().trim()
  const name = String(student.studentName ?? '').toLowerCase()
  const subject = String(student.subject ?? '').toLowerCase()
  return name.includes(q) || subject.includes(q)
}

function createBlankStudent() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: `new-${Date.now()}`,
    studentName: '',
    abs: false,
    late: false,
    ...DEFAULT_SELECT_FIELDS,
    remarks: '',
    date: today,
  }
}

function formatSaveError(err) {
  const data = err?.response?.data
  if (data == null) return err?.message || 'Could not save the record.'
  if (typeof data === 'string') return data
  if (typeof data.message === 'string') return data.message
  if (typeof data.error === 'string') return data.error
  if (Array.isArray(data.message)) return data.message.join(', ')
  return err?.message || 'Could not save the record.'
}

export function DashboardPage() {
  const [summaryRows, setSummaryRows] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [recordsModal, setRecordsModal] = useState(null)

  async function refreshStudentLists() {
    const payload = await fetchStudents()
    if (payload?.summaryRows) {
      setSummaryRows(payload.summaryRows)
    }
  }

  useEffect(() => {
    let cancelled = false
    fetchStudents()
      .then((payload) => {
        if (cancelled || !payload?.summaryRows) return
        setSummaryRows(payload.summaryRows)
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('[students] Failed to load from API.', err)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredSummary = useMemo(
    () => summaryRows.filter((s) => matchesSearch(s, searchQuery)),
    [summaryRows, searchQuery],
  )

  const totalPages = Math.max(1, Math.ceil(filteredSummary.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)

  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageRows = filteredSummary.slice(pageStart, pageStart + PAGE_SIZE)

  function handleOpenDelete(row) {
    setEditTarget(null)
    setRecordsModal(null)
    setDeleteTarget(row)
  }

  function handleCloseDelete() {
    setDeleteTarget(null)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    const uiRowId = deleteTarget.id
    try {
      await toast.promise(
        (async () => {
          await deleteStudentFromRow(deleteTarget)
          await refreshStudentLists()
        })(),
        {
          loading: 'Deleting…',
          success: 'Record deleted',
          error: (err) => formatSaveError(err),
        },
      )
    } catch {
      return
    }
    setEditTarget((t) => (t && t.id === uiRowId ? null : t))
    setDeleteTarget(null)
  }

  function handleOpenAdd() {
    setDeleteTarget(null)
    setRecordsModal(null)
    setEditTarget(createBlankStudent())
  }

  function handleOpenEdit(row) {
    setDeleteTarget(null)
    setRecordsModal(null)
    setEditTarget(row)
  }

  function handleOpenStudentRecords(row) {
    setEditTarget(null)
    setDeleteTarget(null)
    if (row.studentApiId == null || row.studentApiId === '') return
    setRecordsModal({
      studentId: row.studentApiId,
      studentName: row.studentName,
    })
  }

  async function handleSaveStudent(updated) {
    const isNewStudent = String(updated.id).startsWith('new-')
    const isCopiedRowAppend =
      String(updated.id).startsWith('copy-') &&
      updated.studentApiId != null &&
      updated.studentApiId !== ''

    if (isNewStudent) {
      try {
        await toast.promise(
          (async () => {
            await createStudentFromRow(updated)
            await refreshStudentLists()
          })(),
          {
            loading: 'Adding record…',
            success: 'Record added successfully',
            error: (err) => formatSaveError(err),
          },
        )
      } catch {
        return
      }
    } else if (isCopiedRowAppend) {
      try {
        await toast.promise(
          (async () => {
            await appendStudentRecordFromRow(updated)
            await refreshStudentLists()
          })(),
          {
            loading: 'Adding record…',
            success: 'Record added to student',
            error: (err) => formatSaveError(err),
          },
        )
      } catch {
        return
      }
    } else {
      try {
        await toast.promise(
          (async () => {
            await patchStudentFromRow(updated)
            await refreshStudentLists()
          })(),
          {
            loading: 'Saving changes…',
            success: 'Record updated',
            error: (err) => formatSaveError(err),
          },
        )
      } catch {
        return
      }
    }
    setEditTarget(null)
    setRecordsModal(null)
  }

  function handleDownloadExport(row) {
    const sid = row.studentApiId
    if (sid == null || sid === '') {
      toast.error('Cannot export: missing student id.')
      return
    }
    void toast.promise(exportStudent(sid), {
      loading: 'Preparing download…',
      success: 'Download started',
      error: (err) => formatSaveError(err),
    })
  }

  function handleCloseEdit() {
    setEditTarget(null)
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-emerald-950">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review student records, attendance notes, and classroom performance.
        </p>
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-emerald-200/70 bg-white shadow-md shadow-emerald-100/50 ring-1 ring-emerald-50">
        <div className="flex shrink-0 flex-col gap-4 border-b border-emerald-100/80 p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-4 sm:gap-y-3 sm:p-5">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-emerald-950">Student records</h3>
            <p className="text-sm text-slate-500">
              {filteredSummary.length} student
              {filteredSummary.length !== 1 ? 's' : ''} match your filters.
              <span className="mt-1 block text-xs text-slate-400">
                Click a row to see every daily record for that student; duplicate from there.
              </span>
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:min-w-0 sm:flex-1 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-300/40 transition hover:bg-emerald-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add record
            </button>
            <label className="relative min-w-0 w-full flex-1 sm:min-w-[18rem] md:min-w-[24rem] lg:min-w-[32rem]">
              <span className="sr-only">Search by student name or subject</span>
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by student name or subject…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <StudentRecordsTable
            rows={pageRows}
            onRowClick={handleOpenStudentRecords}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onDownload={handleDownloadExport}
            emptyMessage="No students match your search. Try a different name or subject."
          />
        </div>
        {filteredSummary.length > 0 ? (
          <div className="flex shrink-0 flex-col items-stretch justify-between gap-3 border-t border-emerald-100 bg-gradient-to-r from-emerald-50/98 via-green-50/90 to-teal-50/95 p-4 shadow-[0_-8px_24px_-12px_rgba(6,95,70,0.18)] backdrop-blur-sm sm:flex-row sm:items-center sm:px-5">
            <p className="text-sm text-slate-600">
              Page <span className="font-semibold text-emerald-800">{safePage}</span> of{' '}
              <span className="font-semibold text-emerald-800">{totalPages}</span>
              <span className="mx-2 text-emerald-200">·</span>
              Showing {pageStart + 1}–
              {Math.min(pageStart + PAGE_SIZE, filteredSummary.length)} of{' '}
              <span className="font-medium text-teal-800">{filteredSummary.length}</span>
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(safePage - 1)}
                className="rounded-lg border border-emerald-200/90 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
                className="rounded-lg border border-teal-200/90 bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>

      {recordsModal ? (
        <StudentRecordsModal
          key={String(recordsModal.studentId)}
          studentId={recordsModal.studentId}
          studentName={recordsModal.studentName}
          onClose={() => setRecordsModal(null)}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      ) : null}

      {editTarget ? (
        <StudentEditModal
          key={editTarget.id}
          student={editTarget}
          onClose={handleCloseEdit}
          onSave={handleSaveStudent}
        />
      ) : null}

      {deleteTarget ? (
        <StudentDeleteModal
          key={deleteTarget.id}
          student={deleteTarget}
          onClose={handleCloseDelete}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  )
}
