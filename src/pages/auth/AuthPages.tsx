import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import Spline from '@splinetool/react-spline'

export function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@drive.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const user = await login(email, password)
      // TS returns void, but user is set in context; navigate based on saved session
      const role = JSON.parse(localStorage.getItem('ds_session') || '{}')?.role
      if (role === 'admin') nav('/admin')
      else if (role === 'instructor') nav('/instructor')
      else nav('/student')
    } catch (err: any) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen relative grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <Spline scene="https://prod.spline.design/4Tf9WOIaWs6LOezG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-900/40 to-transparent pointer-events-none" />
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={onSubmit} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to manage your driving school</p>
          {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="••••••••" />
          </div>
          <button disabled={loading} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 disabled:opacity-60">{loading ? 'Signing in...' : 'Sign in'}</button>
          <div className="flex items-center justify-between text-sm">
            <Link to="/auth/forgot" className="text-slate-700 hover:underline">Forgot password?</Link>
            <Link to="/auth/signup" className="text-slate-700 hover:underline">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [name, setName] = useState('Sam Student')
  const [email, setEmail] = useState('student@drive.com')
  const [password, setPassword] = useState('learn123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null)
    try { await signup(name, email, password, 'student'); nav('/student') } catch (err:any) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <Spline scene="https://prod.spline.design/4Tf9WOIaWs6LOezG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-900/40 to-transparent pointer-events-none" />
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={onSubmit} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4">
          <h1 className="text-2xl font-semibold">Create account</h1>
          {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}
          <div>
            <label className="text-sm text-slate-600">Full name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" />
          </div>
          <button disabled={loading} className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 disabled:opacity-60">{loading ? 'Creating...' : 'Create account'}</button>
          <div className="text-sm text-slate-600">Already have an account? <Link className="text-slate-800 hover:underline" to="/auth/login">Sign in</Link></div>
        </form>
      </div>
    </div>
  )
}

export function Forgot() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => { e.preventDefault(); setSent(true) }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
      <form onSubmit={submit} className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-slate-600">Enter your email and we will send reset instructions.</p>
        {!sent ? (
          <>
            <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="you@example.com" />
            <button className="w-full px-4 py-2 rounded-lg bg-slate-900 text-white">Send reset link</button>
          </>
        ) : (
          <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">Check your inbox for the reset link.</div>
        )}
      </form>
    </div>
  )
}
