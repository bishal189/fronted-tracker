import { apiClient } from './client.js'

export function extractTokenFromLoginBody(body) {
  if (!body || typeof body !== 'object') return null
  const direct =
    (typeof body.token === 'string' && body.token) ||
    (typeof body.accessToken === 'string' && body.accessToken) ||
    (typeof body.access_token === 'string' && body.access_token) ||
    (typeof body.refreshToken === 'string' && body.refreshToken) ||
    (typeof body.refresh_token === 'string' && body.refresh_token)
  if (direct) return direct
  if (body.data && typeof body.data === 'object') {
    return extractTokenFromLoginBody(body.data)
  }
  return null
}

export function extractEmailFromLoginBody(body, fallbackEmail) {
  if (!body || typeof body !== 'object') return fallbackEmail
  if (typeof body.email === 'string') return body.email
  if (body.user && typeof body.user.email === 'string') return body.user.email
  if (body.data && typeof body.data === 'object') {
    return extractEmailFromLoginBody(body.data, fallbackEmail)
  }
  return fallbackEmail
}

export async function loginWithEmailPassword(email, password) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  const token = extractTokenFromLoginBody(data)
  if (!token) {
    const err = new Error('No token in login response')
    err.cause = data
    throw err
  }
  const resolvedEmail = extractEmailFromLoginBody(data, email)
  return { token, email: resolvedEmail, raw: data }
}
