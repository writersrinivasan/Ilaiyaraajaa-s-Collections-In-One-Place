"use client";

import type { ResolvedInfographic } from "@/lib/ai/agents";
import { MOODS } from "@/data/songs";

const RAINBOW = ["#ff3d7f", "#ffd23f", "#2ec4b6", "#c77dff", "#ff7b39", "#5b7cff", "#06d6a0", "#ef476f", "#9d4edd", "#ffd166"];

export default function Infographic({ data, onAddSongs }: { data: ResolvedInfographic; onAddSongs: (ids: string[]) => void }) {
  const accent = MOODS[data.theme]?.color ?? "#ff3d7f";
  const palette = data.theme === "rainbow" ? RAINBOW : [accent, ...RAINBOW.filter((c) => c !== accent)];

  return (
    <div className="info" style={{ "--c": accent } as React.CSSProperties}>
      <div className="info-head">
        <span className="eyebrow">✨ AI Infographic · {MOODS[data.theme]?.emoji ?? "🌈"}</span>
        <h3>{data.title}</h3>
        <p>{data.subtitle}</p>
      </div>

      {data.stats.length > 0 && (
        <div className="info-stats">
          {data.stats.map((s, i) => (
            <div key={i} style={{ "--k": palette[i % palette.length] } as React.CSSProperties}>
              <b>{s.value.toLocaleString()}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {data.charts.map((c, i) => (
        <div key={i} className="info-chart">
          <h4>{c.title}</h4>
          {c.chartType === "donut" ? <Donut data={c.data} palette={palette} /> : c.chartType === "timeline" ? <Timeline data={c.data} color={palette[i % palette.length]} /> : <Bars data={c.data} palette={palette} />}
        </div>
      ))}

      {data.insights.length > 0 && (
        <ul className="info-insights">
          {data.insights.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}

      {data.songs.length > 0 && (
        <div className="info-songs">
          <div className="info-songs-head">
            <h4>Featured songs</h4>
            <button className="link" onClick={() => onAddSongs(data.songs.map((s) => s.id))}>+ Add all to My Playlist</button>
          </div>
          <div className="info-song-list">
            {data.songs.map((s) => (
              <a key={s.id} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${s.title} ${s.film} Ilaiyaraaja`)}`} target="_blank" rel="noreferrer">
                ▶ <b>{s.title}</b> <span>{s.film} · {s.year}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      <p className="info-foot">Figures computed from the Raja&apos;s Collections catalog · designed by the Infographic Designer agent</p>
    </div>
  );
}

function Bars({ data, palette }: { data: { label: string; value: number }[]; palette: string[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="ibars">
      {data.map((d, i) => (
        <div key={d.label} className="ibar">
          <span className="ibar-label" title={d.label}>{d.label}</span>
          <span className="ibar-track">
            <span className="ibar-fill" style={{ width: `${(d.value / max) * 100}%`, background: palette[i % palette.length] }} />
          </span>
          <b>{d.value}</b>
        </div>
      ))}
    </div>
  );
}

function Timeline({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="itime">
      {data.map((d) => (
        <div key={d.label} className="itime-col" title={`${d.label}: ${d.value}`}>
          <span className="itime-n">{d.value}</span>
          <span className="itime-bar" style={{ height: `${(d.value / max) * 120 + 4}px`, background: color }} />
          <span className="itime-l">{d.label.length === 4 ? `'${d.label.slice(2)}` : d.label}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({ data, palette }: { data: { label: string; value: number }[]; palette: string[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  let acc = 0;
  const stops = data.map((d, i) => {
    const from = (acc / total) * 360;
    acc += d.value;
    return `${palette[i % palette.length]} ${from}deg ${(acc / total) * 360}deg`;
  });
  return (
    <div className="idonut">
      <div className="idonut-ring" style={{ background: `conic-gradient(${stops.join(", ")})` }}>
        <span>{total}</span>
      </div>
      <ul>
        {data.map((d, i) => (
          <li key={d.label}><i style={{ background: palette[i % palette.length] }} />{d.label} <b>{d.value}</b> <small>{Math.round((d.value / total) * 100)}%</small></li>
        ))}
      </ul>
    </div>
  );
}
