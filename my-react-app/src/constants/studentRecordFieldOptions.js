export const CLASS_OPTIONS = ['6', '7', '8', '9', '10']

export const SECTION_OPTIONS = ['A', 'B', 'C']

export const SUBJECT_OPTIONS = [
  'English',
  'Nepali',
  'Opt Maths',
  'Compulsory Maths',
  'Economics',
  'Samajik',
  'Computer',
  'Gyanmala',
  'Byakaran',
  'Science',
  'HPE',
  'Account',
  'Grammar',
]

export const MATERIAL_OPTIONS = ['Complete', 'Partial', 'Missing', 'N/A']

export const BEHAVIOUR_OPTIONS = ['Excellent', 'Good', 'Fair', 'Needs support']

export const CLASSWORK_OPTIONS = ['Submitted', 'Late', 'Incomplete', 'Participated', 'N/A']

export const HOMEWORK_OPTIONS = ['On time', 'Late', 'Pending', 'Partial', 'N/A']

export const PARTICIPATION_OPTIONS = ['Active', 'Moderate', 'Low', 'High', 'Very high']

export const DEFAULT_SELECT_FIELDS = {
  studentClass: CLASS_OPTIONS[0],
  section: SECTION_OPTIONS[0],
  subject: SUBJECT_OPTIONS[0],
  material: MATERIAL_OPTIONS[0],
  behaviour: BEHAVIOUR_OPTIONS[0],
  classwork: CLASSWORK_OPTIONS[0],
  homework: HOMEWORK_OPTIONS[0],
  participation: PARTICIPATION_OPTIONS[0],
}

export function pickSelectValue(value, presets) {
  const t = String(value ?? '').trim()
  if (presets.includes(t)) return t
  if (t) return t
  return presets[0]
}

export function pickSectionValue(value) {
  const u = String(value ?? '').trim().toUpperCase()
  if (SECTION_OPTIONS.includes(u)) return u
  const raw = String(value ?? '').trim()
  if (raw) return raw
  return SECTION_OPTIONS[0]
}

export function pickSubjectValue(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return SUBJECT_OPTIONS[0]
  if (SUBJECT_OPTIONS.includes(raw)) return raw
  const lower = raw.toLowerCase()
  const byLower = SUBJECT_OPTIONS.find((p) => p.toLowerCase() === lower)
  if (byLower) return byLower
  return raw
}

export function selectOptionsList(currentValue, presets) {
  const t = String(currentValue ?? '').trim()
  if (!t) return presets
  if (presets.includes(t)) return presets
  return [t, ...presets]
}

export function buildDraftFromStudent(student) {
  const rawClass = student.studentClass ?? student.class
  const classStr =
    rawClass === null || rawClass === undefined || rawClass === '' ? '' : String(rawClass).trim()
  return {
    ...student,
    studentClass: pickSelectValue(classStr, CLASS_OPTIONS),
    section: pickSectionValue(student.section),
    subject: pickSubjectValue(student.subject),
    material: pickSelectValue(student.material, MATERIAL_OPTIONS),
    behaviour: pickSelectValue(student.behaviour, BEHAVIOUR_OPTIONS),
    classwork: pickSelectValue(student.classwork, CLASSWORK_OPTIONS),
    homework: pickSelectValue(student.homework, HOMEWORK_OPTIONS),
    participation: pickSelectValue(student.participation, PARTICIPATION_OPTIONS),
  }
}
