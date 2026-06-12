// /api/rankings.js - Proxies a single playlist's rankings from PlaylistRankings.com

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.PLAYLIST_RANKINGS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'PLAYLIST_RANKINGS_API_KEY not configured' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing playlist id parameter' });

  try {
    const response = await fetch(
      `https://www.playlistrankings.com/api/playlists/${id}/rankings`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    if (response.status === 429) return res.status(429).json({ error: 'Rate limited', retryAfter: 30 });
    if (!response.ok) return res.status(response.status).json({ error: `API returned ${response.status}` });

    const data = await response.json();
    const rankings = Array.isArray(data) ? data : (typeof data === 'object' && data !== null) ? Object.values(data) : [];

    return res.status(200).json(rankings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
