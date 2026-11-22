import { createAgentUIStreamResponse } from "ai";
import { createRajaAgents } from "@/lib/ai/agents";

export const maxDuration = 60;

// BYOK: the user's Groq key arrives per request in a header. It is used for
// this request only — never stored, logged or returned.
export async function POST(req: Request) {
  const apiKey = req.headers.get("x-groq-api-key")?.trim();
  const modelId = req.headers.get("x-groq-model")?.trim() || "llama-3.3-70b-versatile";
  if (!apiKey) return Response.json({ error: "Add your Groq API key in AI settings first." }, { status: 401 });

  const { messages } = await req.json();
  const { orchestrator } = createRajaAgents({ apiKey, modelId });

  return createAgentUIStreamResponse({
    agent: orchestrator,
    uiMessages: messages,
    abortSignal: req.signal,
    onError: friendlyError,
  });
}

function friendlyError(error: unknown): string {
  const e = error as { statusCode?: number; message?: string; responseBody?: string };
  const msg = `${e?.message ?? ""} ${e?.responseBody ?? ""}`;
  if (e?.statusCode === 401 || /invalid api key|401/i.test(msg)) return "Groq rejected the API key. Check it in AI settings.";
  if (e?.statusCode === 429 || /rate limit|429/i.test(msg)) return "Groq rate limit reached for your key. Wait a minute or pick a smaller model.";
  if (/model.*(not found|decommissioned|does not exist)/i.test(msg)) return "That model isn't available on your Groq account. Pick another in AI settings.";
  if (/tool_use_failed|failed to call a function/i.test(msg)) return "The model fumbled a tool call. Try again, or switch to a stronger tool-calling model (e.g. openai/gpt-oss-120b or llama-3.3-70b-versatile).";
  return `Something went wrong: ${e?.message?.slice(0, 200) ?? "unknown error"}`;
}
