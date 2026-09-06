import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import supabase from '../lib/supabase'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, displayName } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-1 py-2 text-sm tracking-wide transition-colors border-b-2 ${
      isActive ? 'border-terracotta text-ink' : 'border-transparent text-ink-soft hover:text-ink'
    }`

  return (
    <header className="sticky top-0 z-40 bg-cream/85 backdrop-blur border-b border-fog">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="inline-flex w-9 h-9 rounded-full bg-moss items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-ochre" fill="currentColor"><path d="M12 3c-3 3-5 6-5 9a5 5 0 0 0 10 0c0-3-2-6-5-9z"/><circle cx="12" cy="18" r="2" fill="#c65d3a"/></svg>
          </span>
          <div className="leading-tight">
            <div className="font-display text-2xl italic text-ink">Kinfolk</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-soft -mt-1">Neighborhood Exchange</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink to="/board" className={linkCls}>The Board</NavLink>
          <NavLink to="/events" className={linkCls}>Gatherings</NavLink>
          {user && <NavLink to="/profile" className={linkCls}>My Corner</NavLink>}
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/new/resource" className="px-4 py-2 bg-terracotta text-cream rounded-full text-sm hover:bg-terracotta/90 transition">Post</Link>
              <button onClick={signOut} className="text-sm text-ink-soft hover:text-ink">Sign out</button>
              <span className="text-xs text-ink-soft">Hi, {displayName}</span>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-moss text-cream rounded-full text-sm hover:bg-moss-dark transition">Join in</Link>
          )}
        </nav>

        <button className="md:hidden text-ink" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-fog bg-cream">
          <div className="px-6 py-4 flex flex-col gap-3">
            <NavLink to="/board" onClick={()=>setOpen(false)} className="py-2">The Board</NavLink>
            <NavLink to="/events" onClick={()=>setOpen(false)} className="py-2">Gatherings</NavLink>
            {user && <NavLink to="/profile" onClick={()=>setOpen(false)} className="py-2">My Corner</NavLink>}
            {user ? (
              <>
                <Link to="/new/resource" onClick={()=>setOpen(false)} className="py-2 text-terracotta">Post something</Link>
                <button onClick={() => { setOpen(false); signOut() }} className="py-2 text-left text-ink-soft">Sign out</button>
              </>
            ) : (
              <Link to="/login" onClick={()=>setOpen(false)} className="py-2 text-moss">Join in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
