import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Board from './pages/Board'
import Events from './pages/Events'
import Profile from './pages/Profile'
import NewResource from './pages/NewResource'
import NewEvent from './pages/NewEvent'
import Login from './pages/Login'
import ResourceDetail from './pages/ResourceDetail'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:id" element={<ResourceDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/new/resource" element={<ProtectedRoute><NewResource /></ProtectedRoute>} />
          <Route path="/new/event" element={<ProtectedRoute><NewEvent /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer className="border-t border-fog bg-parchment/60 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            <span className="font-display italic text-lg text-moss">Kinfolk</span>
            <span>· built by neighbors, for neighbors</span>
          </div>
          <div>© {new Date().getFullYear()} · A cooperative resource exchange</div>
        </div>
      </footer>
    </div>
  )
}
