import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8081', // '' => '/auth/login', '/users', etc.
  withCredentials: false,
})

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

let unauthorizedHandler: null | (() => void) = null
export function setUnauthorizedHandler(fn: null | (() => void)) {
  unauthorizedHandler = fn
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof unauthorizedHandler === 'function') {
      try {
        unauthorizedHandler()
      } catch {
        /* noop */
      }
    }
    return Promise.reject(err)
  }
)
