import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function NewEvent() {
  const { user, displayName } = useAuth()
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('18:00')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')
    if (!title.trim() || !location.trim() || !date) return setError('Fill in title, location, and date.')
    const iso = new Date(`${date}T${time}`).toISOString()
    setBusy(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(), description: description.trim(),
          location: location.trim(), event_date: iso,
          organizer_id: user.id, organizer_name: displayName,
        }),
      })
      if (!res.ok) throw new Error()
      nav('/events')
    } catch { setError('Could not create event.') }
    finally { setBusy(false) }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="text-xs uppercase tracking-widest text-terracotta mb-2">A new gathering</div>
      <h1 className="font-display text-4xl text-ink mb-8">Host something</h1>

      <form onSubmit={submit} className="space-y-5 bg-cream border border-fog rounded-3xl p-8">
        <div>
          <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} required maxLength={100}
            placeholder="Sunday potluck in the courtyard"
            className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">What's it about?</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} maxLength={1000}
            placeholder="Bring a dish to share, or just come hungry. Kids welcome. We'll have music."
            className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss resize-none"/>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Where</label>
          <input value={location} onChange={e=>setLocation(e.target.value)} required maxLength={120}
            placeholder="e.g. Willowbrook courtyard, 1421 Elm St"
            className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} required
              className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-ink-soft mb-2">Time</label>
            <input type="time" value={time} onChange={e=>setTime(e.target.value)} required
              className="w-full px-4 py-3 bg-parchment border border-fog rounded-xl focus:outline-none focus:border-moss"/>
          </div>
        </div>

        {error && <div className="text-sm text-terracotta">{error}</div>}

        <div className="flex items-center justify-between pt-4 border-t border-dashed border-fog">
          <button type="button" onClick={()=>nav(-1)} className="text-ink-soft hover:text-ink text-sm">Cancel</button>
          <button disabled={busy} type="submit" className="px-6 py-3 bg-terracotta text-cream rounded-full hover:bg-terracotta/90 disabled:opacity-60">
            {busy ? 'Posting…' : 'Post gathering'}
          </button>
        </div>
      </form>
    </div>
  )
}
