// src/auth/AuthContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { UserRow } from '../types/entities'
import { setAuthToken, setUnauthorizedHandler } from '../api/client'

type AuthCtx = {
  token: string | null
  user: UserRow | null
  isAuthenticated: boolean
  login: (token: string, user: UserRow) => void
  logout: () => void
  /** Update in-memory + persisted user instantly (used after saving Settings). */
  updateUser: (patch: Partial<UserRow> | UserRow) => void
}

const AuthContext = createContext<AuthCtx | undefined>(undefined)

const LS_TOKEN_KEY = 'token'
const LS_USER_KEY = 'user'
const LS_BROADCAST_KEY = 'auth:logout-broadcast'

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // hydrate once from storage
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN_KEY) || null)
  const [user, setUser] = useState<UserRow | null>(() => {
    try {
      const raw = localStorage.getItem(LS_USER_KEY)
      return raw ? (JSON.parse(raw) as UserRow) : null
    } catch {
      return null
    }
  })

  const queryClient = useQueryClient()

  // --- callbacks FIRST (avoid TDZ errors) ---

  const login = useCallback((nextToken: string, nextUser: UserRow) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem(LS_TOKEN_KEY, nextToken)
    localStorage.setItem(LS_USER_KEY, JSON.stringify(nextUser))
  }, [])

  const updateUser = useCallback((patch: Partial<UserRow> | UserRow) => {
    setUser(prev => {
      const next =
        patch && typeof patch === 'object' && !Array.isArray(patch) && !('length' in (patch as any)) && !('map' in (patch as any)) && !('forEach' in (patch as any)) && !('id' in (patch as any) && Object.keys(patch).length === 1)
          ? ({ ...(prev ?? {}), ...(patch as object) } as UserRow)
          : (patch as UserRow)
      try { localStorage.setItem(LS_USER_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const doClientSideReset = useCallback(() => {
    try {
      queryClient.cancelQueries()
      queryClient.getMutationCache().clear()
      queryClient.clear()
    } catch {}

    setToken(null)
    setUser(null)
    setAuthToken(null)

    try {
      localStorage.removeItem(LS_TOKEN_KEY)
      localStorage.removeItem(LS_USER_KEY)
      sessionStorage.clear()
    } catch {}
  }, [queryClient])

  const logout = useCallback(() => {
    doClientSideReset()
    // broadcast to other tabs (best-effort)
    try { localStorage.setItem(LS_BROADCAST_KEY, String(Date.now())) } catch {}
    // SPA redirect handled by <RequireAuth/> guard
  }, [doClientSideReset])

  // --- effects AFTER callbacks ---

  // keep Axios Authorization header in sync with token
  useEffect(() => { setAuthToken(token) }, [token])

  // any 401 from api -> force logout
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  // listen for cross-tab logout
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_BROADCAST_KEY) doClientSideReset()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [doClientSideReset])

  const value = useMemo<AuthCtx>(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
    updateUser,
  }), [token, user, login, logout, updateUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}