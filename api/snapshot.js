// /api/snapshot.js
// Shared snapshot storage via Vercel Blob
// GET: returns current and previous snapshots
// POST: saves a new snapshot (moves current → previous)

import { put, list, del, head } from '@vercel/blob';

export const config = {
  maxDuration: 10,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    // Return current and previous snapshot metadata + data
    try {
      const blobs = await list({ prefix: 'snapshots/' });
      const files = blobs.blobs || [];

      // Find current and previous
      const currentBlob = files.find(f => f.pathname === 'snapshots/current.json');
      const previousBlob = files.find(f => f.pathname === 'snapshots/previous.json');

      let current = null;
      let previous = null;

      if (currentBlob) {
        const resp = await fetch(currentBlob.url);
        if (resp.ok) current = await resp.json();
      }

      if (previousBlob) {
        const resp = await fetch(previousBlob.url);
        if (resp.ok) previous = await resp.json();
      }

      // Also get list of all archived snapshots (just metadata, not full data)
      const archives = files
        .filter(f => f.pathname.startsWith('snapshots/archive-'))
        .map(f => ({
          pathname: f.pathname,
          weekKey: f.pathname.replace('snapshots/archive-', '').replace('.json', ''),
          uploadedAt: f.uploadedAt,
          size: f.size,
        }))
        .sort((a, b) => b.weekKey.localeCompare(a.weekKey));

      return res.status(200).json({ current, previous, archives });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    // Save a new snapshot
    try {
      const snapshot = req.body;
      if (!snapshot || !snapshot.weekKey || !snapshot.playlists) {
        return res.status(400).json({ error: 'Invalid snapshot format' });
      }

      // First, try to load current to move it to previous
      try {
        const blobs = await list({ prefix: 'snapshots/current' });
        const currentBlob = (blobs.blobs || []).find(f => f.pathname === 'snapshots/current.json');
        if (currentBlob) {
          const resp = await fetch(currentBlob.url);
          if (resp.ok) {
            const oldCurrent = await resp.text();
            // Move to previous
            await put('snapshots/previous.json', oldCurrent, {
              access: 'public',
              contentType: 'application/json',
              addRandomSuffix: false,
            });
          }
        }
      } catch (e) {
        // No existing current, that's fine
      }

      const jsonStr = JSON.stringify(snapshot);

      // Save as current
      await put('snapshots/current.json', jsonStr, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });

      // Also archive by week key
      await put(`snapshots/archive-${snapshot.weekKey}.json`, jsonStr, {
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
