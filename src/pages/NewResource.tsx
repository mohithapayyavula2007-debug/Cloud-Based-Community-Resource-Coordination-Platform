import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES } from '../lib/categories'

export default function NewResource() {
  const { user, displayName } = useAuth()
  const nav = useNavigate()
  const [kind, setKind] = useState<'offer'|'need'>('offer')
  const [category, setCategory] = useState('tools')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [contact, setContact] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')
    if (title.trim().length < 3) return setError('Give it a title (at least 3 characters).')
    if (description.trim().length < 10) return setError('Add a few more details — at least 10 characters.')
    setBusy(true)
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind, category, title: title.trim(), description: description.trim(),
          location: location.trim() || null, contact: contact.trim() || null,
          user_id: user.id, user_name: displayName,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      nav(`/board/${data.id}`)
    } catch { setError('Could not post. Try again.') }
    finally { setBusy(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="text-xs uppercase tracking-widest text-terracotta mb-2">A new pin</div>
      <h1 className="font-display text-4xl text-ink mb-8">Post to the board</h1>

      <form onSubmit={submit} className="space-y-6 bg-cream border border-fog rounded-3xl p-8">
        <div>
          <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">What kind of post?</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={()=>setKind('offer')} className={`p-4 rounded-xl border text-left transition ${kind==='offer'?'border-moss bg-moss/10':'border-fog hover:border-ink-soft'}`}>
              <div className="font-display text-xl text-moss-dark mb-1">→ Offering</div>
              <div className="text-xs text-ink-soft">I have something to share.</div>
            </button>
            <button type="button" onClick={()=>setKind('need')} className={`p-4 rounded-xl border text-left transition ${kind==='need'?'border-terracotta bg-terracotta/10':'border-fog hover:border-ink-soft'}`}>
              <div className="font-display text-xl text-terracotta mb-1">← Needing</div>
              <div className="text-xs text-ink-soft">I could use a hand.</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c.key} type="button" onClick={()=>setCategory(c.key)}
                className={`text-sm px-3 py-1.5 rounded-full border ${category===c.key?'bg-ink text-cream border-ink':'border-fog hover:border-ink-soft'}`}>
                <span className="mr-1">{c.emoji}</span>{c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required maxLength={100}
            placeholder={kind==='offer' ? 'Extra sourdough loaves this Sunday' : 'Ride to the clinic on Thursday morning'}
            className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Details</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} required rows={5} maxLength={2000}
            placeholder="Tell neighbors what you have, what you need, when, and any details that would help."
            className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss resize-none"/>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Neighborhood / cross-street</label>
            <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="e.g. Elm & 4th" maxLength={80}
              className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Contact (optional)</label>
            <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="phone, email, DM handle…" maxLength={120}
              className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
          </div>
        </div>

        {error && <div className="text-sm text-terracotta">{error}</div>}

        <div className="flex items-center justify-between pt-4 border-t border-dashed border-fog">
          <button type="button" onClick={()=>nav(-1)} className="text-ink-soft hover:text-ink text-sm">Cancel</button>
          <button disabled={busy} type="submit" className="px-6 py-3 bg-terracotta text-cream rounded-full hover:bg-terracotta/90 disabled:opacity-60">
            {busy ? 'Pinning…' : 'Pin to board'}
          </button>
        </div>
      </form>
    </div>
  )
}
