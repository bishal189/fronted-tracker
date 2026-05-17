const ISO_DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})/
const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

/** Display value for recordDate / createdAt from the API (ISO or localized e.g. BS). */
export function formatRecordDate(value) {
  if (value == null) return ''
  const s = String(value).trim()
  if (!s) return ''

  const iso = ISO_DATE_PREFIX.exec(s)
  if (iso) return iso[1]

  const parsed = Date.parse(s)
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  return s
}

export function isIsoDateOnly(value) {
  return ISO_DATE_ONLY.test(String(value ?? '').trim())
}

/** For sorting records: ISO timestamps first, else stable order by record id. */
export function recordDateSortKey(record) {
  if (!record || typeof record !== 'object') return -Infinity
  const raw = record.recordDate ?? record.createdAt
  if (raw == null) return -Infinity

  const s = String(raw).trim()
  const iso = ISO_DATE_PREFIX.exec(s)
  if (iso) {
    const t = Date.parse(iso[1])
    if (!Number.isNaN(t)) return t
  }

  const t = Date.parse(s)
  if (!Number.isNaN(t)) return t

  const id = Number(record.id)
  return Number.isNaN(id) ? -Infinity : id
}
