import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { user_id } = req.query;
      const { data: events, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
      if (error) throw error;
      // fetch rsvps for counts
      const { data: rsvps, error: e2 } = await supabase.from('event_rsvps').select('event_id, user_id');
      if (e2) throw e2;
      const counts = {};
      const mine = new Set();
      for (const r of rsvps || []) {
        counts[r.event_id] = (counts[r.event_id] || 0) + 1;
        if (user_id && r.user_id === user_id) mine.add(r.event_id);
      }
      const enriched = (events || []).map(ev => ({
        ...ev,
        rsvp_count: counts[ev.id] || 0,
        user_rsvped: mine.has(ev.id),
      }));
      return res.status(200).json(enriched);
    }

    if (req.method === 'POST') {
      const { title, description, location, event_date, organizer_id, organizer_name } = req.body || {};
      if (!title || !location || !event_date || !organizer_id) return res.status(400).json({ error: 'Missing fields' });
      const { data, error } = await supabase.from('events').insert({
        title, description: description || '', location, event_date,
        organizer_id, organizer_name: organizer_name || 'Neighbor',
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('events api error:', err);
    res.status(500).json({ error: err.message });
  }
}
