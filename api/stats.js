import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const [{ data: resources }, { data: events }] = await Promise.all([
      supabase.from('resources').select('user_id, status'),
      supabase.from('events').select('id, event_date'),
    ]);
    const neighbors = new Set((resources || []).map(r => r.user_id)).size;
    const fulfilled = (resources || []).filter(r => r.status === 'fulfilled' || r.status === 'claimed').length;
    const now = Date.now();
    const upcoming = (events || []).filter(e => new Date(e.event_date).getTime() > now).length;
    return res.status(200).json({
      resources: (resources || []).length,
      fulfilled,
      neighbors,
      events: upcoming,
    });
  } catch (err) {
    console.error('stats api error:', err);
    res.status(500).json({ error: err.message });
  }
}
