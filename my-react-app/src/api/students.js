import { apiClient } from './client.js'

const RESOURCE = '/students'

function normalizeList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.data)) return data.data
  return []
}

/** GET /students — returns an array of student record objects */
export async function fetchStudents() {
  const { data } = await apiClient.get(RESOURCE)
  return normalizeList(data)
}

/** POST /students — body should match your backend schema */
export async function createStudent(payload) {
  const { data } = await apiClient.post(RESOURCE, payload)
  return data
}

/** PUT /students/:id */
export async function updateStudent(id, payload) {
  const { data } = await apiClient.put(`${RESOURCE}/${encodeURIComponent(id)}`, payload)
  return data
}

/** DELETE /students/:id */
export async function deleteStudent(id) {
  await apiClient.delete(`${RESOURCE}/${encodeURIComponent(id)}`)
}
