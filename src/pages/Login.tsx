import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../lib/supabase'
import { signInWithGoogle } from '../lib/googleAuth'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

export default function Login() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [mode, setMode] = useState<'signin'|'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (user) nav('/board') }, [user])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  const useDemo = () => { setEmail('demo@kinfolk.example'); setPassword('kinfolk123'); setMode('signin') }

  return (
    <div className="min-h-[80vh] grid md:grid-cols-2">
      <div className="hidden md:flex bg-moss text-cream p-12 flex-col justify-between paper-noise relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-terracotta/40 blur-3xl"/>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-ochre/40 blur-3xl"/>
        <div className="relative">
          <div className="font-display italic text-3xl">Kinfolk</div>
          <div className="text-xs uppercase tracking-[0.3em] opacity-70 mt-1">Neighborhood Exchange</div>
        </div>
        <div className="relative">
          <blockquote className="font-display text-3xl leading-tight italic mb-4">
            “I didn't know Marta on Elm baked bread every Sunday until I posted asking for one loaf. Now she brings me two.”
          </blockquote>
          <div className="text-sm opacity-80">— Rosalyn, a Kinfolk neighbor</div>
        </div>
        <div className="relative text-xs opacity-70">Free forever. No ads, no data selling. Just neighbors.</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl text-ink mb-2">{mode === 'signup' ? 'Move in.' : 'Welcome back.'}</h1>
          <p className="text-ink-soft mb-8">{mode === 'signup' ? 'Set up your corner of the block.' : 'Sign in to post, claim, and RSVP.'}</p>

          <form onSubmit={submit} className="space-y-3">
            <input type="email" required placeholder="you@street.com" value={email} onChange={e=>setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
            <input type="password" required minLength={6} placeholder="password (min 6)" value={password} onChange={e=>setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
            {error && <div className="text-sm text-terracotta">{error}</div>}
            <button disabled={busy} type="submit" className="w-full py-3 bg-moss text-cream rounded-xl hover:bg-moss-dark disabled:opacity-60">
              {busy ? 'One moment…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5 text-xs uppercase tracking-widest text-ink-soft">
            <div className="flex-1 h-px bg-fog"/> or <div className="flex-1 h-px bg-fog"/>
          </div>

          <button onClick={() => signInWithGoogle('Kinfolk')} className="w-full py-3 bg-cream border border-ink/20 rounded-xl hover:border-ink flex items-center justify-center gap-3">
            <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4a6.2 6.2 0 1 1 0-12.3 5.6 5.6 0 0 1 4 1.5l2.7-2.6A9.7 9.7 0 0 0 12 2a10 10 0 1 0 0 20c5.7 0 9.6-4 9.6-9.7 0-.6 0-1.2-.2-2H12z"/></svg>
            Continue with Google
          </button>

          <div className="mt-6 text-sm text-ink-soft text-center">
            {mode === 'signup' ? (
              <>Already a neighbor? <button onClick={()=>setMode('signin')} className="text-moss underline">Sign in</button></>
            ) : (
              <>New to the block? <button onClick={()=>setMode('signup')} className="text-moss underline">Create account</button></>
            )}
          </div>

          <button onClick={useDemo} className="mt-4 w-full text-xs text-ink-soft hover:text-ink underline">
            Try a demo account (demo@kinfolk.example / kinfolk123)
          </button>
        </div>
      </div>
    </div>
  )
}
