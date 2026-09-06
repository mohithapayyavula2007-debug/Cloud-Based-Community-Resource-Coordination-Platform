import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import EventCard, { type CommunityEvent } from '../components/EventCard'
import { useAuth } from '../contexts/AuthContext'

export default function Events() {
  const { user, displayName } = useAuth()
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const url = user ? `/api/events?user_id=${user.id}` : '/api/events'
      const res = await fetch(url)
      const data = await res.json()
      setEvents(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e); setError('Could not load gatherings.') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [user?.id])

  const toggleRsvp = async (event_id: number) => {
    if (!user) return
    try {
      const res = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id, user_id: user.id, user_name: displayName }),
      })
      if (!res.ok) throw new Error()
      await load()
    } catch { setError('Could not update RSVP.') }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-terracotta mb-2">Gatherings</div>
          <h1 className="font-display text-4xl md:text-5xl text-ink">When neighbors show up</h1>
          <p className="text-ink-soft mt-2 max-w-xl">Potlucks, cleanups, meetings, workshops. RSVP so the hosts know how much chili to make.</p>
        </div>
        {user ? (
          <Link to="/new/event" className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta text-cream rounded-full hover:bg-terracotta/90 self-start md:self-auto">
            <Plus className="w-4 h-4"/> Host a gathering
          </Link>
        ) : (
          <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-moss text-cream rounded-full hover:bg-moss-dark self-start md:self-auto">
            Join to host
          </Link>
        )}
      </div>

      {error && <div className="text-terracotta text-sm mb-4">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          {Array.from({length:4}).map((_,i)=>(
            <div key={i} className="h-28 bg-parchment/60 border border-fog rounded-2xl animate-pulse"/>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 font-display italic text-2xl text-ink-soft">No gatherings on the calendar. Yet.</div>
      ) : (
        <div className="space-y-4">
          {events.map(ev => (
            <EventCard key={ev.id} ev={ev} onRsvp={toggleRsvp} canRsvp={!!user}/>
          ))}
        </div>
      )}
    </div>
  )
}
