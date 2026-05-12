export { apiClient } from './client.js'
export {
  loginWithEmailPassword,
  extractTokenFromLoginBody,
  extractEmailFromLoginBody,
} from './auth.js'
export {
  fetchStudents,
  createStudentFromRow,
  rowToCreateStudentBody,
  updateStudent,
  patchStudentFromRow,
  deleteStudent,
  deleteStudentFromRow,
  mapNestedStudentsToRows,
} from './students.js'
