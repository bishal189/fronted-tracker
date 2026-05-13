function StudentTableRow({
  row,
  index,
  onRowClick,
  rowClickTitle,
  onEdit,
  onDelete,
  onCopy,
  showDownload = true,
  onDownload,
}) {
  const interactive = Boolean(onRowClick)

  return (
    <tr
      onClick={
        interactive
          ? (e) => {
              if (e.target.closest('button')) return
              onRowClick(row)
            }
          : undefined
      }
      title={interactive ? rowClickTitle || 'View all records for this student' : undefined}
      className={`group transition-colors duration-150 hover:bg-gradient-to-r hover:from-emerald-50 hover:via-green-50 hover:to-teal-50 ${
        index % 2 === 0 ? 'bg-white' : 'bg-emerald-50/45'
      } ${interactive ? 'cursor-pointer' : ''}`}
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
      <td
        className="min-w-[14rem] whitespace-nowrap px-4 py-3 text-right align-middle"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inline-flex flex-nowrap items-center justify-end gap-1.5">
          {showDownload && onDownload ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDownload(row)
              }}
              aria-label="Download export"
              title="Download export"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </button>
          ) : null}
          {onCopy ? (
            <button
              type="button"
              onClick={() => onCopy(row)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              aria-label="Duplicate row"
              title="Duplicate row"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9 9 0 0 1 9 9ZM18.75 10.5h-9.75A1.125 1.125 0 0 1 7.875 9.375v-9.75c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125Z"
                />
              </svg>
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="shrink-0 whitespace-nowrap rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-emerald-300/60 transition hover:bg-emerald-700 hover:shadow-md"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(row)}
            className="shrink-0 whitespace-nowrap rounded-lg bg-rose-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-rose-300/60 transition hover:bg-rose-600 hover:shadow-md"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

export function StudentRecordsTable({
  rows,
  onRowClick,
  rowClickTitle,
  onEdit,
  onDelete,
  onCopy,
  onDownload,
  emptyMessage = 'No records.',
  showDownload = true,
}) {
  return (
    <div className="min-h-0 overflow-x-auto">
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
              Absent
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
            <th className="min-w-[14rem] whitespace-nowrap px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-white/95">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-100/80">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={14} className="px-4 py-12 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <StudentTableRow
                key={row.id}
                row={row}
                index={index}
                onRowClick={onRowClick}
                rowClickTitle={rowClickTitle}
                onEdit={onEdit}
                onDelete={onDelete}
                onCopy={onCopy}
                onDownload={onDownload}
                showDownload={showDownload}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
