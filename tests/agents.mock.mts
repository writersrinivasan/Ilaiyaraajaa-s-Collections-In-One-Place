import { createAgentUIStream, simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { createRajaAgents } from "@/lib/ai/agents";

const usage = { inputTokens: { total: 1, noCache: 1, cacheRead: undefined, cacheWrite: undefined }, outputTokens: { total: 1, text: 1, reasoning: undefined } };
let id = 0;
const call = (toolName: string, input: unknown) => ({ type: "tool-call" as const, toolCallId: `c${++id}`, toolName, input: JSON.stringify(input) });

// Scripted "LLM": picks the next action from which agent is asking (system prompt) and how many tool results it has seen.
function decide(opts: any) {
  const sys = opts.prompt.find((m: any) => m.role === "system")?.content ?? "";
  const toolMsgs = opts.prompt.filter((m: any) => m.role === "tool").length;
  if (sys.includes("Infographic Designer")) {
    return [
      [call("aggregate", { dataset: "songs", groupBy: "decade", filter: { singer: "SPB" } })],
      [call("searchSongs", { filter: { singer: "SPB" }, limit: 5 })],
      [call("renderInfographic", {
        title: "SPB × Raja", subtitle: "Duets across decades", theme: "romantic",
        stats: [{ label: "SPB songs", dataset: "songs", filter: { singer: "SPB" } }, { label: "Films 1980s", dataset: "films", filter: { yearFrom: 1980, yearTo: 1989 } }],
        charts: [{ title: "SPB by year", chartType: "timeline", dataset: "songs", groupBy: "year", filter: { singer: "SPB" } }, { title: "Moods", chartType: "donut", dataset: "songs", groupBy: "mood", filter: { singer: "SPB" } }],
        featuredSongIds: ["nilaave-vaa-mouna-ragam", "made-up-id"], insights: ["Peak in the 80s"],
      })],
    ][toolMsgs] ?? [{ type: "text" as const, text: "done" }];
  }
  return toolMsgs === 0 ? [call("createInfographic", { brief: "SPB songs infographic" })] : [{ type: "text" as const, text: "Here is your infographic!" }];
}

const model = new MockLanguageModelV4({
  doGenerate: async (opts) => {
    const content = decide(opts) as any[];
    return { content, finishReason: { unified: content[0].type === "tool-call" ? "tool-calls" : "stop", raw: undefined }, usage, warnings: [] } as any;
  },
  doStream: async (opts) => {
    const content = decide(opts) as any[];
    const chunks: any[] = content[0].type === "tool-call" ? content : [{ type: "text-start", id: "t" }, { type: "text-delta", id: "t", delta: content[0].text }, { type: "text-end", id: "t" }];
    chunks.push({ type: "finish", finishReason: { unified: content[0].type === "tool-call" ? "tool-calls" : "stop", raw: undefined }, usage });
    return { stream: simulateReadableStream({ chunks }) } as any;
  },
});

const { orchestrator } = createRajaAgents({ apiKey: "x", modelId: "x", model });
const stream = await createAgentUIStream({
  agent: orchestrator,
  uiMessages: [{ id: "u1", role: "user", parts: [{ type: "text", text: "infographic of SPB" }] }],
});
for await (const chunk of stream as any) {
  if (chunk.type === "tool-output-available") {
    const o = chunk.output;
    console.log(`[${chunk.preliminary ? "prelim" : "FINAL"}]`, o.agent ?? "", o.status ?? "", "steps:", (o.steps ?? []).map((s: any) => s.tool).join(","));
    if (!chunk.preliminary && o.result) console.log(JSON.stringify({ stats: o.result.stats, charts: o.result.charts.map((c: any) => [c.title, c.data.slice(0, 4)]), songs: o.result.songs.map((s: any) => s.title) }, null, 1));
  } else if (chunk.type === "text-delta") console.log("TEXT:", chunk.delta);
  else if (chunk.type === "error") console.log("ERROR:", chunk.errorText);
}
