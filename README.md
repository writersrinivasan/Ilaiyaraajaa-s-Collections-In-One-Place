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
