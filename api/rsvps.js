import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { event_id, user_id, user_name } = req.body || {};
      if (!event_id || !user_id) return res.status(400).json({ error: 'Missing fields' });
      // toggle
      const { data: existing, error: eErr } = await supabase.from('event_rsvps')
        .select('id').eq('event_id', event_id).eq('user_id', user_id).limit(1);
      if (eErr) throw eErr;
      if (existing && existing.length > 0) {
        const { error } = await supabase.from('event_rsvps').delete().eq('id', existing[0].id);
        if (error) throw error;
        return res.status(200).json({ rsvped: false });
      }
      const { error } = await supabase.from('event_rsvps').insert({ event_id, user_id, user_name: user_name || 'Neighbor' });
      if (error) throw error;
      return res.status(201).json({ rsvped: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('rsvps api error:', err);
    res.status(500).json({ error: err.message });
  }
}
