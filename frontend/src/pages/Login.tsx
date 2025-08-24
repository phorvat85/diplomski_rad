// src/pages/Login.tsx
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { login as apiLogin, LoginReq } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { api, setAuthToken } from '../api/client'

// ---- helpers ----
function decodeJwtPayload<T = any>(token: string): T | null {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '==='.slice((base64.length + 3) % 4)
    const json = atob(padded)
    return JSON.parse(json)
  } catch {
    return null
  }
}

function normalizeRoles(input: any): string[] {
  const arr = Array.isArray(input) ? input : [input]
  return arr
    .filter(Boolean)
    .map((x) => (typeof x === 'string' ? x : (x as any).name ?? (x as any).authority ?? ''))
    .map((s) => s.replace(/^ROLE_/i, '').toUpperCase())
}

function normalizeUser(u: any, jwtPayload?: any) {
  // prefer server fields, fall back to JWT username/sub, never use numeric id as username
  const rawUsername =
    u?.username ?? u?.userName ?? u?.name ?? jwtPayload?.username ?? jwtPayload?.sub ?? ''
  const username =
    typeof rawUsername === 'number'
      ? ''
      : String(rawUsername || '').trim()
  const safeUsername =
    username && /^\d+$/.test(username) && String(u?.id ?? '') === username ? '' : username

  const email = String(u?.email ?? u?.emailAddress ?? '').trim()

  // keep whatever "role" shape the backend uses, but also provide a normalized array
  const roleObj =
    u?.role && typeof u.role === 'object'
      ? u.role
      : u?.role
      ? { name: String(u.role) }
      : undefined

  const rolesFromJwt = normalizeRoles(
    jwtPayload?.authorities ?? jwtPayload?.roles ?? jwtPayload?.role ?? jwtPayload?.scope ?? jwtPayload?.scopes ?? []
  )
  const rolesFromUser = normalizeRoles(u?.roles ?? (roleObj?.name ? [roleObj.name] : []))

  return {
    ...u,
    username: safeUsername || email || String(u?.id ?? ''), // sensible display fallback
    email,
    role: roleObj ?? (rolesFromUser[0] ? { name: `ROLE_${rolesFromUser[0]}` } : undefined),
    roles: rolesFromUser.length ? rolesFromUser : rolesFromJwt,
  }
}

// ---- component ----
export default function Login() {
  const { register, handleSubmit } = useForm<LoginReq>()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const qc = useQueryClient()

  const onSubmit = async (values: LoginReq) => {
    try {
      // 1) authenticate → token
      const res = await apiLogin(values) // expect { token }
      const token: string = res?.token ?? res?.accessToken ?? res?.jwt
      if (!token) throw new Error('No token returned from /auth/login')

      // 2) prime Authorization so the next call uses it
      setAuthToken(token)

      // 3) fetch authoritative user from the backend
      const payload = decodeJwtPayload(token)
      const meResp = await api.get('/worker/user/me')
      const me = normalizeUser(meResp.data, payload)

      // 4) persist auth (AuthContext + localStorage via login)
      login(token, me)

      // 5) seed React Query cache so header/profile are instant
      qc.setQueryData(['me'], me)

      // 6) go where user intended (or home)
      const to = (location.state as any)?.from?.pathname ?? '/'
      navigate(to, { replace: true })
    } catch (err: any) {
      // optional: show error to user; keep your existing UX
      // eslint-disable-next-line no-alert
      alert(err?.response?.data?.message || err?.message || 'Login failed.')
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-xl border bg-white p-6"
      >
        <h1 className="text-xl font-semibold">Login</h1>
        <input
          {...register('username')}
          placeholder="Username"
          className="w-full rounded border px-3 py-2"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="w-full rounded border px-3 py-2"
        />
        <button className="w-full rounded bg-black px-3 py-2 text-white">Sign in</button>
        <p className="text-sm text-slate-600">
          No account?{' '}
          <Link to="/register" className="underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}