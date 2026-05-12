import axios from 'axios'
import { REFRESH_TOKEN_STORAGE_KEY } from '../lib/authStorage.js'

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

apiClient.interceptors.request.use((config) => {
  const path = config.url || ''
  if (path.includes('/auth/login')) {
    return config
  }
  try {
    const raw = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
    if (raw) {
      config.headers.Authorization = `Bearer ${raw}`
    }
  } catch {
    void 0
  }
  return config
})
