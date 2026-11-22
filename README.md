# Raja's Collections — இசைஞானி இளையராஜா

A fan web app with Ilaiyaraaja's Tamil film music.

## Run
    npm install
    npm run dev        # http://localhost:3000

## Customise
- **Add songs:** add a line to `RAW_SONGS` in `data/songs.ts`:
  `Song | Film | Year | SINGER_CODES | moods`. New singers go in `SINGERS`.
  The Years, Singers, Moods, Films and Playlist views pick up new songs automatically.
- **Use a real photo:** save it as `public/ilaiyaraaja.jpg` and it replaces the illustrated portrait.
- **Film list:** `data/films.json` (737 Tamil films, taken from Wikipedia's "List of films scored by Ilaiyaraaja", CC BY-SA).

## ✨ AI Assistant (BYOK — Groq)
Open the **AI Assistant** tab (or `/#ai`), paste your own Groq key from https://console.groq.com/keys,
and pick a model. The key stays in your browser. It is sent per request in a header and is never stored on the server.

Built on the Vercel AI SDK agent framework (`ToolLoopAgent`):

    Raja Guide (orchestrator)  ── catalog tools: catalogOverview · searchSongs · searchFilms · aggregate
       ├─ createInfographic → Infographic Designer subagent → renderInfographic
       └─ curatePlaylist    → Playlist Curator subagent     → submitPlaylist

- Subagents stream their steps live to the UI. The orchestrator model only sees a short summary of what they did.
- Infographic figures are **computed by the server** from the catalog. The model chooses what to chart, not the numbers.
- Playlist song ids are checked against the catalog, so the agents can't invent songs.

Code: `lib/ai/data.ts` (grounded queries), `lib/ai/agents.ts` (agents), `app/api/chat`, `app/api/models`,
`components/Assistant.tsx`, `components/Infographic.tsx`.
Offline test with a scripted mock model: `npm run test:agents`.
