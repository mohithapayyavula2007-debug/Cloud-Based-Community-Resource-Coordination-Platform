import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, SlidersHorizontal } from 'lucide-react'
import ResourceCard, { type Resource } from '../components/ResourceCard'
import { CATEGORIES } from '../lib/categories'
import { useAuth } from '../contexts/AuthContext'

type Kind = 'all' | 'offer' | 'need'
type Status = 'all' | 'open' | 'claimed' | 'fulfilled'

export default function Board() {
  const { user } = useAuth()
  const [items, setItems] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<Kind>('all')
  const [status, setStatus] = useState<Status>('all')
  const [cat, setCat] = useState<string>('all')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/resources')
      const data = await res.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const filtered = useMemo(() => {
    return items.filter(r => {
      if (kind !== 'all' && r.kind !== kind) return false
      if (status !== 'all' && r.status !== status) return false
      if (cat !== 'all' && r.category !== cat) return false
      if (q.trim()) {
        const s = q.toLowerCase()
        if (!r.title.toLowerCase().includes(s) && !r.description.toLowerCase().includes(s) && !(r.location||'').toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [items, q, kind, status, cat])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-widest text-terracotta mb-2">The Corkboard</div>
          <h1 className="font-display text-4xl md:text-5xl text-ink">Everything in reach</h1>
          <p className="text-ink-soft mt-2 max-w-xl">Browse what neighbors are offering, or answer a need. Tap any card to reach out.</p>
        </div>
        {user ? (
          <Link to="/new/resource" className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta text-cream rounded-full hover:bg-terracotta/90 transition self-start md:self-auto">
            <Plus className="w-4 h-4"/> Post to the board
          </Link>
        ) : (
          <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 bg-moss text-cream rounded-full hover:bg-moss-dark transition self-start md:self-auto">
            Join to post
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-parchment/60 border border-fog rounded-2xl p-5 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft"/>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search titles, descriptions, streets…"
              className="w-full pl-10 pr-4 py-2.5 bg-cream border border-fog rounded-full text-sm focus:outline-none focus:border-moss"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <SegBtn active={kind==='all'} onClick={()=>setKind('all')}>All</SegBtn>
            <SegBtn active={kind==='offer'} onClick={()=>setKind('offer')}>Offering</SegBtn>
            <SegBtn active={kind==='need'} onClick={()=>setKind('need')}>Needing</SegBtn>
            <span className="w-px h-6 bg-fog self-center mx-1 hidden md:block"/>
            <SegBtn active={status==='all'} onClick={()=>setStatus('all')}>Any status</SegBtn>
            <SegBtn active={status==='open'} onClick={()=>setStatus('open')}>Open</SegBtn>
            <SegBtn active={status==='claimed'} onClick={()=>setStatus('claimed')}>Claimed</SegBtn>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-ink-soft"/>
          <button onClick={()=>setCat('all')} className={`text-xs px-3 py-1.5 rounded-full border ${cat==='all'?'bg-moss text-cream border-moss':'border-fog hover:border-ink-soft'}`}>All categories</button>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={()=>setCat(c.key)} className={`text-xs px-3 py-1.5 rounded-full border ${cat===c.key?'bg-moss text-cream border-moss':'border-fog hover:border-ink-soft'}`}>
              <span className="mr-1">{c.emoji}</span>{c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({length: 6}).map((_,i)=> (
            <div key={i} className="h-52 bg-parchment/60 border border-fog rounded-2xl animate-pulse"/>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="font-display italic text-3xl text-ink-soft mb-2">Nothing pinned here yet.</div>
          <p className="text-ink-soft mb-6">Try loosening the filters, or be the first to post.</p>
          {user && <Link to="/new/resource" className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta text-cream rounded-full"><Plus className="w-4 h-4"/> Post something</Link>}
        </div>
      ) : (
        <>
          <div className="text-sm text-ink-soft mb-4">{filtered.length} {filtered.length === 1 ? 'post' : 'posts'}</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => <ResourceCard key={r.id} r={r} />)}
          </div>
        </>
      )}
    </div>
  )
}

function SegBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-full border transition ${active?'bg-ink text-cream border-ink':'bg-cream border-fog hover:border-ink-soft text-ink-soft'}`}>{children}</button>
  )
}
