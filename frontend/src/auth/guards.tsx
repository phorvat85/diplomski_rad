import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

// Normalize roles: "ROLE_ADMIN" -> "ADMIN", or object -> name
export function toBaseRole(role: unknown): string | null {
  if (!role) return null
  if (typeof role === 'string') return role.startsWith('ROLE_') ? role.slice(5) : role
  if (typeof role === 'object' && role !== null) {
    // best-effort extraction for things like { name: "ROLE_ADMIN" } or { authority: "ROLE_ADMIN" }
    // @ts-ignore
    const name = role.name ?? role.authority ?? role.role
    if (!name || typeof name !== 'string') return null
    return name.startsWith('ROLE_') ? name.slice(5) : name
  }
  return null
}

export function hasAnyRole(userRole: unknown, allowed: string[]): boolean {
  const base = (toBaseRole(userRole) || '').toUpperCase()
  return allowed.map(r => r.toUpperCase()).includes(base)
}

export function RequireAuth() {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

// Wrap a page directly with a role check
export function RoleRoute({ allowed, element }: { allowed: string[]; element: JSX.Element }) {
  const { user } = useAuth()
  return hasAnyRole(user?.role, allowed) ? element : <Navigate to="/" replace />
}