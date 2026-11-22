"use client";

import { useEffect, useMemo, useState } from "react";
import type { Catalog, Song } from "@/lib/catalog";
import Assistant from "./Assistant";

type Tab = "ai" | "songs" | "films" | "years" | "singers" | "moods" | "bgm" | "playlist";

const TABS: { id: Tab; label: string; ta: string }[] = [
  { id: "ai", label: "✨ AI Assistant", ta: "AI உதவியாளர்" },
  { id: "songs", label: "Songs", ta: "பாடல்கள்" },
  { id: "films", label: "Films", ta: "திரைப்படங்கள்" },
  { id: "years", label: "Year-wise", ta: "ஆண்டுகள்" },
  { id: "singers", label: "Singers", ta: "பாடகர்கள்" },
  { id: "moods", label: "Moods", ta: "உணர்வுகள்" },
  { id: "bgm", label: "BGM & Albums", ta: "பின்னணி இசை" },
  { id: "playlist", label: "My Playlist", ta: "என் பட்டியல்" },
];

const q = (s: string) => encodeURIComponent(s);
export const links = {
  youtube: (s: string) => `https://www.youtube.com/results?search_query=${q(s)}`,
  ytmusic: (s: string) => `https://music.youtube.com/search?q=${q(s)}`,
  spotify: (s: string) => `https://open.spotify.com/search/${q(s)}`,
  saavn: (s: string) => `https://www.jiosaavn.com/search/song/${q(s)}`,
};
const songQuery = (s: Song) => `${s.title} ${s.film} Ilaiyaraaja`;
const decadeOf = (y: number) => `${Math.floor(y / 10) * 10}s`;
const PLAYLIST_KEY = "rajas-collections-playlist";

export default function Explorer({ catalog }: { catalog: Catalog }) {
  const { songs, films, moods, bgm } = catalog;
  const songById = useMemo(() => Object.fromEntries(songs.map((s) => [s.id, s])), [songs]);

  const [tab, setTab] = useState<Tab>("songs");
  const [search, setSearch] = useState("");
  const [mood, setMood] = useState("");
  const [singer, setSinger] = useState("");
  const [decade, setDecade] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [filmSearch, setFilmSearch] = useState("");
  const [onlyWithSongs, setOnlyWithSongs] = useState(false);
  const [openFilm, setOpenFilm] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [nowIdx, setNowIdx] = useState(0);

  useEffect(() => {
    const h = window.location.hash.slice(1) as Tab;
    if (TABS.some((t) => t.id === h)) setTab(h);
    try {
      const saved = JSON.parse(localStorage.getItem(PLAYLIST_KEY) || "[]");
      if (Array.isArray(saved)) setPlaylist(saved.filter((id) => typeof id === "string"));
    } catch {}
  }, []);
  const savePlaylist = (p: string[]) => {
    setPlaylist(p);
    try { localStorage.setItem(PLAYLIST_KEY, JSON.stringify(p)); } catch {}
  };
  const togglePlaylist = (id: string) =>
    savePlaylist(playlist.includes(id) ? playlist.filter((x) => x !== id) : [...playlist, id]);

  const singerStats = useMemo(() => {
    const m = new Map<string, Song[]>();
    songs.forEach((s) => s.singers.forEach((n) => m.set(n, [...(m.get(n) || []), s])));
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [songs]);

  const decades = useMemo(() => [...new Set(films.map((f) => decadeOf(f.year)))], [films]);
  const allYears = useMemo(() => [...new Set(films.map((f) => f.year))].sort(), [films]);

  const filteredSongs = useMemo(() => {
    const t = search.toLowerCase();
    return songs.filter(
      (s) =>
        (!t || `${s.title} ${s.film} ${s.singers.join(" ")}`.toLowerCase().includes(t)) &&
        (!mood || s.moods.includes(mood)) &&
        (!singer || s.singers.includes(singer)) &&
        (!decade || decadeOf(s.year) === decade) &&
        (!year || s.year === year)
    );
  }, [songs, search, mood, singer, decade, year]);

  const filteredFilms = useMemo(() => {
    const t = filmSearch.toLowerCase();
    return films.filter(
      (f) =>
        (!t || `${f.title} ${f.director}`.toLowerCase().includes(t)) &&
        (!year || f.year === year) &&
        (!decade || decadeOf(f.year) === decade) &&
        (!onlyWithSongs || f.songIds.length > 0)
    );
  }, [films, filmSearch, year, decade, onlyWithSongs]);

  const filmsByYear = useMemo(() => {
    const m = new Map<number, typeof films>();
    filteredFilms.forEach((f) => m.set(f.year, [...(m.get(f.year) || []), f]));
    return [...m.entries()];
  }, [filteredFilms]);

  const clearFilters = () => { setSearch(""); setMood(""); setSinger(""); setDecade(""); setYear(""); };
  const go = (t: Tab, f: Partial<{ mood: string; singer: string; year: number }>) => {
    clearFilters();
    if (f.mood) setMood(f.mood);
    if (f.singer) setSinger(f.singer);
    if (f.year) setYear(f.year);
    setTab(t);
    document.getElementById("explorer")?.scrollIntoView({ behavior: "smooth" });
  };

  const playlistSongs = playlist.map((id) => songById[id]).filter(Boolean) as Song[];
  const maxFilms = Math.max(...allYears.map((y) => films.filter((f) => f.year === y).length));

  return (
    <section id="explorer" className="explorer">
      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? "tab active" : "tab"} onClick={() => setTab(t.id)}>
            <span>{t.label}</span>
            <small>{t.ta}</small>
            {t.id === "playlist" && playlist.length > 0 && <em className="badge">{playlist.length}</em>}
          </button>
        ))}
      </nav>

      {/* ───────────── AI (kept mounted so the chat survives tab switches) ───────────── */}
      <div hidden={tab !== "ai"}>
        <Assistant onAddSongs={(ids) => savePlaylist([...new Set([...playlist, ...ids])])} />
      </div>

      {/* ───────────── SONGS ───────────── */}
      {tab === "songs" && (
        <>
          <div className="filters">
            <input className="search" placeholder="Search song, film or singer… (e.g. Nilaave Vaa, Janaki)" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select value={singer} onChange={(e) => setSinger(e.target.value)}>
              <option value="">All singers</option>
              {singerStats.map(([n, l]) => <option key={n} value={n}>{n} ({l.length})</option>)}
            </select>
            <select value={decade} onChange={(e) => { setDecade(e.target.value); setYear(""); }}>
              <option value="">All decades</option>
              {decades.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}>
              <option value="">All years</option>
              {allYears.filter((y) => !decade || decadeOf(y) === decade).map((y) => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="chips">
            <button className={!mood ? "chip on" : "chip"} onClick={() => setMood("")}>All moods</button>
            {Object.entries(moods).map(([k, m]) => (
              <button key={k} className={mood === k ? "chip on" : "chip"} style={{ "--c": m.color } as React.CSSProperties} onClick={() => setMood(mood === k ? "" : k)}>
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
          <div className="result-bar">
            <span>{filteredSongs.length} songs</span>
            {(search || mood || singer || decade || year) && <button className="link" onClick={clearFilters}>Clear filters ✕</button>}
            {filteredSongs.length > 0 && (
              <button className="link" onClick={() => savePlaylist([...new Set([...playlist, ...filteredSongs.map((s) => s.id)])])}>
                + Add all {filteredSongs.length} to My Playlist
              </button>
            )}
          </div>
          <div className="song-grid">
            {filteredSongs.map((s) => (
              <SongCard key={s.id} song={s} moods={moods} inPlaylist={playlist.includes(s.id)} onToggle={() => togglePlaylist(s.id)} onSinger={(n) => go("songs", { singer: n })} />
            ))}
          </div>
          {filteredSongs.length === 0 && <p className="empty">No songs match — try clearing a filter, or check the Films tab for the full filmography.</p>}
        </>
      )}

      {/* ───────────── FILMS ───────────── */}
      {tab === "films" && (
        <>
          <div className="filters">
            <input className="search" placeholder="Search any of the films or directors… (e.g. Bharathiraja)" value={filmSearch} onChange={(e) => setFilmSearch(e.target.value)} />
            <select value={decade} onChange={(e) => { setDecade(e.target.value); setYear(""); }}>
              <option value="">All decades</option>
              {decades.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : "")}>
              <option value="">All years</option>
              {allYears.filter((y) => !decade || decadeOf(y) === decade).map((y) => <option key={y}>{y}</option>)}
            </select>
            <label className="toggle">
              <input type="checkbox" checked={onlyWithSongs} onChange={(e) => setOnlyWithSongs(e.target.checked)} /> Only films with curated songs
            </label>
          </div>
          <div className="result-bar"><span>{filteredFilms.length} films</span></div>
          {filmsByYear.map(([y, fs]) => (
            <div key={y} className="year-block">
              <h3 className="year-head"><span>{y}</span><small>{fs.length} film{fs.length > 1 ? "s" : ""}</small></h3>
              <div className="film-grid">
                {fs.map((f) => (
                  <div key={f.id} className={`film-card ${openFilm === f.id ? "open" : ""}`}>
                    <button className="film-top" onClick={() => setOpenFilm(openFilm === f.id ? null : f.id)}>
                      <span className="film-title">{f.title}</span>
                      {f.director && <span className="film-dir">🎬 {f.director}</span>}
                      {f.songIds.length > 0 && <span className="pill">{f.songIds.length} ♪</span>}
                    </button>
                    {openFilm === f.id && (
                      <div className="film-body">
                        {f.notes && <p className="notes">{f.notes}</p>}
                        {f.songIds.map((id) => songById[id]).filter(Boolean).map((s) => (
                          <div key={s.id} className="mini-song">
                            <span>♪ {s.title} <small>— {s.singers.join(", ")}</small></span>
                            <span className="mini-actions">
                              <a href={links.youtube(songQuery(s))} target="_blank" rel="noreferrer">▶</a>
                              <button onClick={() => togglePlaylist(s.id)}>{playlist.includes(s.id) ? "✓" : "+"}</button>
                            </span>
                          </div>
                        ))}
                        <div className="link-row">
                          <a href={links.youtube(`${f.title} ${f.year} Ilaiyaraaja songs jukebox`)} target="_blank" rel="noreferrer">▶ Jukebox on YouTube</a>
                          <a href={links.saavn(`${f.title} Ilaiyaraaja`)} target="_blank" rel="noreferrer">JioSaavn</a>
                          <a href={links.spotify(`${f.title} Ilaiyaraaja`)} target="_blank" rel="noreferrer">Spotify</a>
                          <a href={links.youtube(`${f.title} BGM Ilaiyaraaja`)} target="_blank" rel="noreferrer">🎻 BGM</a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* ───────────── YEARS ───────────── */}
      {tab === "years" && (
        <>
          <p className="hint">Films scored per year. The bars show how prolific he was, peaking in the mid-80s. Tap a year to see its films and songs.</p>
          <div className="timeline">
            {allYears.map((y) => {
              const n = films.filter((f) => f.year === y).length;
              const sc = songs.filter((s) => s.year === y).length;
              return (
                <button key={y} className="tl-col" onClick={() => go("films", { year: y })} title={`${y}: ${n} films, ${sc} curated songs`}>
                  <span className="tl-n">{n}</span>
                  <span className="tl-bar" style={{ height: `${(n / maxFilms) * 180 + 6}px`, background: `hsl(${(y - 1976) * 7 + 300} 90% 60%)` }} />
                  <span className="tl-y">{String(y).slice(2)}</span>
                </button>
              );
            })}
          </div>
          <div className="decade-grid">
            {decades.map((d) => {
              const fs = films.filter((f) => decadeOf(f.year) === d);
              const ss = songs.filter((s) => decadeOf(s.year) === d);
              return (
                <div key={d} className="decade-card">
                  <h3>{d}</h3>
                  <p><b>{fs.length}</b> films · <b>{ss.length}</b> curated songs</p>
                  <p className="muted">{ss.slice(0, 4).map((s) => s.title).join(" · ") || "—"}</p>
                  <div className="link-row">
                    <button className="link" onClick={() => { go("songs", {}); setDecade(d); }}>Songs →</button>
                    <button className="link" onClick={() => { go("films", {}); setDecade(d); }}>Films →</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ───────────── SINGERS ───────────── */}
      {tab === "singers" && (
        <div className="singer-grid">
          {singerStats.map(([n, list], i) => (
            <button key={n} className="singer-card" style={{ "--c": `hsl(${(i * 47) % 360} 85% 62%)` } as React.CSSProperties} onClick={() => go("songs", { singer: n })}>
              <span className="avatar">{n.split(/[ .]+/).filter(Boolean).slice(-1)[0][0]}</span>
              <span className="singer-name">{n}</span>
              <span className="muted">{list.length} song{list.length > 1 ? "s" : ""} · {Math.min(...list.map((s) => s.year))}–{Math.max(...list.map((s) => s.year))}</span>
              <span className="muted small">{list.slice(0, 3).map((s) => s.title).join(" · ")}</span>
            </button>
          ))}
        </div>
      )}

      {/* ───────────── MOODS ───────────── */}
      {tab === "moods" && (
        <div className="mood-grid">
          {Object.entries(moods).map(([k, m]) => {
            const list = songs.filter((s) => s.moods.includes(k));
            return (
              <div key={k} className="mood-card" style={{ "--c": m.color } as React.CSSProperties}>
                <div className="mood-emoji">{m.emoji}</div>
                <h3>{m.label}</h3>
                <p className="ta-small">{m.tamil}</p>
                <p className="muted">{list.length} songs</p>
                <p className="muted small">{list.slice(0, 4).map((s) => s.title).join(" · ")}</p>
                <div className="link-row">
                  <button className="link" onClick={() => go("songs", { mood: k })}>Browse →</button>
                  <button className="link" onClick={() => savePlaylist([...new Set([...playlist, ...list.map((s) => s.id)])])}>+ Playlist</button>
                  <a href={links.youtube(`Ilaiyaraaja ${m.label} Tamil songs`)} target="_blank" rel="noreferrer">▶ YouTube mix</a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ───────────── BGM ───────────── */}
      {tab === "bgm" && (
        <>
          <p className="hint">The Maestro&apos;s background scores and non-film works. Many fans consider his BGM as great as his songs.</p>
          <div className="bgm-grid">
            {bgm.map((b) => (
              <div key={b.title} className="bgm-card">
                <span className="pill">{b.kind} · {b.year}</span>
                <h3>{b.title}</h3>
                <p className="muted">{b.note}</p>
                <div className="link-row">
                  <a href={links.youtube(`${b.title} Ilaiyaraaja`)} target="_blank" rel="noreferrer">▶ YouTube</a>
                  <a href={links.spotify(`${b.title.split(" — ")[0]} Ilaiyaraaja`)} target="_blank" rel="noreferrer">Spotify</a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ───────────── PLAYLIST ───────────── */}
      {tab === "playlist" && (
        <div className="playlist">
          {playlistSongs.length === 0 ? (
            <p className="empty">Your playlist is empty. Tap <b>+</b> on any song, or “+ Playlist” on a mood, to start building your own Raja collection.</p>
          ) : (
            <>
              <div className="now-playing">
                <div>
                  <p className="eyebrow">Up next · {Math.min(nowIdx, playlistSongs.length - 1) + 1} of {playlistSongs.length}</p>
                  <h3>{playlistSongs[Math.min(nowIdx, playlistSongs.length - 1)].title}</h3>
                  <p className="muted">{playlistSongs[Math.min(nowIdx, playlistSongs.length - 1)].film} · {playlistSongs[Math.min(nowIdx, playlistSongs.length - 1)].singers.join(", ")}</p>
                </div>
                <div className="np-controls">
                  <button onClick={() => setNowIdx(Math.max(0, nowIdx - 1))}>⏮</button>
                  <a className="play-big" href={links.ytmusic(songQuery(playlistSongs[Math.min(nowIdx, playlistSongs.length - 1)]))} target="_blank" rel="noreferrer" onClick={() => setTimeout(() => setNowIdx((i) => Math.min(i + 1, playlistSongs.length - 1)), 300)}>▶ Play</a>
                  <button onClick={() => setNowIdx(Math.min(playlistSongs.length - 1, nowIdx + 1))}>⏭</button>
                </div>
              </div>
              <div className="result-bar">
                <span>{playlistSongs.length} songs</span>
                <button className="link" onClick={() => { savePlaylist([...playlist].sort(() => Math.random() - 0.5)); setNowIdx(0); }}>🔀 Shuffle</button>
                <button className="link" onClick={() => navigator.clipboard?.writeText(playlistSongs.map((s, i) => `${i + 1}. ${s.title} — ${s.film} (${s.year}) — ${s.singers.join(", ")}`).join("\n"))}>📋 Copy list</button>
                <button className="link danger" onClick={() => { if (confirm("Clear your whole playlist?")) { savePlaylist([]); setNowIdx(0); } }}>Clear</button>
              </div>
              <ol className="pl-list">
                {playlistSongs.map((s, i) => (
                  <li key={s.id} className={i === nowIdx ? "current" : ""}>
                    <button className="pl-title" onClick={() => setNowIdx(i)}>
                      <b>{s.title}</b> <span className="muted">— {s.film} ({s.year}) · {s.singers.join(", ")}</span>
                    </button>
                    <span className="mini-actions">
                      <button disabled={i === 0} onClick={() => { const p = [...playlist]; [p[i - 1], p[i]] = [p[i], p[i - 1]]; savePlaylist(p); }}>↑</button>
                      <a href={links.youtube(songQuery(s))} target="_blank" rel="noreferrer">▶</a>
                      <button onClick={() => togglePlaylist(s.id)}>✕</button>
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function SongCard({ song: s, moods, inPlaylist, onToggle, onSinger }: {
  song: Song; moods: Catalog["moods"]; inPlaylist: boolean; onToggle: () => void; onSinger: (n: string) => void;
}) {
  const c = moods[s.moods[0]]?.color ?? "#ff3d7f";
  return (
    <article className="song-card" style={{ "--c": c } as React.CSSProperties}>
      <div className="song-head">
        <span className="year">{s.year}</span>
        <span className="moods">{s.moods.map((m) => <span key={m} title={moods[m]?.label}>{moods[m]?.emoji}</span>)}</span>
      </div>
      <h3>{s.title}</h3>
      <p className="film">🎬 {s.film}</p>
      <p className="singers">
        🎤 {s.singers.map((n, i) => (
          <span key={n}>{i > 0 && ", "}<button className="link-inline" onClick={() => onSinger(n)}>{n}</button></span>
        ))}
        {s.singers.length > 1 && <span className="tag">Duet</span>}
      </p>
      <div className="actions">
        <a className="play" href={links.youtube(songQuery(s))} target="_blank" rel="noreferrer">▶ YouTube</a>
        <a href={links.spotify(songQuery(s))} target="_blank" rel="noreferrer">Spotify</a>
        <a href={links.saavn(`${s.title} ${s.film}`)} target="_blank" rel="noreferrer">Saavn</a>
        <button className={inPlaylist ? "add on" : "add"} onClick={onToggle} title="Add to My Playlist">{inPlaylist ? "✓" : "+"}</button>
      </div>
    </article>
  );
}
