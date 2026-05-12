import { apiClient } from './client.js'

const RESOURCE = '/students'

function normalizeStudentsResponse(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.students)) return data.students
  if (Array.isArray(data?.items)) return data.items
  if (data && typeof data === 'object' && Array.isArray(data.records)) {
    return [data]
  }
  return []
}

function boolishToCount(value) {
  if (value === true || value === 1) return 1
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  return 0
}

function isoToDateOnly(iso) {
  if (iso == null || typeof iso !== 'string') return ''
  return iso.length >= 10 ? iso.slice(0, 10) : iso
}

function recordSortKey(r) {
  if (!r || typeof r !== 'object') return -Infinity
  const raw = r.recordDate ?? r.createdAt
  if (raw == null) return -Infinity
  const t = Date.parse(String(raw))
  return Number.isNaN(t) ? -Infinity : t
}

/** One flattened row for a student + API record (full list + summary). */
export function mapStudentRecordToRow(s, r, rowIndexForFallbackId) {
  if (!s || typeof s !== 'object' || !r || typeof r !== 'object') return null
  const name = s.name != null ? String(s.name) : ''
  const studentClass = s.class != null ? String(s.class) : ''
  const section = s.section == null || s.section === '' ? '' : String(s.section)
  const subject = s.subject == null || s.subject === '' ? '' : String(s.subject)
  const rid = r.id != null ? r.id : `${s.id}-${rowIndexForFallbackId}`
  return {
    id: `r-${rid}`,
    recordApiId: r.id,
    studentApiId: s.id,
    studentName: name,
    subject,
    studentClass,
    section,
    abs: boolishToCount(r.abs),
    late: boolishToCount(r.late),
    material: r.materials != null ? String(r.materials) : '',
    classwork: r.classwork != null ? String(r.classwork) : '',
    homework: r.homework != null ? String(r.homework) : '',
    behaviour: r.behavior != null ? String(r.behavior) : '',
    participation: r.participation != null ? String(r.participation) : '',
    remarks: r.remarks != null ? String(r.remarks) : '',
    date: isoToDateOnly(r.recordDate),
    action: r.action != null ? String(r.action) : '',
    others: r.others != null ? String(r.others) : '',
  }
}

function pickLatestRecord(records) {
  if (!Array.isArray(records) || records.length === 0) return null
  const valid = records.filter((r) => r && typeof r === 'object')
  if (valid.length === 0) return null
  return [...valid].sort((a, b) => {
    const ka = recordSortKey(a)
    const kb = recordSortKey(b)
    if (kb !== ka) return kb - ka
    const ca = a.createdAt != null ? Date.parse(String(a.createdAt)) : NaN
    const cb = b.createdAt != null ? Date.parse(String(b.createdAt)) : NaN
    if (!Number.isNaN(cb) && !Number.isNaN(ca) && cb !== ca) return cb - ca
    const ida = Number(a.id)
    const idb = Number(b.id)
    if (!Number.isNaN(ida) && !Number.isNaN(idb) && idb !== ida) return idb - ida
    return 0
  })[0]
}

function emptySummaryRowForStudent(s) {
  if (!s || typeof s !== 'object') return null
  const name = s.name != null ? String(s.name) : ''
  const studentClass = s.class != null ? String(s.class) : ''
  const section = s.section == null || s.section === '' ? '' : String(s.section)
  const subject = s.subject == null || s.subject === '' ? '' : String(s.subject)
  const sid = s.id
  return {
    id: `s-${sid}`,
    recordApiId: undefined,
    studentApiId: sid,
    studentName: name,
    subject,
    studentClass,
    section,
    abs: 0,
    late: false,
    material: '',
    classwork: '',
    homework: '',
    behaviour: '',
    participation: '',
    remarks: '',
    date: '',
    action: '',
    others: '',
  }
}

/** One row per student for the main dashboard (latest record by date, or empty row if none). */
export function mapStudentsToSummaryRows(students) {
  if (!Array.isArray(students)) return []
  const rows = []
  for (const s of students) {
    if (!s || typeof s !== 'object') continue
    const records = Array.isArray(s.records) ? s.records : []
    const latest = pickLatestRecord(records)
    if (latest) {
      const base = mapStudentRecordToRow(s, latest, rows.length)
      if (base) rows.push({ ...base, id: `s-${s.id}` })
    } else {
      const empty = emptySummaryRowForStudent(s)
      if (empty) rows.push(empty)
    }
  }
  return rows
}

export function mapNestedStudentsToRows(students) {
  if (!Array.isArray(students)) return []
  const rows = []
  for (const s of students) {
    if (!s || typeof s !== 'object') continue
    const records = Array.isArray(s.records) ? s.records : []
    for (const r of records) {
      if (!r || typeof r !== 'object') continue
      const row = mapStudentRecordToRow(s, r, rows.length)
      if (row) rows.push(row)
    }
  }
  return rows
}

export async function fetchStudents() {
  const { data } = await apiClient.get(RESOURCE)
  const list = normalizeStudentsResponse(data)
  return {
    summaryRows: mapStudentsToSummaryRows(list),
    recordRows: mapNestedStudentsToRows(list),
  }
}

function nullableTrim(value) {
  const t = String(value ?? '').trim()
  return t.length > 0 ? t : null
}

function rowBoolFlag(value) {
  if (value === true || value === 'true') return true
  if (value === false || value === 'false') return false
  const n = Number.parseInt(String(value ?? '0'), 10)
  return !Number.isNaN(n) && n > 0
}

export function rowToCreateStudentBody(row) {
  const sectionRaw = String(row.section ?? '').trim()
  return {
    name: String(row.studentName ?? '').trim(),
    subject: nullableTrim(row.subject),
    class: String(row.studentClass ?? '').trim(),
    section: sectionRaw.length > 0 ? sectionRaw : null,
    absences: rowBoolFlag(row.abs),
    late: rowBoolFlag(row.late),
    material: nullableTrim(row.material),
    behaviour: nullableTrim(row.behaviour),
    classwork: nullableTrim(row.classwork),
    homework: nullableTrim(row.homework),
    participation: nullableTrim(row.participation),
    date: (() => {
      const d = String(row.date ?? '').trim().slice(0, 10)
      return d.length > 0 ? d : null
    })(),
    remarks: nullableTrim(row.remarks),
  }
}

/** Body for POST /students/:id/records — same fields as create except student name (student is in the URL). */
export function rowToAppendRecordBody(row) {
  const body = { ...rowToCreateStudentBody(row) }
  delete body.name
  return body
}

export async function createStudentFromRow(row) {
  const body = rowToCreateStudentBody(row)
  const { data } = await apiClient.post(RESOURCE, body)
  return data
}

/** POST /students/:studentId/records — append a record (does not replace PATCH on the student). */
export async function appendStudentRecordFromRow(row) {
  const sid = row.studentApiId
  if (sid == null || sid === '') {
    const err = new Error('Missing student id for appending a record.')
    throw err
  }
  const body = rowToAppendRecordBody(row)
  const { data } = await apiClient.post(
    `${RESOURCE}/${encodeURIComponent(String(sid))}/records`,
    body,
  )
  return data
}

export async function updateStudent(id, payload) {
  const { data } = await apiClient.patch(
    `${RESOURCE}/${encodeURIComponent(String(id))}`,
    payload,
  )
  return data
}

/** PATCH /students/:id — same body shape as POST. Uses student id in the URL; includes recordId when the row maps to a specific API record. */
export async function patchStudentFromRow(row) {
  const body = rowToCreateStudentBody(row)
  const sid = row.studentApiId
  const rid = row.recordApiId

  if (sid != null && sid !== '') {
    const payload =
      rid != null && rid !== '' && String(sid) !== String(rid) ? { ...body, recordId: rid } : body
    return updateStudent(sid, payload)
  }
  if (rid != null && rid !== '') {
    return updateStudent(rid, body)
  }
  const err = new Error('Missing server id for this record. Refresh the list and try again.')
  throw err
}

export async function deleteStudent(id) {
  await apiClient.delete(`${RESOURCE}/${encodeURIComponent(String(id))}`)
}

/** DELETE /students/:id — prefers record id (one table row), else student id. */
export async function deleteStudentFromRow(row) {
  const id = row.recordApiId ?? row.studentApiId
  if (id == null || id === '') {
    const err = new Error('Missing server id for this record. Refresh the list and try again.')
    throw err
  }
  await deleteStudent(id)
}

function parseFilenameFromContentDisposition(value) {
  if (value == null || typeof value !== 'string') return null
  const utf8 = /filename\*=UTF-8''([^;\s]+)/i.exec(value)
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1])
    } catch {
      return utf8[1]
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(value)
  if (quoted?.[1]) return quoted[1]
  const bare = /filename=([^;\s]+)/i.exec(value)
  if (bare?.[1]) return bare[1].replace(/^"|"$/g, '')
  return null
}

/** GET /students/:id/export — saves response as a file (uses Content-Disposition filename when present). */
export async function exportStudent(studentId) {
  const sid = studentId != null ? String(studentId).trim() : ''
  if (!sid) {
    const err = new Error('Missing student id for export.')
    throw err
  }
  const res = await apiClient.get(`${RESOURCE}/${encodeURIComponent(sid)}/export`, {
    responseType: 'blob',
    timeout: 60_000,
  })
  const blob = res.data
  if (!(blob instanceof Blob)) {
    const err = new Error('Unexpected export response.')
    throw err
  }
  const cd =
    res.headers?.['content-disposition'] ?? res.headers?.['Content-Disposition'] ?? ''
  const filename = parseFilenameFromContentDisposition(cd) || `student-${sid}-export`
  const objectUrl = URL.createObjectURL(blob)
  try {
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = filename
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
