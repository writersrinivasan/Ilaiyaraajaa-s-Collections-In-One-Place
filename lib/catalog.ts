import filmsRaw from "@/data/films.json";
import { RAW_SONGS, SINGERS, MOODS, BGM_WORKS } from "@/data/songs";

export type Song = {
  id: string;
  title: string;
  film: string;
  year: number;
  singers: string[];
  moods: string[];
};

export type Film = {
  id: string;
  title: string;
  year: number;
  director: string;
  notes: string;
  songIds: string[];
};

export type Catalog = {
  songs: Song[];
  films: Film[];
  moods: typeof MOODS;
  bgm: typeof BGM_WORKS;
};

// Consonant skeleton so "Mudhal Mariyathai" == "Muthal Mariyathai", "Gunaa" == "Guna" etc.
function key(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .replace(/[aeiouyh]/g, "")
    .replace(/d/g, "t")
    .replace(/g/g, "k")
    .replace(/b/g, "p")
    .replace(/z/g, "l")
    .replace(/(.)\1+/g, "$1");
}

// Films present in data/songs.ts but missing from the Wikipedia Tamil list
const EXTRA_DIRECTORS: Record<string, string> = {
  "Salangai Oli": "K. Viswanath",
  "Viduthalai Part 2": "Vetrimaaran",
};

const slug =(s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function buildCatalog(): Catalog {
  const songs: Song[] = RAW_SONGS.trim()
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((line) => {
      const [title, film, year, singers, moods] = line.split("|").map((s) => s.trim());
      return {
        id: slug(`${title}-${film}`),
        title,
        film,
        year: Number(year),
        singers: singers.split(",").map((c) => SINGERS[c.trim()] ?? c.trim()),
        moods: moods.split(",").map((m) => m.trim()),
      };
    });

  const films: Film[] = (filmsRaw as { title: string; year: number; director: string; notes: string }[]).map((f) => ({
    ...f,
    id: slug(`${f.title}-${f.year}`),
    songIds: [],
  }));

  for (const s of songs) {
    const k = key(s.film);
    let film = films.find((f) => key(f.title) === k && Math.abs(f.year - s.year) <= 1);
    if (!film) {
      film = { id: slug(`${s.film}-${s.year}`), title: s.film, year: s.year, director: EXTRA_DIRECTORS[s.film] ?? "", notes: "", songIds: [] };
      films.push(film);
    }
    s.film = film.title; // use one canonical spelling
    film.songIds.push(s.id);
  }

  films.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
  songs.sort((a, b) => a.year - b.year || a.film.localeCompare(b.film));
  return { songs, films, moods: MOODS, bgm: BGM_WORKS };
}
