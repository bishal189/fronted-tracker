import { useMemo, useState } from 'react'
import { StudentEditModal } from '../components/StudentEditModal'
import { StudentDeleteModal } from '../components/StudentDeleteModal'
import { StudentRecordsModal } from '../components/StudentRecordsModal'
import { StudentRecordsTable } from '../components/StudentRecordsTable'

const PAGE_SIZE = 10

/** Sample records — realistic mix of classes, subjects, and outcomes */
const INITIAL_STUDENTS = [
  {
    id: 's1',
    studentName: 'Aisha Rahman',
    subject: 'Mathematics',
    studentClass: '9',
    section: 'A',
    abs: 1,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'Strong problem-solving.',
    date: '2026-05-02',
  },
  {
    id: 's2',
    studentName: 'Marcus Chen',
    subject: 'Science',
    studentClass: '10',
    section: 'B',
    abs: 0,
    late: 2,
    material: 'Partial',
    classwork: 'Late',
    homework: 'Pending',
    behaviour: 'Good',
    participation: 'Moderate',
    remarks: 'Lab notes need detail.',
    date: '2026-05-03',
  },
  {
    id: 's3',
    studentName: 'Sofia Alvarez',
    subject: 'English',
    studentClass: '8',
    section: 'C',
    abs: 2,
    late: 1,
    material: 'Missing',
    classwork: 'Incomplete',
    homework: 'Late',
    behaviour: 'Needs support',
    participation: 'Low',
    remarks: 'Parent meeting suggested.',
    date: '2026-05-01',
  },
  {
    id: 's4',
    studentName: 'James Okafor',
    subject: 'History',
    studentClass: '11',
    section: 'A',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'Great essay outline.',
    date: '2026-05-04',
  },
  {
    id: 's5',
    studentName: 'Emily Watson',
    subject: 'Mathematics',
    studentClass: '9',
    section: 'B',
    abs: 3,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'Partial',
    behaviour: 'Good',
    participation: 'Moderate',
    remarks: 'Attendance affecting progress.',
    date: '2026-04-28',
  },
  {
    id: 's6',
    studentName: 'Liam Murphy',
    subject: 'Physical Education',
    studentClass: '10',
    section: 'A',
    abs: 0,
    late: 1,
    material: 'N/A',
    classwork: 'Participated',
    homework: 'N/A',
    behaviour: 'Excellent',
    participation: 'Very high',
    remarks: 'Team captain material.',
    date: '2026-05-02',
  },
  {
    id: 's7',
    studentName: 'Priya Nair',
    subject: 'Biology',
    studentClass: '11',
    section: 'B',
    abs: 1,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'Outstanding diagrams.',
    date: '2026-05-05',
  },
  {
    id: 's8',
    studentName: 'Noah Williams',
    subject: 'Chemistry',
    studentClass: '10',
    section: 'C',
    abs: 0,
    late: 3,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'Late',
    behaviour: 'Fair',
    participation: 'Moderate',
    remarks: 'Tardiness recurring.',
    date: '2026-05-03',
  },
  {
    id: 's9',
    studentName: 'Hana Kim',
    subject: 'Art',
    studentClass: '8',
    section: 'A',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'Portfolio exceptional.',
    date: '2026-05-06',
  },
  {
    id: 's10',
    studentName: 'Diego Morales',
    subject: 'Spanish',
    studentClass: '9',
    section: 'C',
    abs: 1,
    late: 1,
    material: 'Partial',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Good',
    participation: 'Active',
    remarks: 'Oral skills improving.',
    date: '2026-05-01',
  },
  {
    id: 's11',
    studentName: 'Olivia Brooks',
    subject: 'English',
    studentClass: '10',
    section: 'A',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'Debate club standout.',
    date: '2026-05-04',
  },
  {
    id: 's12',
    studentName: 'Ethan Park',
    subject: 'Physics',
    studentClass: '11',
    section: 'A',
    abs: 2,
    late: 0,
    material: 'Missing',
    classwork: 'Incomplete',
    homework: 'Pending',
    behaviour: 'Good',
    participation: 'Low',
    remarks: 'Catch-up plan in place.',
    date: '2026-04-30',
  },
  {
    id: 's13',
    studentName: 'Zara Ahmed',
    subject: 'Geography',
    studentClass: '9',
    section: 'B',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'GIS project leader.',
    date: '2026-05-05',
  },
  {
    id: 's14',
    studentName: 'Lucas Schmidt',
    subject: 'Mathematics',
    studentClass: '8',
    section: 'B',
    abs: 0,
    late: 1,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Good',
    participation: 'Moderate',
    remarks: 'Algebra quiz improved.',
    date: '2026-05-02',
  },
  {
    id: 's15',
    studentName: 'Maya Thompson',
    subject: 'Music',
    studentClass: '10',
    section: 'B',
    abs: 1,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'First chair clarinet.',
    date: '2026-05-03',
  },
  {
    id: 's16',
    studentName: 'Ben Carter',
    subject: 'Computer Science',
    studentClass: '11',
    section: 'C',
    abs: 0,
    late: 2,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'Late',
    behaviour: 'Good',
    participation: 'High',
    remarks: 'Strong Python basics.',
    date: '2026-05-06',
  },
  {
    id: 's17',
    studentName: 'Chloe Martin',
    subject: 'French',
    studentClass: '9',
    section: 'A',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'Pronunciation excellent.',
    date: '2026-05-04',
  },
  {
    id: 's18',
    studentName: 'Ryan Foster',
    subject: 'Economics',
    studentClass: '12',
    section: 'A',
    abs: 4,
    late: 1,
    material: 'Partial',
    classwork: 'Late',
    homework: 'Pending',
    behaviour: 'Fair',
    participation: 'Low',
    remarks: 'Senior year focus needed.',
    date: '2026-04-27',
  },
  {
    id: 's19',
    studentName: 'Nina Petrov',
    subject: 'Literature',
    studentClass: '10',
    section: 'C',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'Poetry analysis top tier.',
    date: '2026-05-05',
  },
  {
    id: 's20',
    studentName: 'Samir Haddad',
    subject: 'Mathematics',
    studentClass: '11',
    section: 'B',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Very high',
    remarks: 'Peer tutor candidate.',
    date: '2026-05-06',
  },
  {
    id: 's21',
    studentName: 'Grace Liu',
    subject: 'Science',
    studentClass: '8',
    section: 'A',
    abs: 1,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Good',
    participation: 'Active',
    remarks: 'Curious in lab.',
    date: '2026-05-02',
  },
  {
    id: 's22',
    studentName: 'Victor Silva',
    subject: 'History',
    studentClass: '9',
    section: 'B',
    abs: 0,
    late: 1,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Good',
    participation: 'Moderate',
    remarks: 'Primary sources well used.',
    date: '2026-05-03',
  },
  {
    id: 's23',
    studentName: 'Amelia Rossi',
    subject: 'Biology',
    studentClass: '10',
    section: 'A',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'Dissection technique careful.',
    date: '2026-05-04',
  },
  {
    id: 's24',
    studentName: 'Kai Tanaka',
    subject: 'Chemistry',
    studentClass: '11',
    section: 'A',
    abs: 1,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'Partial',
    behaviour: 'Good',
    participation: 'Moderate',
    remarks: 'Stoichiometry improving.',
    date: '2026-05-01',
  },
  {
    id: 's25',
    studentName: 'Isabella Costa',
    subject: 'English',
    studentClass: '12',
    section: 'B',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'Active',
    remarks: 'College essay draft strong.',
    date: '2026-05-06',
  },
  {
    id: 's26',
    studentName: 'Daniel Okonkwo',
    subject: 'Mathematics',
    studentClass: '10',
    section: 'C',
    abs: 0,
    late: 4,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'Late',
    behaviour: 'Fair',
    participation: 'Moderate',
    remarks: 'Punctuality goal set.',
    date: '2026-05-03',
  },
  {
    id: 's27',
    studentName: 'Elena Popescu',
    subject: 'Art',
    studentClass: '9',
    section: 'A',
    abs: 0,
    late: 0,
    material: 'Complete',
    classwork: 'Submitted',
    homework: 'On time',
    behaviour: 'Excellent',
    participation: 'High',
    remarks: 'Sculpture selected for exhibit.',
    date: '2026-05-05',
  },
  {
    id: 's28',
    studentName: 'Henry Doyle',
    subject: 'Geography',
    studentClass: '8',
    section: 'C',
    abs: 2,
    late: 1,
    material: 'Partial',
    classwork: 'Incomplete',
    homework: 'Pending',
    behaviour: 'Needs support',
    participation: 'Low',
    remarks: 'Check-in with counselor.',
    date: '2026-04-29',
  },
]

function matchesSearch(student, query) {
  if (!query) return true
  const q = query.toLowerCase().trim()
  const name = student.studentName.toLowerCase()
  const subject = student.subject.toLowerCase()
  return name.includes(q) || subject.includes(q)
}

function createBlankStudent() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    id: `new-${Date.now()}`,
    studentName: '',
    subject: '',
    studentClass: '',
    section: '',
    abs: '',
    late: '',
    material: '',
    classwork: '',
    homework: '',
    behaviour: '',
    participation: '',
    remarks: '',
    date: today,
  }
}

export function DashboardPage() {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [userRecordsName, setUserRecordsName] = useState(null)

  const studentRecordsForModal = useMemo(() => {
    if (!userRecordsName) return []
    return students.filter((s) => s.studentName === userRecordsName)
  }, [students, userRecordsName])

  const filteredStudents = useMemo(
    () => students.filter((s) => matchesSearch(s, searchQuery)),
    [students, searchQuery],
  )

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)

  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageRows = filteredStudents.slice(pageStart, pageStart + PAGE_SIZE)

  function handleOpenDelete(row) {
    setEditTarget(null)
    setUserRecordsName(null)
    setDeleteTarget(row)
  }

  function handleCloseDelete() {
    setDeleteTarget(null)
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    setStudents((prev) => prev.filter((s) => s.id !== id))
    setEditTarget((t) => (t && t.id === id ? null : t))
    setDeleteTarget(null)
  }

  function handleOpenAdd() {
    setDeleteTarget(null)
    setUserRecordsName(null)
    setEditTarget(createBlankStudent())
  }

  function handleOpenEdit(row) {
    setDeleteTarget(null)
    setUserRecordsName(null)
    setEditTarget(row)
  }

  function handleOpenStudentRecords(row) {
    setEditTarget(null)
    setDeleteTarget(null)
    setUserRecordsName(row.studentName)
  }

  function handleCopyRow(row) {
    const newId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? `copy-${crypto.randomUUID()}`
        : `copy-${row.id}-${Date.now()}`
    const replica = { ...row, id: newId }
    setStudents((prev) => {
      const idx = prev.findIndex((s) => s.id === row.id)
      if (idx === -1) return [...prev, replica]
      return [...prev.slice(0, idx + 1), replica, ...prev.slice(idx + 1)]
    })
  }

  function handleSaveStudent(updated) {
    const isNew = String(updated.id).startsWith('new-')
    if (isNew) {
      const newId =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? `s-${crypto.randomUUID()}`
          : `s-${Date.now()}`
      setStudents((prev) => [...prev, { ...updated, id: newId }])
    } else {
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    }
    setEditTarget(null)
    setUserRecordsName(null)
  }

  function handleCloseEdit() {
    setEditTarget(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-emerald-950">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review student records, attendance notes, and classroom performance.
        </p>
      </div>

      <section className="flex flex-1 flex-col overflow-hidden rounded-xl border border-emerald-200/70 bg-white shadow-md shadow-emerald-100/50 ring-1 ring-emerald-50">
        <div className="flex flex-col gap-4 border-b border-emerald-100/80 p-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-4 sm:gap-y-3 sm:p-5">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-emerald-950">Student records</h3>
            <p className="text-sm text-slate-500">
              {filteredStudents.length} record
              {filteredStudents.length !== 1 ? 's' : ''} match your filters.
              <span className="mt-1 block text-xs text-slate-400">
                Click a row to open every record for that student; duplicate rows from there.
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
                placeholder="Try a name (e.g. Aisha Rahman) or a subject (e.g. Mathematics, Biology)…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          </div>
        </div>

        <StudentRecordsTable
          rows={pageRows}
          onRowClick={handleOpenStudentRecords}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          emptyMessage="No students match your search. Try a different name or subject."
        />
        <div className="flex flex-col items-stretch justify-between gap-3 border-t border-emerald-100 bg-gradient-to-r from-emerald-50/95 via-green-50/80 to-teal-50/90 p-4 sm:flex-row sm:items-center sm:px-5">
          <p className="text-sm text-slate-600">
            Page <span className="font-semibold text-emerald-800">{safePage}</span> of{' '}
            <span className="font-semibold text-emerald-800">{totalPages}</span>
            <span className="mx-2 text-emerald-200">·</span>
            Showing{' '}
            {filteredStudents.length === 0
              ? 0
              : pageStart + 1}
            –
            {Math.min(pageStart + PAGE_SIZE, filteredStudents.length)} of{' '}
            <span className="font-medium text-teal-800">{filteredStudents.length}</span>
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
      </section>

      {userRecordsName ? (
        <StudentRecordsModal
          studentName={userRecordsName}
          records={studentRecordsForModal}
          onClose={() => setUserRecordsName(null)}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onCopy={handleCopyRow}
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
