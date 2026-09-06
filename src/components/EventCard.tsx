import { MapPin, Users, Calendar } from 'lucide-react'

export type CommunityEvent = {
  id: number
  title: string
  description: string
  location: string
  event_date: string
  organizer_name: string
  rsvp_count?: number
  user_rsvped?: boolean
}

export default function EventCard({ ev, onRsvp, canRsvp }: { ev: CommunityEvent; onRsvp: (id: number) => void; canRsvp: boolean }) {
  const d = new Date(ev.event_date)
  const month = d.toLocaleString('en', { month: 'short' })
  const day = d.getDate()
  const time = d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' })

  return (
    <article className="flex gap-5 p-5 bg-cream border border-fog rounded-2xl hover:border-terracotta/40 transition-all">
      <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-moss text-cream flex flex-col items-center justify-center">
        <div className="text-[10px] uppercase tracking-widest opacity-80">{month}</div>
        <div className="font-display text-3xl leading-none">{day}</div>
        <div className="text-[10px] mt-1 opacity-80">{time}</div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-xl text-ink mb-1">{ev.title}</h3>
        <p className="text-sm text-ink-soft line-clamp-2 mb-3">{ev.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3"/> {ev.location}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3"/> hosted by {ev.organizer_name}</span>
          <span className="inline-flex items-center gap-1"><Users className="w-3 h-3"/> {ev.rsvp_count ?? 0} going</span>
        </div>
      </div>
      <div className="flex-shrink-0 self-center">
        <button
          onClick={() => onRsvp(ev.id)}
          disabled={!canRsvp}
          className={`px-4 py-2 rounded-full text-sm transition ${
            ev.user_rsvped
              ? 'bg-moss text-cream'
              : canRsvp ? 'bg-parchment text-ink hover:bg-terracotta hover:text-cream' : 'bg-fog text-ink-soft cursor-not-allowed'
          }`}
        >
          {ev.user_rsvped ? 'Going ✓' : 'RSVP'}
        </button>
      </div>
    </article>
  )
}
