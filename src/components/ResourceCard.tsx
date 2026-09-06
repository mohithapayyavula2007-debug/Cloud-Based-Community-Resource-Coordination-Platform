import { Link } from 'react-router-dom'
import { MapPin, Clock, User as UserIcon } from 'lucide-react'
import { getCategory } from '../lib/categories'

export type Resource = {
  id: number
  kind: 'offer' | 'need'
  category: string
  title: string
  description: string
  location: string | null
  status: 'open' | 'claimed' | 'fulfilled'
  user_name: string
  claimed_by_name: string | null
  created_at: string
}

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

export default function ResourceCard({ r }: { r: Resource }) {
  const cat = getCategory(r.category)
  const isOffer = r.kind === 'offer'
  const statusColors: Record<string, string> = {
    open: 'bg-moss text-cream',
    claimed: 'bg-ochre text-ink',
    fulfilled: 'bg-fog text-ink-soft line-through',
  }

  return (
    <Link to={`/board/${r.id}`} className="group block">
      <article className="relative h-full p-6 bg-cream border border-fog rounded-2xl hover:border-moss/50 hover:shadow-[0_8px_24px_-12px_rgba(74,103,65,0.35)] transition-all">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold ${
              isOffer ? 'bg-moss/10 text-moss-dark border border-moss/30' : 'bg-terracotta/10 text-terracotta border border-terracotta/30'
            }`}>
              {isOffer ? '→ Offering' : '← Needing'}
            </span>
            <span className={`text-[10px] px-2 py-1 rounded-full ${cat.color}`}>
              {cat.emoji} {cat.label}
            </span>
          </div>
          <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
        </div>

        <h3 className="font-display text-xl leading-snug text-ink group-hover:text-moss-dark transition-colors mb-2">
          {r.title}
        </h3>
        <p className="text-sm text-ink-soft line-clamp-3 mb-4">{r.description}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft pt-3 border-t border-dashed border-fog">
          <span className="inline-flex items-center gap-1"><UserIcon className="w-3 h-3"/> {r.user_name}</span>
          {r.location && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3"/> {r.location}</span>}
          <span className="inline-flex items-center gap-1 ml-auto"><Clock className="w-3 h-3"/> {timeAgo(r.created_at)}</span>
        </div>
      </article>
    </Link>
  )
}
