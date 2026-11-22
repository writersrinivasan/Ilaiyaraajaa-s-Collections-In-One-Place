import fs from "node:fs";
import path from "node:path";
import { buildCatalog } from "@/lib/catalog";
import Portrait from "@/components/Portrait";
import Explorer from "@/components/Explorer";

export default function Home() {
  const catalog = buildCatalog();
  const hasPhoto = fs.existsSync(path.join(process.cwd(), "public", "ilaiyaraaja.jpg"));
  const singers = new Set(catalog.songs.flatMap((s) => s.singers));
  const years = catalog.films.map((f) => f.year);

  return (
    <main>
      <div className="bg-blobs" aria-hidden>
        <span /><span /><span /><span />
      </div>

      <header className="hero">
        <p className="eyebrow"><span className="ta-plain">இசைஞானி</span> · Isaignani · The Maestro</p>
        <h1 className="title">
          <span className="ta">இளையராஜா</span>
          <span className="en">Raja&apos;s Collections</span>
        </h1>
        <Portrait photo={hasPhoto} />
        <p className="tagline">
          Every Tamil film he scored, the songs we hum, the background scores that haunt us — in one place.
        </p>
        <div className="stats">
          <div><b>{catalog.films.length}</b><span>Tamil films</span></div>
          <div><b>{catalog.songs.length}</b><span>curated songs</span></div>
          <div><b>{singers.size}</b><span>singers</span></div>
          <div><b>{Math.min(...years)}–{Math.max(...years)}</b><span>years of music</span></div>
        </div>
      </header>

      <Explorer catalog={catalog} />

      <footer className="footer">
        <p>
          Made with ❤️ by a devoted fan of இசைஞானி. Film list sourced from Wikipedia&apos;s &quot;List of films scored by
          Ilaiyaraaja&quot; (CC BY-SA). Songs are hand-curated — add more in <code>data/songs.ts</code>.
        </p>
        <p>Music links open search results on YouTube, Spotify and JioSaavn. All music rights belong to their owners.</p>
      </footer>
    </main>
  );
}
