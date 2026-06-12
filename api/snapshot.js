import { put, list } from '@vercel/blob';

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const blobs = await list({ prefix: 'snapshots/' });
      const files = (blobs.blobs || [])
        .filter(f => f.pathname.startsWith('snapshots/'))
        .sort((a, b) => b.pathname.localeCompare(a.pathname));

      let current = null;
      let previous = null;

      if (files.length > 0) {
        const resp = await fetch(files[0].url);
        if (resp.ok) current = await resp.json();
      }
      if (files.length > 1) {
        const resp = await fetch(files[1].url);
        if (resp.ok) previous = await resp.json();
      }

      const archives = files.map(f => ({
        pathname: f.pathname,
        weekKey: f.pathname.replace('snapshots/', '').replace('.json', ''),
        uploadedAt: f.uploadedAt,
        size: f.size,
      }));

      return res.status(200).json({ current, previous, archives });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const snapshot = req.body;
      if (!snapshot || !snapshot.weekKey || !snapshot.playlists) {
        return res.status(400).json({ error: 'Invalid snapshot format' });
      }

      await put(`snapshots/${snapshot.weekKey}.json`, JSON.stringify(snapshot), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });

      return res.status(200).json({ success: true, weekKey: snapshot.weekKey });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
