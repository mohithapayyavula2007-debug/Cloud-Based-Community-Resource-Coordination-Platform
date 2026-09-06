import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ResourceCard, { type Resource } from '../components/ResourceCard'

export default function Profile() {
  const { user, displayName } = useAuth()
  const [posted, setPosted] = useState<Resource[]>([])
  const [claimed, setClaimed] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      fetch(`/api/resources?user_id=${user.id}`).then(r=>r.json()),
      fetch(`/api/resources?claimed_by=${user.id}`).then(r=>r.json()),
    ]).then(([a, b]) => {
      setPosted(Array.isArray(a)?a:[])
      setClaimed(Array.isArray(b)?b:[])
    }).finally(()=>setLoading(false))
  }, [user?.id])

  const fulfilled = posted.filter(p => p.status === 'fulfilled').length + claimed.filter(c => c.status === 'fulfilled').length

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 pb-8 border-b border-dashed border-fog">
        <div className="w-20 h-20 rounded-full bg-moss text-cream flex items-center justify-center font-display text-3xl">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-terracotta mb-1">My corner</div>
          <h1 className="font-display text-4xl text-ink">Hey, {displayName}</h1>
          <p className="text-ink-soft text-sm mt-1">{user?.email}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Stat label="Posted" value={posted.length}/>
          <Stat label="Claimed" value={claimed.length}/>
          <Stat label="Fulfilled" value={fulfilled}/>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-display text-2xl text-ink mb-4">What I've posted</h2>
        {loading ? (
          <div className="text-ink-soft italic font-display text-lg">Loading…</div>
        ) : posted.length === 0 ? (
          <div className="p-8 bg-parchment/60 rounded-2xl border border-fog text-center">
            <p className="text-ink-soft mb-4">Nothing on the board from you yet.</p>
            <Link to="/new/resource" className="inline-flex px-5 py-2.5 bg-terracotta text-cream rounded-full">Post something</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posted.map(r => <ResourceCard key={r.id} r={r}/>)}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink mb-4">What I've claimed</h2>
        {loading ? (
          <div className="text-ink-soft italic font-display text-lg">Loading…</div>
        ) : claimed.length === 0 ? (
          <div className="p-8 bg-parchment/60 rounded-2xl border border-fog text-center">
            <p className="text-ink-soft">You haven't claimed anything yet. Browse the <Link to="/board" className="text-moss underline">board</Link> — someone probably needs your help.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {claimed.map(r => <ResourceCard key={r.id} r={r}/>)}
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-4 py-3 bg-parchment/60 border border-fog rounded-xl text-center">
      <div className="font-display text-3xl text-ink">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-ink-soft">{label}</div>
    </div>
  )
}
