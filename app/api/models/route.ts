// Validates a BYOK Groq key and lists the chat models it can use.
const NON_CHAT = /whisper|tts|playai|guard|distil|orpheus|prompt-guard|safeguard|compound/i;

export async function GET(req: Request) {
  const apiKey = req.headers.get("x-groq-api-key")?.trim();
  if (!apiKey) return Response.json({ error: "Missing API key" }, { status: 400 });
  const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { Authorization: `Bearer ${apiKey}` } });
  if (!r.ok) {
    return Response.json({ error: r.status === 401 ? "Invalid Groq API key" : `Groq returned ${r.status}` }, { status: r.status === 401 ? 401 : 502 });
  }
  const { data } = (await r.json()) as { data: { id: string; active?: boolean; context_window?: number }[] };
  const models = data
    .filter((m) => m.active !== false && !NON_CHAT.test(m.id))
    .map((m) => ({ id: m.id, context: m.context_window ?? null }))
    .sort((a, b) => a.id.localeCompare(b.id));
  return Response.json({ models });
}
