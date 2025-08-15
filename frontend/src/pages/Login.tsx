// src/pages/Login.tsx
import { useForm } from 'react-hook-form'
import { login as apiLogin, LoginReq } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

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

// Normalize to one of: ADMIN | MANAGER | WORKER
function extractRoleFromPayload(payload: any): 'ADMIN' | 'MANAGER' | 'WORKER' {
  if (!payload) return 'WORKER'
  // Common Spring claims: authorities, roles, role, scope
  let raw: any = payload.authorities ?? payload.roles ?? payload.role ?? payload.scope ?? payload.scopes

  // If space-delimited scope string
  if (typeof raw === 'string' && raw.includes(' ')) raw = raw.split(' ')
  // If single string, wrap as array
  if (typeof raw === 'string') raw = [raw]
  // If object array (rare), map to strings
  if (Array.isArray(raw)) raw = raw.map((r) => (typeof r === 'string' ? r : r?.authority ?? r?.name ?? String(r)))

  const roles: string[] = Array.isArray(raw) ? raw : []
  const has = (needle: string) => roles.some(r => r === needle || r === `ROLE_${needle}`)
  if (has('ADMIN')) return 'ADMIN'
  if (has('MANAGER')) return 'MANAGER'
  return 'WORKER'
}

function extractUsername(payload: any, fallback: string): string {
  // Common JWT fields: sub, username
  return payload?.username ?? payload?.sub ?? fallback
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginReq>()
  const { login } = useAuth()
  const nav = useNavigate()

  async function onSubmit(values: LoginReq) {
    const res = await apiLogin(values) // typically returns { token }
    const payload = decodeJwtPayload(res.token)
    const role = extractRoleFromPayload(payload)
    const username = extractUsername(payload, values.username)

    // Store normalized user with correct role
    login(res.token, { id: 'me', username, role })

    nav('/') // go home; navbar will now show Manager/Admin if applicable
  }

  return (
    <div className="grid place-items-center min-h-dvh">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        <input {...register('username')} placeholder="Username" className="w-full border rounded px-3 py-2" />
        <input {...register('password')} type="password" placeholder="Password" className="w-full border rounded px-3 py-2" />
        <button className="w-full bg-black text-white rounded px-3 py-2">Sign in</button>
        <p className="text-sm text-slate-600">No account? <Link to="/register" className="underline">Register</Link></p>
      </form>
    </div>
  )
}