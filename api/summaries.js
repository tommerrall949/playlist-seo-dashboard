// /api/summaries.js — compact per-playlist, per-week ranking summaries.
//
// Reading every snapshot client-side would be ~13 MB. This endpoint reduces each
// snapshot to four numbers per playlist and returns roughly 30 KB, so the
// Listeners tab can show a ranking shift for any week without loading snapshots.
//
// The result is cached back into blob storage and rebuilt only when the set of
// snapshot weeks changes, so the expensive pass happens once per new snapshot.

import { put, list } from '@vercel/blob';

export const config = { maxDuration: 60 };

const WEEK_KEY = /^\d{4}-W\d{2}$/;
const CACHE_PATH = 'summaries/cache.json';

const VOL_ORDER = { very_high: 5, high: 4, medium: 3, low: 2, very_low: 1 };

// Reduce one snapshot to { pid: [keywordCount, avgPosition, numberOnes, strikeCount] }.
function summarise(snapshot) {
  const out = {};
  for (const [pid, rankings] of Object.entries(snapshot.playlists || {})) {
    if (!rankings || !rankings.length) continue;
    let sum = 0, ones = 0, strike = 0;
    for (const r of rankings) {
      sum += r.position;
      if (r.position === 1) ones++;
      if (r.position >= 2 && r.position <= 5 && (VOL_ORDER[r.volume_estimation] || 0) >= 3) strike++;
    }
    out[pid] = [
      rankings.length,
      Math.round((sum / rankings.length) * 100) / 100,
      ones,
      strike,
    ];
  }
  return out;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const blobs = await list({ prefix: 'snapshots/' });
    const snaps = (blobs.blobs || [])
      .map(f => ({
        weekKey: f.pathname.replace(/^snapshots\//, '').replace(/\.json$/, ''),
        url: f.url,
      }))
      .filter(s => WEEK_KEY.test(s.weekKey))
      .sort((a, b) => a.weekKey.localeCompare(b.weekKey));

    if (!snaps.length) {
      return res.status(200).json({ weeks: [], summaries: {} });
    }

    const signature = snaps.map(s => s.weekKey).join(',');

    // Serve the cache when it was built from exactly this set of weeks.
    if (req.query.rebuild !== '1') {
      try {
        const cacheBlob = (await list({ prefix: CACHE_PATH })).blobs
          ?.find(f => f.pathname === CACHE_PATH);
        if (cacheBlob) {
          const cached = await (await fetch(cacheBlob.url)).json();
          if (cached && cached.signature === signature) {
            return res.status(200).json({ ...cached, cached: true });
          }
        }
      } catch {
        // fall through and rebuild
      }
    }

    const summaries = {};
    for (const s of snaps) {
      const resp = await fetch(s.url);
      if (!resp.ok) continue;
      summaries[s.weekKey] = summarise(await resp.json());
    }

    const payload = {
      signature,
      weeks: Object.keys(summaries).sort(),
      builtAt: new Date().toISOString(),
      summaries,
    };

    try {
      await put(CACHE_PATH, JSON.stringify(payload), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
    } catch {
      // caching is best-effort; still return the data
    }

    return res.status(200).json({ ...payload, cached: false });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
