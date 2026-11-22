// Multi-agent orchestration (Vercel AI SDK ToolLoopAgent):
//
//   Raja Guide (orchestrator) ── data tools: catalogOverview · searchSongs · searchFilms · aggregate
//        │
//        ├── createInfographic ─► Infographic Designer (subagent)
//        │                          data tools + renderInfographic (spec → server-computed figures)
//        │
//        └── curatePlaylist ─────► Playlist Curator (subagent)
//                                   searchSongs + submitPlaylist (ids validated against catalog)
//
// Subagents stream their progress to the UI as preliminary tool results; the
// orchestrator's model only sees a compact summary (toModelOutput).
import { ToolLoopAgent, tool, isStepCount, hasToolCall, type InferAgentUIMessage, type LanguageModel } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";
import {
  aggregate, datasetSchema, filmBrief, filterFilms, filterSchema, filterSongs, getSong, groupBySchema, moods, overview, songBrief,
} from "./data";
import type { Song } from "@/lib/catalog";

/* ───────────── shared data tools ───────────── */

const dataTools = {
  catalogOverview: tool({
    description: "Totals, the list of moods, every singer with song counts, and films per decade. Call first when unsure what values exist.",
    inputSchema: z.object({}),
    execute: async () => overview(),
  }),
  searchSongs: tool({
    description: "Find curated Ilaiyaraaja Tamil songs by text, singer, mood, film or year range.",
    inputSchema: z.object({ filter: filterSchema, limit: z.number().int().min(1).max(40).optional() }),
    execute: async ({ filter, limit = 20 }) => {
      const all = filterSongs(filter);
      return { total: all.length, songs: all.slice(0, limit).map(songBrief) };
    },
  }),
  searchFilms: tool({
    description: "Search all Tamil films he scored (complete filmography) by title, director or year range.",
    inputSchema: z.object({ filter: filterSchema, limit: z.number().int().min(1).max(40).optional() }),
    execute: async ({ filter, limit = 20 }) => {
      const all = filterFilms(filter);
      return { total: all.length, films: all.slice(0, limit).map(filmBrief) };
    },
  }),
  aggregate: tool({
    description: "Count songs or films grouped by year, decade, singer, mood, film or director, with optional filters.",
    inputSchema: z.object({ dataset: datasetSchema, groupBy: groupBySchema, filter: filterSchema.optional(), limit: z.number().int().optional() }),
    execute: async ({ dataset, groupBy, filter, limit }) => ({ rows: aggregate(dataset, groupBy, filter ?? {}, limit ?? 12) }),
  }),
};

/* ───────────── infographic spec (LLM) → resolved infographic (server) ───────────── */

const infographicSpecSchema = z.object({
  title: z.string().describe("Punchy title"),
  subtitle: z.string().describe("One line of context"),
  theme: z.enum(["rainbow", ...Object.keys(moods)] as [string, ...string[]]).describe("Colour theme"),
  stats: z
    .array(z.object({ label: z.string(), dataset: datasetSchema, filter: filterSchema.optional() }))
    .max(4)
    .describe("Big-number cards; each value is COUNTED by the server from dataset+filter"),
  charts: z
    .array(
      z.object({
        title: z.string(),
        chartType: z.enum(["bar", "donut", "timeline"]).describe("timeline = by year; donut = share of whole; bar = ranking"),
        dataset: datasetSchema,
        groupBy: groupBySchema,
        filter: filterSchema.optional(),
        limit: z.number().int().max(15).optional(),
      })
    )
    .max(3),
  featuredSongIds: z.array(z.string()).max(8).describe("Song ids returned by searchSongs"),
  insights: z.array(z.string()).max(5).describe("Short factual insights based ONLY on tool results"),
});
type InfographicSpec = z.infer<typeof infographicSpecSchema>;

export type ResolvedInfographic = {
  title: string;
  subtitle: string;
  theme: string;
  stats: { label: string; value: number }[];
  charts: { title: string; chartType: "bar" | "donut" | "timeline"; data: { label: string; value: number }[] }[];
  songs: Song[];
  insights: string[];
};

function resolveInfographic(spec: InfographicSpec): ResolvedInfographic {
  return {
    title: spec.title,
    subtitle: spec.subtitle,
    theme: spec.theme,
    stats: spec.stats.map((s) => ({
      label: s.label,
      value: s.dataset === "songs" ? filterSongs(s.filter).length : filterFilms(s.filter).length,
    })),
    charts: spec.charts
      .map((c) => ({ title: c.title, chartType: c.chartType, data: aggregate(c.dataset, c.groupBy, c.filter ?? {}, c.limit ?? 10) }))
      .filter((c) => c.data.length > 0),
    songs: spec.featuredSongIds.map(getSong).filter((s): s is Song => !!s),
    insights: spec.insights,
  };
}

/* ───────────── subagent runner with live progress ───────────── */

export type SubagentProgress<T> = {
  agent: string;
  status: "working" | "done";
  steps: { tool: string; input: unknown }[];
  result?: T | null;
  note?: string;
};

async function* runSubagent<T>(
  name: string,
  agent: ToolLoopAgent<never, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  prompt: string,
  abortSignal: AbortSignal | undefined,
  getResult: () => T | null
): AsyncGenerator<SubagentProgress<T>> {
  const steps: SubagentProgress<T>["steps"] = [];
  let wake: (() => void) | null = null;
  let done = false;
  let failure: unknown = null;
  let text = "";

  const run = agent
    .generate({
      prompt,
      abortSignal,
      onToolExecutionStart: ({ toolCall }) => {
        steps.push({ tool: toolCall.toolName, input: toolCall.input });
        wake?.();
      },
    })
    .then((r) => { text = r.text; }, (e) => { failure = e; })
    .finally(() => { done = true; wake?.(); });

  yield { agent: name, status: "working", steps: [] };
  let sent = 0;
  while (!done) {
    await new Promise<void>((r) => { wake = r; if (done || steps.length > sent) r(); });
    wake = null;
    if (steps.length > sent) {
      sent = steps.length;
      yield { agent: name, status: "working", steps: [...steps] };
    }
  }
  await run;
  if (failure) throw failure;
  yield { agent: name, status: "done", steps: [...steps], result: getResult(), note: text || undefined };
}

/* ───────────── agent factory (per request — BYOK) ───────────── */

export function createRajaAgents({ apiKey, modelId, model: injected }: { apiKey: string; modelId: string; model?: LanguageModel }) {
  const model: LanguageModel = injected ?? createGroq({ apiKey })(modelId); // `model` override is for tests

  const createInfographic = tool({
    description:
      "Delegate to the Infographic Designer agent to build a visual infographic (stat cards, charts, featured songs) from the catalog. Use whenever the user asks for an infographic, visual, chart, breakdown or 'show me'.",
    inputSchema: z.object({ brief: z.string().describe("What the infographic should show, including any singer/mood/era focus") }),
    execute: async function* ({ brief }, { abortSignal }) {
      let resolved: ResolvedInfographic | null = null;
      const designer = new ToolLoopAgent({
        id: "infographic-designer",
        model,
        instructions: `You are the Infographic Designer for an Ilaiyaraaja Tamil music fan app.
1. Use the data tools (catalogOverview, aggregate, searchSongs, searchFilms) to explore the data relevant to the brief.
2. Then call renderInfographic EXACTLY ONCE. Stat values and chart data are computed by the server from the dataset/groupBy/filter you specify — choose them carefully so they match the brief (e.g. filter.singer for a singer focus, yearFrom/yearTo for an era).
3. Use 2–4 stats, 1–3 charts (prefer a "timeline" chart grouped by year for anything about eras), up to 8 featuredSongIds taken from searchSongs results, and 3–5 insights that are strictly supported by the tool results.
Remember: the film list is complete; songs are a curated subset — phrase song counts as "in this collection".`,
        tools: {
          ...dataTools,
          renderInfographic: tool({
            description: "Render the final infographic. Call once, at the end.",
            inputSchema: infographicSpecSchema,
            execute: async (spec) => {
              resolved = resolveInfographic(spec);
              return { rendered: true, stats: resolved.stats, charts: resolved.charts.map((c) => ({ title: c.title, points: c.data.length })) };
            },
          }),
        },
        stopWhen: [hasToolCall("renderInfographic"), isStepCount(8)],
      });
      yield* runSubagent<ResolvedInfographic>("Infographic Designer", designer, brief, abortSignal, () => resolved);
    },
    toModelOutput: ({ output }) => {
      const r = output?.result;
      return {
        type: "text",
        value: r
          ? `Infographic "${r.title}" is now displayed to the user. Stats: ${r.stats.map((s) => `${s.label}=${s.value}`).join("; ")}. Insights: ${r.insights.join(" | ")}`
          : "The designer could not produce an infographic. Apologise briefly and offer a text answer instead.",
      };
    },
  });

  const curatePlaylist = tool({
    description: "Delegate to the Playlist Curator agent to build a themed playlist of songs from the catalog (by mood, occasion, singer, era…).",
    inputSchema: z.object({ brief: z.string().describe("The mood/occasion/theme of the playlist and desired length") }),
    execute: async function* ({ brief }, { abortSignal }) {
      let playlist: { title: string; description: string; songs: Song[] } | null = null;
      const curator = new ToolLoopAgent({
        id: "playlist-curator",
        model,
        instructions: `You are the Playlist Curator for an Ilaiyaraaja Tamil music fan app.
Search the catalog with searchSongs (try several filters: moods, singers, eras) and pick songs that fit the brief and flow well.
Then call submitPlaylist exactly once with 6–15 song ids that came from searchSongs results. Never invent ids.`,
        tools: {
          searchSongs: dataTools.searchSongs,
          catalogOverview: dataTools.catalogOverview,
          submitPlaylist: tool({
            description: "Submit the final playlist. Call once, at the end.",
            inputSchema: z.object({ title: z.string(), description: z.string(), songIds: z.array(z.string()).min(1).max(20) }),
            execute: async ({ title, description, songIds }) => {
              const picked = [...new Set(songIds)].map(getSong).filter((s): s is Song => !!s);
              playlist = { title, description, songs: picked };
              return { accepted: picked.length, rejectedIds: songIds.filter((id) => !getSong(id)) };
            },
          }),
        },
        stopWhen: [hasToolCall("submitPlaylist"), isStepCount(8)],
      });
      yield* runSubagent("Playlist Curator", curator, brief, abortSignal, () => playlist);
    },
    toModelOutput: ({ output }) => {
      const p = output?.result;
      return {
        type: "text",
        value: p
          ? `Playlist "${p.title}" (${p.songs.length} songs) is now displayed with an "Add to My Playlist" button: ${p.songs.map((s) => s.title).join(", ")}`
          : "The curator could not build a playlist.",
      };
    },
  });

  const orchestrator = new ToolLoopAgent({
    id: "raja-guide",
    model,
    instructions: `You are "Raja Guide", a warm, knowledgeable assistant inside "Raja's Collections" — a fan app devoted to Isaignani Ilaiyaraaja's Tamil film music.
You orchestrate a team:
- For facts about songs/films/singers/years in the collection, call the data tools (searchSongs, searchFilms, aggregate, catalogOverview) and answer from their results.
- For any infographic / visual / chart / breakdown request → call createInfographic with a clear brief.
- For playlist requests → call curatePlaylist with a clear brief.
Rules: ground every number in tool results; the film list is complete but songs are a curated subset, so say "in this collection" for song counts. You may add well-known general knowledge about Ilaiyaraaja (life, style, awards) but flag uncertainty. Don't repeat the full contents of an infographic or playlist the user can already see — add a short, insightful commentary instead. Keep replies concise; use markdown. Reply in Tamil if the user writes in Tamil.`,
    tools: { ...dataTools, createInfographic, curatePlaylist },
    stopWhen: isStepCount(8),
  });

  return { orchestrator };
}

export type RajaAgentMessage = InferAgentUIMessage<ReturnType<typeof createRajaAgents>["orchestrator"]>;
