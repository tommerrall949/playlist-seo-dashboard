// /api/snapshot.js — shared snapshot storage via Vercel Blob
//
//   GET  /api/snapshot              → { archives: [...] }  (metadata only, fast)
//   GET  /api/snapshot?week=2026-W24 → { snapshot: {...} }  (full data for one week)
//   POST /api/snapshot              → saves a snapshot under its weekKey
//
// Only well-formed week keys (YYYY-Www) are listed, so stray/test blobs are ignored.

import { put, list } from '@vercel/blob';

export const config = {
  maxDuration: 60,
};

const WEEK_KEY = /^\d{4}-W\d{2}$/;

const pathnameToWeek = (pathname) =>
  pathname.replace(/^snapshots\//, '').replace(/\.json$/, '');

async function listArchives() {
  const blobs = await list({ prefix: 'snapshots/' });
  return (blobs.blobs || [])
    .map((f) => ({
      weekKey: pathnameToWeek(f.pathname),
      url: f.url,
      uploadedAt: f.uploadedAt,
      size: f.size,
    }))
    .filter((a) => WEEK_KEY.test(a.weekKey))
    .sort((a, b) => b.weekKey.localeCompare(a.weekKey)); // newest first
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const archives = await listArchives();
      const { week } = req.query;

      // No week requested → just the index of available weeks.
      if (!week) {
        return res.status(200).json({
          archives: archives.map(({ weekKey, uploadedAt, size }) => ({
            weekKey,
            uploadedAt,
            size,
          })),
        });
      }

      const match = archives.find((a) => a.weekKey === week);
      if (!match) {
        return res.status(404).json({ error: `No snapshot for week ${week}` });
      }

      const resp = await fetch(match.url);
      if (!resp.ok) {
        return res.status(502).json({ error: 'Could not read snapshot from storage' });
      }

      return res.status(200).json({ snapshot: await resp.json() });
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
      if (!WEEK_KEY.test(snapshot.weekKey)) {
        return res.status(400).json({ error: 'weekKey must look like 2026-W24' });
      }

      // Single write — overwrites if this week was already saved.
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
