// src/pages/Register.tsx
import { useForm } from 'react-hook-form'
import { register as apiRegister, RegisterReq } from '../api/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useMemo } from 'react'

type FormValues = RegisterReq & { repeatPassword: string }

function getPasswordStrength(pw: string) {
  let score = 0
  const suggestions: string[] = []
  if (pw.length >= 8) score++; else suggestions.push('Use at least 8 characters')
  if (pw.length >= 12) score++
  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasDigit = /\d/.test(pw)
  const hasSymbol = /[^A-Za-z0-9]/.test(pw)
  if (hasLower && hasUpper) score++; else suggestions.push('Mix UPPER and lower case')
  if (hasDigit) score++; else suggestions.push('Add a number')
  if (hasSymbol) score++; else suggestions.push('Add a symbol (!@#…)')
  score = Math.min(score, 4)
  const label = score <= 1 ? 'Weak' : score === 2 ? 'Fair' : score === 3 ? 'Good' : 'Strong'
  return { score, label, suggestions }
}

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>()
  const nav = useNavigate()

  const password = watch('password') || ''
  const repeatPassword = watch('repeatPassword') || ''
  const { score, label, suggestions } = useMemo(() => getPasswordStrength(password), [password])

  async function onSubmit(values: FormValues) {
    const { repeatPassword: _rp, ...payload } = values // no role sent
    await apiRegister(payload)
    nav('/login')
  }

  const meterPercent = (score / 4) * 100
  const meterColor =
    score <= 1 ? 'bg-red-500' :
    score === 2 ? 'bg-yellow-500' :
    score === 3 ? 'bg-green-500' : 'bg-emerald-600'

  return (
    <div className="grid place-items-center min-h-dvh">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl border w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Create account</h1>

        <div>
          <input
            {...register('username', { required: 'Username is required' })}
            placeholder="Username"
            className="w-full border rounded px-3 py-2"
          />
          {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' }
            })}
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <input
            type="password"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum length is 8' } })}
            placeholder="Password"
            className="w-full border rounded px-3 py-2"
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <input
            type="password"
            {...register('repeatPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === password || 'Passwords do not match'
            })}
            placeholder="Repeat Password"
            className="w-full border rounded px-3 py-2"
          />
          {repeatPassword && repeatPassword !== password && (
            <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
          )}
          {errors.repeatPassword && <p className="text-red-600 text-sm mt-1">{errors.repeatPassword.message}</p>}
        </div>

        {/* Strength meter + tips BELOW the repeat password field */}
        {password && (
          <div>
            <div className="w-full h-2 bg-slate-200 rounded">
              <div
                className={`h-2 rounded ${meterColor}`}
                style={{ width: `${meterPercent}%`, transition: 'width 180ms ease' }}
              />
            </div>
            <div className="mt-1 text-xs text-slate-600" aria-live="polite">
              Strength: <span className="font-medium">{label}</span>
            </div>
            {suggestions.length > 0 && score < 4 && (
              <ul className="text-xs text-slate-600 space-y-1 bg-slate-50 border rounded p-3 mt-2">
                {suggestions.slice(0, 3).map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            )}
          </div>
        )}

        <button className="w-full bg-black text-white rounded px-3 py-2">Register</button>
        <p className="text-sm text-slate-600">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </form>
    </div>
  )
}