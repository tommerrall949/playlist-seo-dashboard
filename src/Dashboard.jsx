import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// No bundled seed data: all snapshots live in shared blob storage, so the
// dashboard never shows stale numbers when the API is unavailable.

const NAMES = {"04QkAvOjyjVQoJJ4YRodYg":"Acoustic Pop Covers - soft guitar & piano versions of your favorite chart hits","0IVfm1dyu4h8rTJmdDUMjo":"Neoclassical Calm \ud83c\udfbb \u2013 modern piano and strings for peaceful moments","0KWNDmgdm1qpjkFR5Afc9B":"Percussive Rhythms \u2013 Indian ambient sounds for yoga, reiki & healing","0LdsXxmrGpxJV7rpwsHgKd":"Zen Flute \ud83e\ude88 - ambient tunes for meditation, relaxation and inner peace","0LqAOilr2am1uzcPFpLZuq":"Solfeggio Sleep (528Hz) - attract love, restore health, reduce stress","0OBSi7nderWhiyVIN3nQNw":"Bedtime Fairytales","0TQYko7naQAlnllbtxlCaY":"Power Workout Anthems for Intense Training","0WTzMv843tOnMvq5jixkmg":"Low Light Jazz - soft jazz in dim spaces","0Z6hz35c8tkW9DyTRpc0jS":"Lofi Garden \ud83c\udf38\ud83e\udebb\ud83c\udf3a - chill beats and nature sounds for relaxation","0aZeIH2WrCqAOgOwqRUyIc":"After Hours Jazz - slow jazz for late nights","0g2H6dNe86WT25EvSRuTnx":"Deep House - late nights, steady pulse","0pQus2qwWo0mBQ3kJYQzWs":"Guitar Study - focused listening without distraction","0q63eXTs60hXalSzQ3mJYL":"Naptime Guitar - gentle lullabies for sleepy babies","0u5dM74plIjBzX0zZ6Q4df":"Lover Boy Lofi \ud83d\udc8c - soft confidence, steady feelings","0yQ6AqQTIo9rEqxEhQEgnn":"8 Hour Insomnia Relief - Binaural Sleep","0yoQoIGnCTqXp0C4TPoJ1O":"Sleep Sounds \ud83d\udca4 - calming ambient music for insomnia, adhd and anxiety","0z3RkWPJaw2VcwN56TFUSi":"Lofi Bath \ud83d\udec1 - soothing beats for relaxation","0zrc9507yJkRV6ruNgcoSM":"Tranquil Guitar - relaxing ambient guitar music for peace and mindfulness","15wOEDPlVknsviEiybfP5i":"Anxiety & Stress Relief - ambient music that holds you steady","1Fiab2KqYZhOVpRpFIKeVu":"Manifest Love: Solfeggio Frequencies\u2728\ud83d\udc96","1NBU7r2Ay6cDC8d6HHe4Un":"Piano Covers - peaceful and calming music for relaxing moments \ud83c\udfb9","1fCJhxgowgHq9OBGvuREWi":"Acoustic Love Songs \ud83d\udc9c \ud83d\udcbf - romantic covers for heartfelt moments","1mXjVANI52YlC9p8ezrQOi":"Electric Guitar Focus - deep work, no distractions","1t124T9H0R7ccf4aMgtRug":"Still Piano \ud83c\udfb9 \u2013 peaceful piano for sleep, focus & calm moments","1tLQXlG5x9AoNZ5NoGIDmI":"Run, Row, Roar - Electronic Cardio Workout","1u5T2GRBXJ8t41t0ux3PrC":"Electronic Study \ud83c\udfa7 - focused beats for creativity","1vhosmBpb9SHRoHvCXoqzp":"Soothing Meditation\u2728\ud83c\udfde\ufe0f - ambient sounds for spa, yoga and wellness","20bFT8C1d7DjZWBW2yIanh":"Rainy Night Jazz - warm jazz for drizzly nights","221BvLFcVoeOzqSawbT1eA":"Lofi Meditation \ud83e\uddd8\u200d\u2640\ufe0f - calming beats for mindfulness","22PfLqpnmkC2vmnSfeJLAW":"Paris Jazz - charming caf\u00e9 vibes from France","29lHhcNGMfklsttXimjGqZ":"Quiet Hours Jazz - minimal jazz for late nights","2ClTRLxqCo0XLWM0i5emPj":"Soft Instrumental Guitar for Babies (12H)","2PAnDP8a3QaK9jqMEdGOfQ":"Lofi Sleep \ud83d\udca4 - mellow beats for a restful night","2QdwrCBPnkzLQdT8MG4N7s":"Sleepy Jazz with Rain - 8 hours rest","2T6OYYXolbGW5al7CN9pyQ":"Breathing Meditation - slow, steady, guided calm","2i7K8ZvdvaexHQ89acqwai":"Piano Healing (Slowed & Reverbed) - slow keys in open space","2iTqioIuus769rvcqm34pm":"Gentle Guitar - soothing melodies for relaxation and mindfulness","2mFVTsr2oxQKChKY4b8Ov5":"Lofi Latin \ud83d\udc83 - tropical beats with a bossa twist","2nxDM4Ta6zLDnB2yo0AyXm":"Guitar Therapy - soothing acoustic melodies to unwind to \ud83d\udc86\ud83c\udffd","2o0iDBT6JdzLoMEKEH9t09":"Sleep All Night - Binaural Atmospheres","2oYnQqYNtVntgFmQzJ8w9e":"Christian Piano Hymns - worship without words","2p4oGGcZOmVVW9WIa5G6PK":"Lofi Study Beats To Pass The Midterm","2pUNMj1WLtYKmmMvkaNhQD":"Cozy Piano for Deep Sleep (8+ Hours)","2tJpwAKOc3f4ibtfQ2fHN1":"Plant Frequencies - where sound takes root","2uDnTHTi1p3wfaUJiuqiy1":"Sleeping for Hours \ud83d\udca4","2w2J0f3Fuorw01qDoqGPRQ":"Background Jazz - chill and sophisticated lounge tunes","2xjUohMRmALykvtyWO9RgC":"Sunset House - light rhythms, easy energy","30z2Uvti6avpIBjJjSzOJ4":"Pregnancy Meditation & Relaxation - calm for you, and the life inside","34RGdLe7N46QKey8oPGHMQ":"Water Soundscapes for Deep Relaxation","35OuNZzN4A85soW2WJhmUG":"Late Night Smooth Jazz - soft, romantic background","3CugtnMUzjkXX1H7fWJw67":"Lofi Gaming \ud83d\udd79\ufe0f - chill beats for epic sessions","3D8QbyTorKcBXs0VhOI29g":"Soft Piano Sweetheart \ud83c\udf39\ud83c\udfb9 - warmth in every key","3JmB7vnFNavW3LsUXDaclM":"Lover Girl Lofi \u2763\ufe0f - pink skies and late-night feelings","3JsH1Y3OYCliIgCGJaI2QT":"Calm Cat \ud83d\udc31 \u2013 relaxing music for sleeping, anxiety relief & peace","3Op4ute4JuhDUtM7FoQBId":"ADHD Focus Music  \ud83d\udc69\ud83c\udffb\u200d\ud83d\udcbb - cut out the noise","3P0nl9KBO9VRWiZGqKgkwk":"Feel-Good Lofi - good energy, no effort","3SAvQjFcM8UhWBsYkmI8Et":"Instrumental Love Songs  \ud83c\udf88 - romance without words","3VRWOYBfdnm0C978OKa0uv":"Broken Heart Jazz \ud83d\udc94\ud83c\udfba - soft music for hard moments","3XXQroAuQgewKG0fLXEOzf":"Upbeat Happy Hits for Positive Energy","3c4DYqXIQdWRzS3JwVFlBG":"Ambient Guitar for Sleep - gentle strums for 8 hours of rest","3iHDLAN1n6oGFJ3RiU0h65":"Ambient Energy Cleanse - sounds for emotional restoration","3j3d3essIaiBhSVNKmWkJp":"Jazz Snooze - sleepy swing and candlelight calm","3jmdfJOlbtBuJjTZu2dt9n":"Soft Guitar Sleep - ambient & subtle beats","3miFpeJ6w5fiOe7SPaMjng":"Atmospheric Sleep - drift into stillness","3nLPQFAL8GqBtjLMJBQLrs":"Christian Lullabies - soft songs of comfort and faith","3oSth5cpzQFIDtFz3tktLX":"Evening Jazz - smooth tunes for warm, late-night vibes","3pBoRgk1pGsz82vDvbUYMP":"Rainy Jazz  \u2614\ufe0f \ud83c\udfba - smooth rainy jazz for reading and studying","3sEuLRU3oaS1QPyjCiNAq4":"Moonlit Jazz Caf\u00e9 - soft jazz under city lights","3tIgSaR1F86qWnVK1FBFEI":"Healing 528Hz - deep ambient sleep","3yvyOHGzWsfZ01aiPIdobz":"Frequency Therapy \ud83e\uddd8\u200d\u2640\ufe0f\u2728 - solfeggio, singing bowls & 432Hz","47Mfwi75aw9a0vUbwMjGgo":"Deep Sleep Piano (Felted & Soft)","47T8hdxgku2lJhnim37Pxy":"High Intensity Training - nonstop pace, zero mercy","4DfIxfW4dYEA2bESKkXybL":"Sunset Lounge \ud83c\udfd6\ufe0f - house and dance music for vacation mode \ud83c\udf34 ","4JfWAUpt3f3qjOjtztCEwF":"Rainy Day Romance \ud83c\udf27\ufe0f\ud83d\udc98 - soft moments behind the glass","4OQ4PWetEWFEUGGQynrNmV":"Late Night Lounge Jazz - smooth sax past midnight","4S5A1kgdCyAr4h87AZNzRh":"Study Beats \ud83c\udfa7 - lofi beats and ambient chillhop to relax to \ud83d\udcda","4SS97ZLuDKfAkNYYudsORc":"Wind-Down Jazz - mellow sax for late nights","4XbhZYcauSlivp9Zpii3ZM":"Jazz Yoga - serene and soulful flow vibes","4ZmvSRxuOTrDCpHVibgm7k":"Ambient Piano - slow notes, open space","4aQngEW0tSiOvgVNq4RY5Q":"Pomodoro Lofi 25/5 - let time do the thinking","4hDlt9QKqa74xTSRRPD8Rk":"Piano Dreams - soft and peaceful night melodies","4hIYkLlyd0X9Ca99kVCklD":"2010s Throwback Workout Hits","4nh0PsP96jdArU3QGK7c8g":"Celestial Ambience & Relaxation - slow atmospheres, endless space","4okxpsvl9zGntySwuPZlSF":"Sleepy Jazz - relaxing jazz tunes for a good night's sleep","4rot8gbt6BPixLmVhFqSA2":"Lofi Love Lounge \ud83d\udc9e - a quiet kind of romance","4vdIdiOa3FxhyHdGKqUc2F":"Morning Jazz - gentle vibes to start your day","4w2aPNOCvQdmgAOgDPCn7m":"Coffee Break Jazz - slow, easy background flow","4wia2rYQB1CM6CmPHNJb0V":"Lo-Fi Lounge\ud83c\udfb7 \ud83c\udfa7 - chill beats to focus and study to","4yVeDrE7KNJi0JbOdkmoqp":"Spiritual Healing Soundscapes - let the vibrations flow","50B2IPVcRzADb3vG9xaVMq":"Calm Piano for Babies \ud83c\udf19 \u2013 soothing lullabies for sleep, naps, newborns & toddlers","50cnwTxU70x8zEBI8QroFp":"Jazz Brunch - smooth morning jazz for cozy starts & easy days","51fPIwhXwsKtpLAMo41G3L":"Heavy Weights - heavy bass for heavy lifts","5AtiqHgg1KJ3abdZ4LBcWx":"Romantic Jazz - soft, intimate, late-night mood","5ExpyVP5vNtYbQIBtuMwXm":"EDM Bass Boost for High-Energy Training","5JWuIssnwfNGNkyTf6LwLs":"Jazz House - timeless jazz energy, modern flow","5NmwqEGuab0J3ZJj4I1vMz":"Bossa Nova - cozy and relaxing Brazilian vibes","5U1ku6iIUmYzRYHxcPheGt":"Calming Music for Dogs \ud83d\udc3e \u2013 anxiety relief, sleep, stress & barking control","5ZnWndwVB9iEkzvnSOkik3":"Instrumental Guitar Covers - acoustic pop covers of your favorite hit songs","5k340LuMAtVb5hIKLqwtvO":"Baby Sleep - soothing piano lullabies for sweet dreams","5n0u1OnGs3Ni1yJlxBe7Sq":"Binaural Beats: Anxiety Relief","5oAWnWPPZn8rRg05OwLJK9":"A Full Night's Sleep - harp & flute atmospheres","5sAL7yLEDEbH7HZsjoCe6T":"Cocktail Piano - elegance without effort","624rLjogC1EJkNOZCqU6Qr":"Candlelight Jazz Club - intimate low-lit jazz","64TdxsdAWzmF293K9dlxG2":"Deep Sleep Sounds - gentle, uninterrupted rest","65PEB2FbkIrvwjbKdObvhJ":"Bossa Nova Breeze \ud83d\udc83\ud83d\udd76\ufe0f - chill Brazilian jazz for relaxing & focus","6DhZCUtkY85kvF6GtTIh2a":"Date Night Jazz \u2665\ufe0f  \u2728 - warm melodies for close company","6Drs3IryMIG7fJS09fVJuU":"Tropical House \ud83c\udfdd\ufe0f \u2013 summer vibes, melodic beats & beach escapes","6GP5sIYGMknGhENeUpThVV":"Baby Music Box - gentle melodies for little dreams","6L5ZlqyFluhvZbgNIm14dh":"Deep Sleep Nature & Ambient Sounds","6LFVGq9wTRub6zjwqHpgVx":"Serene Harp & Flute - sleep through the night","6ON2RtcJj1NDtnq8Pr2EOD":"Sleepy Ambient Guitar - soft strings all night","6UYXSXrfs0VNY1Goza3QZv":"Midnight Rain Jazz - sleepy jazz with rainy backgrounds","6W6rS6bVorkt905sVKIy1K":"Calisthenics - deep bass for full-body control","6dHQ58lU9R9g74zG6vBfW9":"Overnight Soft Lofi Sleep (8 Hours)","6fIQBFxAOqpM5gOUWiJx6l":"Lofi Japan \ud83c\uddef\ud83c\uddf5 - anime-inspired chill beats","6pfKBpeErmqUcpynIzdmYk":"Twilight Jazz Bar - mellow jazz into the night","6tN90yxVHxbPn21gj84KiU":"Easygoing Workout Music for Steady Training","6yeCm2murxH0cwGVFzjN6B":"Electric Guitar Focus - concentrate at work","7FGQEc5uHWaNO9de8ukfnP":"Morning Calm - gentle piano for a soft start","7KG8SOcTA7DuFrpDsx5qAD":"Calm Music for Plants \ud83c\udf3f \u2013 growth, healing & relaxation","7MNOymkoG2Oqr1oeBJ27P7":"Calm Guitar Sleep - Electroacoustic Atmospheres","7autxavukBbD6EHLBxk344":"The New York Jazz Bar - late-night, dim-lit atmosphere","7i4KRmS48nvafSjmGpMMOJ":"Chill House Vibes \ud83c\udf05 \u2013 smooth beats for summer days","7oWiDbWFTYQ0IKINm5kdS5":"Quiet Lofi Sleep Music (8 Hour Mix)","7uguXkNbx0QrPd3hzUbhoS":"Background Guitar for ADHD - let the noise organise itself"};

// The 125 tracked playlists — same list the names map is keyed by.
const ALL_IDS = Object.keys(NAMES);

const VOL_ORDER = { very_high: 5, high: 4, medium: 3, low: 2, very_low: 1 };
const VOL_LABEL = { very_high: "Very High", high: "High", medium: "Medium", low: "Low", very_low: "Very Low" };
const VOL_CLR = { very_high: "#22c55e", high: "#4ade80", medium: "#facc15", low: "#f97316", very_low: "#94a3b8" };

const API_BASE = "https://playlist-seo-dashboard.vercel.app";

const getWeekKey = () => {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
};

export default function Dashboard() {
  const [archives, setArchives] = useState([]);
  const [viewWeek, setViewWeek] = useState(null);
  const [compareWeek, setCompareWeek] = useState(null);
  const [data, setData] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [tab, setTab] = useState("overview");
  const [filterCountry, setFilterCountry] = useState("ALL");
  const [filterVolume, setFilterVolume] = useState("ALL");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(null);
  const cache = useRef(new Map());
  const PAGE_SIZE = 30;

  // Fetch one week's full snapshot, memoised so switching back is instant.
  const loadSnapshot = useCallback(async (weekKey) => {
    if (!weekKey || weekKey === "NONE") return null;
    if (cache.current.has(weekKey)) return cache.current.get(weekKey);
    const resp = await fetch(`/api/snapshot?week=${encodeURIComponent(weekKey)}`);
    if (!resp.ok) throw new Error(`Could not load ${weekKey}`);
    const { snapshot } = await resp.json();
    cache.current.set(weekKey, snapshot);
    return snapshot;
  }, []);

  // On mount: get the list of available weeks, default to newest vs the one before.
  const loadArchives = useCallback(async () => {
    const resp = await fetch("/api/snapshot");
    if (!resp.ok) throw new Error("Could not list snapshots");
    const { archives: list } = await resp.json();
    setArchives(list || []);
    return list || [];
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const list = await loadArchives();
        if (list.length > 0) {
          setViewWeek(list[0].weekKey);
          setCompareWeek(list[1] ? list[1].weekKey : "NONE");
          return;
        }
      } catch (err) {
        console.log("No shared snapshots available, using seed data");
      }
      setArchives([]);
    })();
  }, [loadArchives]);

  // Load whichever week is selected for viewing.
  useEffect(() => {
    if (!viewWeek) return;
    let cancelled = false;
    (async () => {
      setLoadingWeek(true);
      try {
        const snap = await loadSnapshot(viewWeek);
        if (!cancelled && snap) setData(snap);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoadingWeek(false);
      }
    })();
    return () => { cancelled = true; };
  }, [viewWeek, loadSnapshot]);

  // Load whichever week is selected for comparison.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!compareWeek || compareWeek === "NONE") {
        setPrevData(null);
        return;
      }
      try {
        const snap = await loadSnapshot(compareWeek);
        if (!cancelled) setPrevData(snap);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { cancelled = true; };
  }, [compareWeek, loadSnapshot]);

  // Refresh: pull every playlist, save as this week's snapshot, then view it.
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setRefreshProgress({ done: 0, total: ALL_IDS.length });

    const allPlaylists = {};

    for (let i = 0; i < ALL_IDS.length; i++) {
      const id = ALL_IDS[i];
      try {
        const resp = await fetch(`/api/rankings?id=${id}`);
        if (resp.status === 429) {
          await new Promise(r => setTimeout(r, 10000));
          const retry = await fetch(`/api/rankings?id=${id}`);
          allPlaylists[id] = retry.ok ? await retry.json() : [];
        } else if (resp.ok) {
          allPlaylists[id] = await resp.json();
        } else {
          allPlaylists[id] = [];
        }
      } catch {
        allPlaylists[id] = [];
      }
      setRefreshProgress({ done: i + 1, total: ALL_IDS.length });
      await new Promise(r => setTimeout(r, 1500));
    }

    const weekKey = getWeekKey();
    const snapshot = { weekKey, fetchedAt: new Date().toISOString(), playlists: allPlaylists };

    // Save for the whole team, then point the view at it.
    try {
      const saveResp = await fetch("/api/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      if (!saveResp.ok) throw new Error(await saveResp.text());

      cache.current.set(weekKey, snapshot);
      const list = await loadArchives();
      setViewWeek(weekKey);
      // Compare against the most recent week that isn't the one we just saved.
      const earlier = list.find(a => a.weekKey !== weekKey);
      setCompareWeek(earlier ? earlier.weekKey : "NONE");
    } catch (err) {
      console.error("Failed to save shared snapshot:", err);
      // Still show what we just pulled, even if the save failed.
      setData(snapshot);
    }

    setRefreshing(false);
    setRefreshProgress(null);
  }, [loadArchives]);

  const analytics = useMemo(() => {
    if (!data) return null;
    const all = [];
    const stats = {};
    const countries = new Set();

    Object.entries(data.playlists).forEach(([pid, rankings]) => {
      if (!rankings || !rankings.length) return;
      const filtered = rankings.filter(r => {
        if (filterCountry !== "ALL" && r.country !== filterCountry) return false;
        if (filterVolume !== "ALL" && r.volume_estimation !== filterVolume) return false;
        if (search && !r.keyword.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
      filtered.forEach(r => {
        countries.add(r.country);
        all.push({ ...r, playlistId: pid });
      });
      const avg = filtered.length ? filtered.reduce((s, r) => s + r.position, 0) / filtered.length : 0;
      const top = [...filtered].sort((a, b) => {
        const vd = (VOL_ORDER[b.volume_estimation] || 0) - (VOL_ORDER[a.volume_estimation] || 0);
        return vd !== 0 ? vd : a.position - b.position;
      })[0] || null;
      stats[pid] = { total: filtered.length, avg, top, rankings: filtered };
    });

    // Also get all countries unfiltered
    const allCountries = new Set();
    Object.values(data.playlists).forEach(rankings => {
      if (rankings) rankings.forEach(r => allCountries.add(r.country));
    });

    const strike = all
      .filter(r => r.position >= 2 && r.position <= 5 && (VOL_ORDER[r.volume_estimation] || 0) >= 3)
      .sort((a, b) => {
        const vd = (VOL_ORDER[b.volume_estimation] || 0) - (VOL_ORDER[a.volume_estimation] || 0);
        return vd !== 0 ? vd : a.position - b.position;
      });

    const ones = all.filter(r => r.position === 1)
      .sort((a, b) => (VOL_ORDER[b.volume_estimation] || 0) - (VOL_ORDER[a.volume_estimation] || 0));

    let movers = [];
    if (prevData) {
      const pm = {};
      Object.entries(prevData.playlists).forEach(([pid, rankings]) => {
        if (rankings) rankings.forEach(r => { pm[`${pid}::${r.keyword}::${r.country}`] = r.position; });
      });
      all.forEach(r => {
        const k = `${r.playlistId}::${r.keyword}::${r.country}`;
        if (pm[k] !== undefined) {
          const ch = pm[k] - r.position;
          if (ch !== 0) movers.push({ ...r, prev: pm[k], change: ch });
        }
      });
      movers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
    }

    const topPlaylists = Object.entries(stats)
      .filter(([, s]) => s.total > 0)
      .sort((a, b) => b[1].total - a[1].total);

    return { all, stats, countries: allCountries, strike, ones, movers, topPlaylists };
  }, [data, prevData, filterCountry, filterVolume, search]);

  useEffect(() => { setPage(0); }, [tab, filterCountry, filterVolume, search]);

  if (!data || !analytics) {
    const nothingArchived = archives.length === 0 && !loadingWeek;
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 24 }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#1DB954", marginBottom: 8, fontWeight: 600 }}>PLAYLIST RANKINGS</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px" }}>
            {nothingArchived ? "No snapshots yet" : "Loading\u2026"}
          </h1>
          {nothingArchived ? (
            <>
              <p style={{ fontSize: 14, color: "#888", lineHeight: 1.6, marginBottom: 28 }}>
                Nothing has been archived to shared storage yet. Pull the first snapshot and
                everyone on the team will see it here.
              </p>
              <button onClick={refreshData} disabled={refreshing} style={{
                padding: "12px 24px", background: refreshing ? "rgba(255,255,255,0.06)" : "#1DB954",
                color: refreshing ? "#888" : "#000", border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: refreshing ? "default" : "pointer",
                fontFamily: "'DM Sans', sans-serif"
              }}>
                {refreshing
                  ? `Pulling\u2026 ${refreshProgress?.done || 0}/${refreshProgress?.total || 125}`
                  : "Pull first snapshot"}
              </button>
            </>
          ) : (
            <p style={{ fontSize: 13, color: "#555" }}>Fetching shared data\u2026</p>
          )}
        </div>
      </div>
    );
  }

  const totalP1 = analytics.ones.length;
  const totalStrike = analytics.strike.length;
  const activeCount = analytics.topPlaylists.length;
  const totalRankings = analytics.all.length;
  const emptyCount = ALL_IDS.length - Object.keys(data.playlists).length;

  const tabBtn = (key, label) => (
    <button key={key} onClick={() => setTab(key)} style={{
      padding: "10px 20px", background: tab === key ? "#1DB954" : "transparent",
      color: tab === key ? "#000" : "#b3b3b3", border: "none", borderRadius: 8,
      cursor: "pointer", fontSize: 13, fontWeight: tab === key ? 700 : 500,
      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", whiteSpace: "nowrap"
    }}>{label}</button>
  );

  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20 };
  const statCard = { ...card, textAlign: "center", flex: 1, minWidth: 130 };

  const Paginator = ({ total }) => {
    const pages = Math.ceil(total / PAGE_SIZE);
    if (pages <= 1) return null;
    return (
      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "16px 0", alignItems: "center" }}>
        <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
          style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: page === 0 ? "#444" : "#ccc", cursor: page === 0 ? "default" : "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Prev</button>
        <span style={{ fontSize: 12, color: "#666" }}>{page + 1} / {pages}</span>
        <button onClick={() => setPage(Math.min(pages - 1, page + 1))} disabled={page >= pages - 1}
          style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: page >= pages - 1 ? "#444" : "#ccc", cursor: page >= pages - 1 ? "default" : "pointer", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>Next</button>
      </div>
    );
  };

  const VolBadge = ({ vol }) => (
    <span style={{ color: VOL_CLR[vol] || "#888", fontSize: 11, fontWeight: 500 }}>{VOL_LABEL[vol] || vol || "—"}</span>
  );

  const PosBadge = ({ pos }) => (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 4, fontWeight: 600, fontSize: 12,
      background: pos === 1 ? "rgba(250,204,21,0.15)" : pos <= 3 ? "rgba(29,185,84,0.12)" : pos <= 5 ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.05)",
      color: pos === 1 ? "#facc15" : pos <= 3 ? "#1DB954" : pos <= 5 ? "#f97316" : "#aaa"
    }}>#{pos}</span>
  );

  const SpotifyLink = ({ pid }) => (
    <a href={`https://open.spotify.com/playlist/${pid}`} target="_blank" rel="noopener noreferrer"
      title={pid}
      style={{ fontSize: 12, color: "#ccc", textDecoration: "none", fontWeight: 500 }}
      onMouseEnter={e => e.target.style.color = "#1DB954"} onMouseLeave={e => e.target.style.color = "#ccc"}>
      {NAMES[pid] ? (NAMES[pid].length > 45 ? NAMES[pid].slice(0, 45) + "…" : NAMES[pid]) : pid.slice(0, 8) + "..."}
    </a>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", fontFamily: "'DM Sans', sans-serif", padding: 24, boxSizing: "border-box" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "#1DB954", marginBottom: 4, fontWeight: 600 }}>PLAYLIST RANKINGS</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>SEO Command Center</h1>
          <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>
            {new Date(data.fetchedAt).toLocaleDateString()} · {activeCount} active / {ALL_IDS.length} total
            {archives.length > 0 && <span> · {archives.length} week{archives.length !== 1 ? "s" : ""} archived</span>}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <button onClick={refreshData} disabled={refreshing} style={{
            padding: "10px 20px", background: refreshing ? "rgba(255,255,255,0.06)" : "#1DB954",
            color: refreshing ? "#888" : "#000", border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 700, cursor: refreshing ? "default" : "pointer",
            fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s"
          }}>
            {refreshing ? `Refreshing… ${refreshProgress?.done || 0}/${refreshProgress?.total || 125}` : "↻ Refresh Data"}
          </button>
          {refreshing && (
            <div style={{ width: 160, background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "#1DB954", borderRadius: 4, width: `${((refreshProgress?.done || 0) / (refreshProgress?.total || 125)) * 100}%`, transition: "width 0.3s" }} />
            </div>
          )}
        </div>
      </div>

      {/* Week picker — choose which snapshot to view and which to compare against */}
      <div style={{
        ...card, padding: "14px 18px", marginBottom: 20, display: "flex",
        alignItems: "center", gap: 18, flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: "#888", letterSpacing: "0.05em", fontWeight: 600 }}>VIEWING</label>
          <select
            value={viewWeek || ""}
            onChange={e => setViewWeek(e.target.value)}
            disabled={archives.length === 0 || refreshing}
            style={{
              padding: "7px 12px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(29,185,84,0.35)", borderRadius: 8, color: "#fff",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", fontWeight: 600
            }}>
            {archives.length === 0 && <option value="">Seed data</option>}
            {archives.map(a => (
              <option key={a.weekKey} value={a.weekKey}>
                {a.weekKey} — {new Date(a.uploadedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: "#888", letterSpacing: "0.05em", fontWeight: 600 }}>COMPARE TO</label>
          <select
            value={compareWeek || "NONE"}
            onChange={e => setCompareWeek(e.target.value)}
            disabled={archives.length === 0 || refreshing}
            style={{
              padding: "7px 12px", background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff",
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none"
            }}>
            <option value="NONE">Nothing</option>
            {archives.filter(a => a.weekKey !== viewWeek).map(a => (
              <option key={a.weekKey} value={a.weekKey}>
                {a.weekKey} — {new Date(a.uploadedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {loadingWeek && <span style={{ fontSize: 12, color: "#1DB954" }}>Loading week…</span>}
        {archives.length === 0 && (
          <span style={{ fontSize: 12, color: "#666" }}>
            No archived weeks yet — hit Refresh to save your first.
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={statCard}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1DB954" }}>{activeCount}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, letterSpacing: "0.05em" }}>ACTIVE PLAYLISTS</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalRankings.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, letterSpacing: "0.05em" }}>TOTAL RANKINGS</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#facc15" }}>{totalP1}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, letterSpacing: "0.05em" }}>#1 POSITIONS</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#f97316" }}>{totalStrike}</div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 2, letterSpacing: "0.05em" }}>STRIKE DISTANCE</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by keyword…"
          style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", minWidth: 180 }} />
        <select value={filterCountry} onChange={e => setFilterCountry(e.target.value)}
          style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
          <option value="ALL">All Countries</option>
          {[...analytics.countries].sort().map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterVolume} onChange={e => setFilterVolume(e.target.value)}
          style={{ padding: "8px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}>
          <option value="ALL">All Volumes</option>
          {Object.entries(VOL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {tabBtn("overview", "Portfolio Overview")}
        {tabBtn("strike", `Strike Distance (${analytics.strike.length})`)}
        {tabBtn("movers", "Biggest Movers")}
        {tabBtn("number1", `#1 Rankings (${analytics.ones.length})`)}
      </div>

      {tab === "overview" && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>
            {activeCount} playlists with rankings, sorted by keyword count. Tap to expand.
            {emptyCount > 0 && ` ${emptyCount} playlists have no keywords tracked yet.`}
          </p>
          {analytics.topPlaylists.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(([pid, s]) => (
            <div key={pid} style={{ marginBottom: 4 }}>
              <div onClick={() => setExpanded(expanded === pid ? null : pid)} style={{
                ...card, padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                background: expanded === pid ? "rgba(29,185,84,0.08)" : "rgba(255,255,255,0.04)",
                borderColor: expanded === pid ? "rgba(29,185,84,0.3)" : "rgba(255,255,255,0.08)", transition: "all 0.15s"
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={`https://open.spotify.com/playlist/${pid}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 13, color: "#e8e8e8", textDecoration: "none", fontWeight: 600, lineHeight: 1.3, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    onMouseEnter={e => e.target.style.color = "#1DB954"} onMouseLeave={e => e.target.style.color = "#e8e8e8"}>
                    {NAMES[pid] || pid}
                  </a>
                  {s.top && <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>
                    Best: "<span style={{ color: "#1DB954" }}>{s.top.keyword}</span>" #{s.top.position} in {s.top.country}
                  </div>}
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{s.total}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>keywords</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#facc15" }}>{s.avg.toFixed(1)}</div>
                    <div style={{ fontSize: 10, color: "#666" }}>avg pos</div>
                  </div>
                  <div style={{ fontSize: 14, color: "#555", transform: expanded === pid ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
                </div>
              </div>
              {expanded === pid && (
                <div style={{ padding: "8px 0 0 16px", maxHeight: 400, overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead><tr style={{ color: "#666", textAlign: "left" }}>
                      <th style={{ padding: "6px 10px", fontWeight: 500 }}>Keyword</th>
                      <th style={{ padding: "6px 10px", fontWeight: 500 }}>Country</th>
                      <th style={{ padding: "6px 10px", fontWeight: 500 }}>Pos</th>
                      <th style={{ padding: "6px 10px", fontWeight: 500 }}>Volume</th>
                    </tr></thead>
                    <tbody>
                      {[...s.rankings].sort((a, b) => {
                        const vd = (VOL_ORDER[b.volume_estimation] || 0) - (VOL_ORDER[a.volume_estimation] || 0);
                        return vd !== 0 ? vd : a.position - b.position;
                      }).map((r, i) => (
                        <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "8px 10px", color: "#ddd" }}>{r.keyword}</td>
                          <td style={{ padding: "8px 10px", color: "#888" }}>{r.country}</td>
                          <td style={{ padding: "8px 10px" }}><PosBadge pos={r.position} /></td>
                          <td style={{ padding: "8px 10px" }}><VolBadge vol={r.volume_estimation} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          <Paginator total={analytics.topPlaylists.length} />
        </div>
      )}

      {tab === "strike" && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>
            Positions #2–5 with Medium+ volume — tweak the title or description to push for #1.
          </p>
          {analytics.strike.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 40, color: "#555" }}>No strike-distance opportunities with current filters.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ color: "#666", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Keyword</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Playlist</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Country</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Pos</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Volume</th>
              </tr></thead>
              <tbody>
                {analytics.strike.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 12px", color: "#f97316", fontWeight: 600 }}>{r.keyword}</td>
                    <td style={{ padding: "10px 12px" }}><SpotifyLink pid={r.playlistId} /></td>
                    <td style={{ padding: "10px 12px", color: "#888" }}>{r.country}</td>
                    <td style={{ padding: "10px 12px" }}><PosBadge pos={r.position} /></td>
                    <td style={{ padding: "10px 12px" }}><VolBadge vol={r.volume_estimation} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Paginator total={analytics.strike.length} />
        </div>
      )}

      {tab === "movers" && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>
            {prevData
              ? `${data.weekKey} vs ${prevData.weekKey}, sorted by biggest position change. Green means the playlist climbed.`
              : archives.length > 1
                ? "Pick a week under \u201cCompare to\u201d above to see movement between any two snapshots."
                : "Only one week archived so far. Refresh again next week and this tab will fill in."}
          </p>
          {analytics.movers.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 40, color: "#555" }}>
              {prevData ? "No position changes detected." : "Your snapshot is saved. Come back next week to see movers."}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ color: "#666", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Keyword</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Playlist</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Country</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Change</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Now</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Was</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Volume</th>
              </tr></thead>
              <tbody>
                {analytics.movers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 12px", color: "#ddd", fontWeight: 500 }}>{r.keyword}</td>
                    <td style={{ padding: "10px 12px" }}><SpotifyLink pid={r.playlistId} /></td>
                    <td style={{ padding: "10px 12px", color: "#888" }}>{r.country}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{
                        padding: "2px 10px", borderRadius: 4, fontWeight: 700, fontSize: 13,
                        background: r.change > 0 ? "rgba(29,185,84,0.15)" : "rgba(239,68,68,0.15)",
                        color: r.change > 0 ? "#1DB954" : "#ef4444"
                      }}>{r.change > 0 ? "▲" : "▼"} {Math.abs(r.change)}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>#{r.position}</td>
                    <td style={{ padding: "10px 12px", color: "#666" }}>#{r.prev}</td>
                    <td style={{ padding: "10px 12px" }}><VolBadge vol={r.volume_estimation} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Paginator total={analytics.movers.length} />
        </div>
      )}

      {tab === "number1" && (
        <div>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.5 }}>
            All keywords where your playlists hold #1. Protect these.
          </p>
          {analytics.ones.length === 0 ? (
            <div style={{ ...card, textAlign: "center", padding: 40, color: "#555" }}>No #1 positions with current filters.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ color: "#666", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Keyword</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Playlist</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Country</th>
                <th style={{ padding: "10px 12px", fontWeight: 500 }}>Volume</th>
              </tr></thead>
              <tbody>
                {analytics.ones.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "10px 12px", color: "#facc15", fontWeight: 600 }}>{r.keyword}</td>
                    <td style={{ padding: "10px 12px" }}><SpotifyLink pid={r.playlistId} /></td>
                    <td style={{ padding: "10px 12px", color: "#888" }}>{r.country}</td>
                    <td style={{ padding: "10px 12px" }}><VolBadge vol={r.volume_estimation} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Paginator total={analytics.ones.length} />
        </div>
      )}
    </div>
  );
}
