import { useMemo, useState } from 'react'

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

export function DashboardPage() {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredStudents = useMemo(
    () => students.filter((s) => matchesSearch(s, searchQuery)),
    [students, searchQuery],
  )

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, currentPage), totalPages)

  const pageStart = (safePage - 1) * PAGE_SIZE
  const pageRows = filteredStudents.slice(pageStart, pageStart + PAGE_SIZE)

  function handleDelete(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  function handleEdit() {
    console.log('edit student')
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
        <div className="flex flex-col gap-4 border-b border-emerald-100/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h3 className="text-base font-semibold text-emerald-950">Student records</h3>
            <p className="text-sm text-slate-500">
              {filteredStudents.length} record
              {filteredStudents.length !== 1 ? 's' : ''} match your filters.
            </p>
          </div>
          <label className="relative w-full sm:max-w-xs">
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
              placeholder="Search name or subject…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-2.5 pl-10 pr-3 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        </div>

        <div className="overflow-x-auto rounded-b-xl">
          <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-[inset_0_-1px_rgba(255,255,255,0.12)]">
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Student Name
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Subject
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Class
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Section
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Abs
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Late
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Material
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Classwork
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Homework
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Behaviour
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Participation
                </th>
                <th className="min-w-[140px] whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Remarks
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Date
                </th>
                <th className="whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-white/95">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-100/80">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-12 text-center text-slate-500">
                    No students match your search. Try a different name or subject.
                  </td>
                </tr>
              ) : (
                pageRows.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`group transition-colors duration-150 hover:bg-gradient-to-r hover:from-emerald-50 hover:via-green-50 hover:to-teal-50 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-emerald-50/45'
                    }`}
                  >
                    <td className="whitespace-nowrap border-l-[3px] border-l-transparent px-4 py-3 font-semibold text-emerald-950 group-hover:border-l-emerald-500">
                      {row.studentName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex max-w-[12rem] truncate rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-900 ring-1 ring-green-200/90">
                        {row.subject}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex min-w-[2.25rem] justify-center rounded-lg bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-900 ring-1 ring-emerald-200/90">
                        {row.studentClass}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-lime-950 shadow-sm ring-2 ring-lime-200/90">
                        {row.section}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                      <span
                        className={
                          row.abs > 0
                            ? 'inline-flex min-w-[1.75rem] justify-center rounded-md bg-rose-100 px-2 py-0.5 text-sm font-bold text-rose-700 ring-1 ring-rose-200'
                            : 'text-slate-500'
                        }
                      >
                        {row.abs}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums">
                      <span
                        className={
                          row.late > 0
                            ? 'inline-flex min-w-[1.75rem] justify-center rounded-md bg-orange-100 px-2 py-0.5 text-sm font-bold text-orange-800 ring-1 ring-orange-200'
                            : 'text-slate-500'
                        }
                      >
                        {row.late}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-900 ring-1 ring-emerald-200/80">
                        {row.material}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-teal-100 px-2 py-1 text-xs font-medium text-teal-900 ring-1 ring-teal-200/80">
                        {row.classwork}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-lime-100 px-2 py-1 text-xs font-medium text-lime-900 ring-1 ring-lime-200/80">
                        {row.homework}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-900 ring-1 ring-green-200/80">
                        {row.behaviour}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-900 ring-1 ring-teal-200/80">
                        {row.participation}
                      </span>
                    </td>
                    <td className="max-w-[200px] px-4 py-3 text-slate-700">
                      <span className="line-clamp-2" title={row.remarks}>
                        {row.remarks}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-emerald-200/90">
                        {row.date}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleEdit}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-300/60 transition hover:bg-emerald-700 hover:shadow-md"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id)}
                          className="rounded-lg bg-rose-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-rose-300/60 transition hover:bg-rose-600 hover:shadow-md"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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
    </div>
  )
}
