// /api/listeners.js — serves weekly new-listener figures per playlist.
//
// If LISTENER_CSV_URL is set (a Google Sheet published as CSV), the sheet is
// fetched and parsed on each request so the tab stays current for everyone.
// If it is not set, the client falls back to the dataset bundled in the app.
//
// Expected sheet shape (as exported):
//   row 1: <blank> | "…Spotify Playlist ID" | <playlistId> | <playlistId> | …
//   row 2: <blank> | "…Streamed At Dt Date" | <metric label>  | <metric label> | …
//   row 3+: <index> | YYYY-MM-DD           | <number>        | <number>       | …
//
// Note: the metric label in row 2 reads "Average streams per track" but the
// values are new-listener counts. Confirmed with the data owner.

export const config = { maxDuration: 30 };

// Minimal RFC-4180 parser: handles quoted fields and embedded commas.
function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field); field = '';
    } else if (ch === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// ISO-8601 week key, matching the ranking snapshot format (e.g. 2026-W32).
function isoWeekKey(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  if (isNaN(d)) return null;
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;          // Mon=1 … Sun=7
  t.setUTCDate(t.getUTCDate() + 4 - day);  // nearest Thursday
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function buildWeekly(rows) {
  if (rows.length < 3) throw new Error('Sheet has too few rows');
  const ids = rows[0].slice(2).map(s => s.trim()).filter(Boolean);

  // pid -> weekKey -> { total, days }
  const acc = {};
  ids.forEach(id => { acc[id] = {}; });
  const dailyByWeek = {}; // pid -> weekKey -> number[]  (for reliability)
  ids.forEach(id => { dailyByWeek[id] = {}; });

  let minDate = null, maxDate = null;

  for (let r = 2; r < rows.length; r++) {
    const dateStr = (rows[r][1] || '').trim();
    if (!dateStr) continue;
    const wk = isoWeekKey(dateStr);
    if (!wk) continue;
    if (!minDate || dateStr < minDate) minDate = dateStr;
    if (!maxDate || dateStr > maxDate) maxDate = dateStr;

    for (let c = 0; c < ids.length; c++) {
      const cell = (rows[r][c + 2] || '').trim();
      if (cell === '') continue;
      const n = Number(cell);
      if (!isFinite(n)) continue;
      const id = ids[c];
      if (!acc[id][wk]) acc[id][wk] = { total: 0, days: 0 };
      acc[id][wk].total += n;
      acc[id][wk].days += 1;
      (dailyByWeek[id][wk] ||= []).push(n);
    }
  }

  const weeks = {}, reliability = {};
  for (const id of ids) {
    const series = Object.entries(acc[id])
      .map(([wk, v]) => [wk, v.total, v.days])
      .sort((a, b) => a[0].localeCompare(b[0]));
    if (!series.length) continue;
    weeks[id] = series;

    // Signal ratio: variation between weeks vs typical variation within a week.
    // Below ~1 means weekly moves are indistinguishable from daily noise.
    const withinSDs = [], weekMeans = [];
    for (const [wk, vs] of Object.entries(dailyByWeek[id])) {
      if (vs.length < 4) continue;
      const m = vs.reduce((a, b) => a + b, 0) / vs.length;
      weekMeans.push(m);
      withinSDs.push(Math.sqrt(vs.reduce((s, v) => s + (v - m) ** 2, 0) / vs.length));
    }
    let signal = null;
    if (withinSDs.length && weekMeans.length > 1) {
      const wsd = withinSDs.reduce((a, b) => a + b, 0) / withinSDs.length;
      const mm = weekMeans.reduce((a, b) => a + b, 0) / weekMeans.length;
      const bsd = Math.sqrt(weekMeans.reduce((s, v) => s + (v - mm) ** 2, 0) / weekMeans.length);
      if (wsd > 0) signal = Math.round((bsd / wsd) * 100) / 100;
    }
    reliability[id] = {
      weeks: series.length,
      fullWeeks: series.filter(s => s[2] >= 7).length,
      signal,
    };
  }

  return {
    metric: 'New listeners per day',
    sourceNote: "Source header reads 'Average streams per track'; values are new-listener counts.",
    dateRange: [minDate, maxDate],
    weeks,
    reliability,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = process.env.LISTENER_CSV_URL;
  if (!url) {
    // Not configured — client uses its bundled copy.
    return res.status(404).json({ error: 'LISTENER_CSV_URL not configured', useBundled: true });
  }

  try {
    const resp = await fetch(url, { redirect: 'follow' });
    if (!resp.ok) {
      return res.status(502).json({ error: `Sheet fetch failed (${resp.status})`, useBundled: true });
    }
    const text = await resp.text();
    if (text.trimStart().startsWith('<')) {
      // Google serves an HTML error page when a sheet isn't actually published.
      return res.status(502).json({
        error: 'Sheet returned HTML, not CSV — check it is published to the web as CSV',
        useBundled: true,
      });
    }
    return res.status(200).json(buildWeekly(parseCSV(text)));
  } catch (err) {
    return res.status(500).json({ error: err.message, useBundled: true });
  }
}
