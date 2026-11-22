// Grounded query layer over the catalog. Every number an agent shows the user
// is computed here — the LLM decides WHAT to ask, never invents the answer.
import { z } from "zod";
import { buildCatalog, type Song, type Film } from "@/lib/catalog";
import { SINGERS } from "@/data/songs";

const catalog = buildCatalog();
export const { songs, films, moods } = catalog;
const songById = new Map(songs.map((s) => [s.id, s]));
export const getSong = (id: string) => songById.get(id);

export const filterSchema = z
  .object({
    query: z.string().optional().describe("Free text matched against song title, film and singers"),
    singer: z.string().optional().describe("Singer name or short code, e.g. 'S. Janaki', 'Janaki', 'SPB', 'Yesudas'"),
    mood: z.string().optional().describe(`One of: ${Object.keys(moods).join(", ")}`),
    film: z.string().optional().describe("Film title (partial match ok)"),
    director: z.string().optional().describe("Director name (partial match ok) — films dataset only"),
    yearFrom: z.number().int().optional(),
    yearTo: z.number().int().optional(),
  })
  .describe("Optional filters; omit any you don't need");
export type Filter = z.infer<typeof filterSchema>;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

function singerMatches(name: string, q: string) {
  const n = norm(q);
  if (!n) return true;
  if (SINGERS[q.toUpperCase()] === name) return true; // code, e.g. SPB
  return norm(name).includes(n) || name.toLowerCase().split(/[ .]+/).some((p) => p && norm(p) === n);
}

const inYears = (y: number, f: Filter) => (!f.yearFrom || y >= f.yearFrom) && (!f.yearTo || y <= f.yearTo);

export function filterSongs(f: Filter = {}): Song[] {
  const q = f.query?.toLowerCase();
  return songs.filter(
    (s) =>
      (!q || `${s.title} ${s.film} ${s.singers.join(" ")}`.toLowerCase().includes(q)) &&
      (!f.singer || s.singers.some((n) => singerMatches(n, f.singer!))) &&
      (!f.mood || s.moods.includes(f.mood.toLowerCase())) &&
      (!f.film || norm(s.film).includes(norm(f.film))) &&
      inYears(s.year, f)
  );
}

export function filterFilms(f: Filter = {}): Film[] {
  const q = f.query?.toLowerCase();
  const songIds = f.singer || f.mood ? new Set(filterSongs({ singer: f.singer, mood: f.mood }).map((s) => s.id)) : null;
  return films.filter(
    (x) =>
      (!q || `${x.title} ${x.director}`.toLowerCase().includes(q)) &&
      (!f.film || norm(x.title).includes(norm(f.film))) &&
      (!f.director || norm(x.director).includes(norm(f.director))) &&
      (!songIds || x.songIds.some((id) => songIds.has(id))) &&
      inYears(x.year, f)
  );
}

export const groupBySchema = z.enum(["year", "decade", "singer", "mood", "film", "director"]);
export const datasetSchema = z.enum(["songs", "films"]);

export function aggregate(dataset: "songs" | "films", groupBy: z.infer<typeof groupBySchema>, f: Filter = {}, limit = 12) {
  const counts = new Map<string, number>();
  const bump = (k: string) => k && counts.set(k, (counts.get(k) || 0) + 1);
  if (dataset === "songs") {
    for (const s of filterSongs(f)) {
      if (groupBy === "year") bump(String(s.year));
      else if (groupBy === "decade") bump(`${Math.floor(s.year / 10) * 10}s`);
      else if (groupBy === "singer") s.singers.forEach(bump);
      else if (groupBy === "mood") s.moods.forEach((m) => bump(moods[m]?.label ?? m));
      else if (groupBy === "film") bump(s.film);
      else if (groupBy === "director") bump(films.find((x) => x.title === s.film)?.director || "Unknown");
    }
  } else {
    for (const x of filterFilms(f)) {
      if (groupBy === "year") bump(String(x.year));
      else if (groupBy === "decade") bump(`${Math.floor(x.year / 10) * 10}s`);
      else if (groupBy === "director") bump(x.director || "Unknown");
      else if (groupBy === "film") bump(x.title);
      else bump("n/a");
    }
  }
  let rows = [...counts.entries()].map(([label, value]) => ({ label, value }));
  if (groupBy === "year" || groupBy === "decade") rows.sort((a, b) => a.label.localeCompare(b.label));
  else rows = rows.sort((a, b) => b.value - a.value).slice(0, limit);
  return rows;
}

export const songBrief = (s: Song) => ({ id: s.id, title: s.title, film: s.film, year: s.year, singers: s.singers, moods: s.moods });
export const filmBrief = (x: Film) => ({
  title: x.title, year: x.year, director: x.director || "—", notes: x.notes || undefined,
  curatedSongs: x.songIds.map((id) => songById.get(id)?.title).filter(Boolean),
});

export function overview() {
  const years = films.map((f) => f.year);
  return {
    totalTamilFilms: films.length,
    curatedSongs: songs.length,
    yearSpan: `${Math.min(...years)}–${Math.max(...years)}`,
    moods: Object.entries(moods).map(([k, m]) => ({ key: k, label: m.label, songs: songs.filter((s) => s.moods.includes(k)).length })),
    singers: aggregate("songs", "singer", {}, 50),
    filmsPerDecade: aggregate("films", "decade"),
    note: "Films list is complete (from Wikipedia). Songs are a hand-curated subset of his ~4,500 Tamil songs.",
  };
}
