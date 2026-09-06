import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, User as UserIcon, Trash2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getCategory } from '../lib/categories'

type Detail = {
  id: number
  kind: 'offer' | 'need'
  category: string
  title: string
  description: string
  location: string | null
  contact: string | null
  status: 'open' | 'claimed' | 'fulfilled'
  user_id: string
  user_name: string
  claimed_by: string | null
  claimed_by_name: string | null
  created_at: string
}

export default function ResourceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, displayName } = useAuth()
  const [r, setR] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/resources?id=${id}`)
      const data = await res.json()
      if (Array.isArray(data)) setR(data[0] ?? null)
      else setR(data)
    } catch (e) { console.error(e); setError('Could not load this post.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [id])

  const claim = async () => {
    if (!user || !r) return
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r.id, action: 'claim', user_id: user.id, user_name: displayName }),
      })
      if (!res.ok) throw new Error('Claim failed')
      await load()
    } catch (e) { console.error(e); setError('Could not claim. Try again.') }
    finally { setBusy(false) }
  }

  const setStatus = async (status: 'open' | 'claimed' | 'fulfilled') => {
    if (!r) return
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r.id, action: 'status', status }),
      })
      if (!res.ok) throw new Error('Update failed')
      await load()
    } catch (e) { console.error(e); setError('Could not update.') }
    finally { setBusy(false) }
  }

  const remove = async () => {
    if (!r) return
    if (!confirm('Remove this post from the board?')) return
    setBusy(true)
    try {
      const res = await fetch('/api/resources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: r.id }),
      })
      if (!res.ok) throw new Error('Delete failed')
      navigate('/board')
    } catch (e) { console.error(e); setError('Could not remove.') }
    finally { setBusy(false) }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-16 text-ink-soft font-display italic text-xl">Fetching the post…</div>
  if (!r) return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-display text-2xl text-ink mb-3">That post can't be found.</p>
      <Link to="/board" className="text-moss hover:underline">Back to the board</Link>
    </div>
  )

  const cat = getCategory(r.category)
  const isOwner = user?.id === r.user_id
  const isClaimer = user?.id === r.claimed_by

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link to="/board" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink mb-6">
        <ArrowLeft className="w-4 h-4"/> Back to the board
      </Link>

      <div className="bg-cream border border-fog rounded-3xl p-8 md:p-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold ${
            r.kind === 'offer' ? 'bg-moss/10 text-moss-dark border border-moss/30' : 'bg-terracotta/10 text-terracotta border border-terracotta/30'
          }`}>
            {r.kind === 'offer' ? '→ Offering' : '← Needing'}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full ${cat.color}`}>{cat.emoji} {cat.label}</span>
          <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-parchment border border-fog text-ink-soft">{r.status}</span>
        </div>

        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">{r.title}</h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft mb-6 pb-6 border-b border-dashed border-fog">
          <span className="inline-flex items-center gap-1.5"><UserIcon className="w-4 h-4"/> {r.user_name}</span>
          {r.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {r.location}</span>}
          <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4"/> {new Date(r.created_at).toLocaleString()}</span>
        </div>

        <p className="text-ink text-lg leading-relaxed whitespace-pre-wrap mb-6">{r.description}</p>

        {r.contact && (
          <div className="bg-parchment/70 border border-fog rounded-xl p-4 mb-6">
            <div className="text-xs uppercase tracking-widest text-ink-soft mb-1">How to reach {r.user_name.split(' ')[0]}</div>
            <div className="text-ink">{r.contact}</div>
          </div>
        )}

        {r.claimed_by_name && (
          <div className="bg-ochre/15 border border-ochre/40 rounded-xl p-4 mb-6">
            <div className="text-xs uppercase tracking-widest text-ink-soft mb-1">Claimed by</div>
            <div className="text-ink font-medium">{r.claimed_by_name}</div>
          </div>
        )}

        {error && <div className="text-terracotta text-sm mb-4">{error}</div>}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {!user && (
            <Link to="/login" className="px-5 py-2.5 bg-moss text-cream rounded-full hover:bg-moss-dark">Sign in to help</Link>
          )}
          {user && !isOwner && r.status === 'open' && (
            <button disabled={busy} onClick={claim} className="px-5 py-2.5 bg-terracotta text-cream rounded-full hover:bg-terracotta/90 disabled:opacity-60">
              {r.kind === 'offer' ? 'I want this' : 'I can help'}
            </button>
          )}
          {user && (isOwner || isClaimer) && r.status === 'claimed' && (
            <button disabled={busy} onClick={() => setStatus('fulfilled')} className="px-5 py-2.5 bg-moss text-cream rounded-full hover:bg-moss-dark disabled:opacity-60">
              Mark as fulfilled ✓
            </button>
          )}
          {user && isOwner && r.status === 'claimed' && (
            <button disabled={busy} onClick={() => setStatus('open')} className="px-5 py-2.5 bg-cream text-ink border border-fog rounded-full hover:border-ink disabled:opacity-60">
              Reopen
            </button>
          )}
          {user && isOwner && r.status === 'fulfilled' && (
            <button disabled={busy} onClick={() => setStatus('open')} className="px-5 py-2.5 bg-cream text-ink border border-fog rounded-full hover:border-ink disabled:opacity-60">
              Reopen
            </button>
          )}
          {user && isOwner && (
            <button disabled={busy} onClick={remove} className="ml-auto px-4 py-2.5 text-terracotta hover:bg-terracotta/10 rounded-full inline-flex items-center gap-2 disabled:opacity-60">
              <Trash2 className="w-4 h-4"/> Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
