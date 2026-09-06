import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id, user_id, claimed_by, limit } = req.query;
      let q = supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (id) q = q.eq('id', Number(id));
      if (user_id) q = q.eq('user_id', user_id);
      if (claimed_by) q = q.eq('claimed_by', claimed_by);
      if (limit) q = q.limit(Number(limit));
      const { data, error } = await q;
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { kind, category, title, description, location, contact, user_id, user_name } = req.body || {};
      if (!kind || !category || !title || !description || !user_id) return res.status(400).json({ error: 'Missing fields' });
      const { data, error } = await supabase.from('resources').insert({
        kind, category, title, description,
        location: location || null, contact: contact || null,
        user_id, user_name: user_name || 'Neighbor', status: 'open',
      }).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, action, user_id, user_name, status } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      if (action === 'claim') {
        const { data, error } = await supabase.from('resources')
          .update({ status: 'claimed', claimed_by: user_id, claimed_by_name: user_name || 'Neighbor' })
          .eq('id', id).eq('status', 'open').select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      if (action === 'status') {
        const patch = { status };
        if (status === 'open') { patch.claimed_by = null; patch.claimed_by_name = null; }
        const { data, error } = await supabase.from('resources').update(patch).eq('id', id).select().single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      return res.status(400).json({ error: 'Unknown action' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'Missing id' });
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('resources api error:', err);
    res.status(500).json({ error: err.message });
  }
}
