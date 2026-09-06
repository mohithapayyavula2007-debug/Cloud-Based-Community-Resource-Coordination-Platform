import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowRight, Sprout, Users, Heart, Hammer } from 'lucide-react'
import ResourceCard, { type Resource } from '../components/ResourceCard'

type Stats = { resources: number; fulfilled: number; neighbors: number; events: number }

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recent, setRecent] = useState<Resource[]>([])

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
    fetch('/api/resources?limit=6').then(r => r.json()).then(setRecent).catch(() => {})
  }, [])

  const tickerItems = [
    'sourdough starter', 'ladder', 'ride to clinic', 'help moving couch', 'guitar lessons',
    'meal for new parents', 'winter coats', 'garden tools', 'spanish tutoring', 'jump start',
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden paper-noise">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-terracotta/10 blur-3xl"/>
          <div className="absolute bottom-0 -left-20 w-80 h-80 rounded-full bg-moss/10 blur-3xl"/>
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="max-w-3xl animate-float-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-parchment border border-fog text-xs uppercase tracking-widest text-ink-soft mb-6">
              <Sprout className="w-3 h-3 text-moss"/> A cooperative resource exchange
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-ink mb-6">
              The block already has
              <span className="italic text-moss"> everything </span>
              it needs.
            </h1>
            <p className="text-lg md:text-xl text-ink-soft max-w-2xl mb-8">
              Kinfolk is a shared corkboard for the whole neighborhood — lend a drill, pass on a stroller, catch a ride, or just show up for a stew night. Nothing to sell. Everything to share.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/board" className="inline-flex items-center gap-2 px-6 py-3 bg-moss text-cream rounded-full hover:bg-moss-dark transition group">
                Browse the Board <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition"/>
              </Link>
              <Link to="/new/resource" className="inline-flex items-center gap-2 px-6 py-3 bg-cream text-ink border border-ink/20 rounded-full hover:border-ink transition">
                Post something
              </Link>
            </div>
          </div>
        </div>

        {/* Marquee ticker */}
        <div className="border-y border-fog bg-parchment/60 overflow-hidden">
          <div className="flex animate-ticker whitespace-nowrap py-3 font-display italic text-xl text-moss-dark">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="mx-8 inline-flex items-center gap-4">
                {t}
                <span className="text-terracotta">✲</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Things shared', value: stats?.resources ?? '—', icon: <Sprout className="w-5 h-5"/> },
            { label: 'Needs answered', value: stats?.fulfilled ?? '—', icon: <Heart className="w-5 h-5"/> },
            { label: 'Active neighbors', value: stats?.neighbors ?? '—', icon: <Users className="w-5 h-5"/> },
            { label: 'Gatherings ahead', value: stats?.events ?? '—', icon: <Hammer className="w-5 h-5"/> },
          ].map((s, i) => (
            <div key={i} className="p-6 bg-parchment/60 rounded-2xl border border-fog">
              <div className="text-moss mb-3">{s.icon}</div>
              <div className="font-display text-4xl text-ink">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-ink-soft mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent posts */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-terracotta mb-2">Fresh on the board</div>
            <h2 className="font-display text-3xl md:text-4xl text-ink">What the block is saying</h2>
          </div>
          <Link to="/board" className="hidden md:inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink">
            See everything <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="text-center py-12 text-ink-soft italic font-display text-xl">Loading the corkboard…</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map(r => <ResourceCard key={r.id} r={r} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-parchment/50 border-y border-fog">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-12 max-w-2xl">Three quiet steps. No transactions.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', t: 'Post what you have — or what you need.', d: 'A drill collecting dust, a ride to the airport, a warm meal for a rough week. Anything counts.' },
              { n: '02', t: 'A neighbor claims it.', d: 'They pick it up, drop it off, or knock on your door. You coordinate in the comments — no middlemen, no fees.' },
              { n: '03', t: 'Mark it fulfilled.', d: 'The board updates. The neighborhood grows a little stronger. Repeat next Tuesday.' },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="font-display italic text-6xl text-terracotta/40 mb-3">{s.n}</div>
                <h3 className="font-display text-2xl text-ink mb-2">{s.t}</h3>
                <p className="text-ink-soft">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
