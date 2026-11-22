"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import type { RajaAgentMessage, ResolvedInfographic, SubagentProgress } from "@/lib/ai/agents";
import type { Song } from "@/lib/catalog";
import Infographic from "./Infographic";

const STORE = "rajas-groq-byok";
const PREFERRED = ["openai/gpt-oss-120b", "moonshotai/kimi-k2-instruct-0905", "moonshotai/kimi-k2-instruct", "llama-3.3-70b-versatile", "qwen/qwen3-32b"];

const SUGGESTIONS = [
  "📊 Make an infographic of S. P. Balasubrahmanyam's songs with Raja across the decades",
  "🌧️ Curate a rainy-evening melancholy playlist",
  "📈 Infographic: how prolific was Raja in the 1980s, year by year?",
  "🎤 Who sang the most romantic songs in this collection?",
  "🎬 Which Bharathiraja films did Raja score?",
  "🌙 Build a lullaby & thaalaattu playlist for bedtime",
];

const TOOL_LABEL: Record<string, string> = {
  catalogOverview: "📚 Reading catalog overview",
  searchSongs: "🔎 Searching songs",
  searchFilms: "🎬 Searching films",
  aggregate: "📊 Crunching numbers",
  renderInfographic: "🎨 Rendering infographic",
  submitPlaylist: "🎶 Finalising playlist",
};

type Settings = { apiKey: string; model: string; remember: boolean };

export default function Assistant({ onAddSongs }: { onAddSongs: (ids: string[]) => void }) {
  const [settings, setSettings] = useState<Settings>({ apiKey: "", model: "", remember: true });
  const [models, setModels] = useState<{ id: string }[]>([]);
  const [showSettings, setShowSettings] = useState(true);
  const [keyDraft, setKeyDraft] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [input, setInput] = useState("");
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, stop, setMessages } = useChat<RajaAgentMessage>({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: () => ({ "x-groq-api-key": settingsRef.current.apiKey, "x-groq-model": settingsRef.current.model }),
    }),
  });
  const busy = status === "submitted" || status === "streaming";

  // restore saved key
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || "null") as Settings | null;
      if (saved?.apiKey) {
        setSettings(saved);
        setShowSettings(false);
        loadModels(saved.apiKey, saved.model);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, status]);

  async function loadModels(apiKey: string, current?: string) {
    setVerifying(true);
    setKeyError("");
    try {
      const r = await fetch("/api/models", { headers: { "x-groq-api-key": apiKey } });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Could not verify key");
      setModels(j.models);
      const ids: string[] = j.models.map((m: { id: string }) => m.id);
      const pick = current && ids.includes(current) ? current : PREFERRED.find((p) => ids.includes(p)) ?? ids[0] ?? "";
      return pick;
    } catch (e) {
      setKeyError((e as Error).message);
      return null;
    } finally {
      setVerifying(false);
    }
  }

  function persist(s: Settings) {
    setSettings(s);
    try {
      if (s.remember) localStorage.setItem(STORE, JSON.stringify(s));
      else localStorage.removeItem(STORE);
    } catch {}
  }

  async function saveKey() {
    const k = keyDraft.trim();
    if (!k) return;
    const model = await loadModels(k, settings.model);
    if (model === null) return;
    persist({ ...settings, apiKey: k, model });
    setKeyDraft("");
    setShowSettings(false);
  }

  function forgetKey() {
    try { localStorage.removeItem(STORE); } catch {}
    setSettings({ apiKey: "", model: "", remember: true });
    setModels([]);
    setShowSettings(true);
  }

  function send(text: string) {
    if (!text.trim() || busy || !settings.apiKey) return;
    sendMessage({ text });
    setInput("");
  }

  const errorText = (() => {
    if (!error) return "";
    try { return JSON.parse(error.message).error ?? error.message; } catch { return error.message; }
  })();

  return (
    <div className="ai">
      {/* ───── BYOK settings ───── */}
      <div className="ai-settings">
        {settings.apiKey && !showSettings ? (
          <div className="ai-keybar">
            <span>🔑 Groq key <code>••••{settings.apiKey.slice(-4)}</code></span>
            <label>
              Model
              <select value={settings.model} onChange={(e) => persist({ ...settings, model: e.target.value })}>
                {(models.length ? models : [{ id: settings.model }]).map((m) => <option key={m.id}>{m.id}</option>)}
              </select>
            </label>
            <button className="link" onClick={() => setShowSettings(true)}>Change key</button>
            <button className="link danger" onClick={forgetKey}>Forget key</button>
          </div>
        ) : (
          <div className="ai-keyform">
            <h3>🔑 Bring your own Groq API key</h3>
            <p className="muted">
              The AI assistant runs on <b>your</b> Groq account. Get a free key at{" "}
              <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">console.groq.com/keys</a>. Your key is sent only with
              your own requests to this app&apos;s server, which forwards it to Groq. It is never stored on the server.
            </p>
            <div className="ai-keyrow">
              <input type="password" className="search" placeholder="gsk_…" value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveKey()} autoComplete="off" />
              <button className="btn" onClick={saveKey} disabled={verifying || !keyDraft.trim()}>{verifying ? "Verifying…" : "Verify & save"}</button>
              {settings.apiKey && <button className="link" onClick={() => setShowSettings(false)}>Cancel</button>}
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.remember} onChange={(e) => setSettings({ ...settings, remember: e.target.checked })} />
              Remember key in this browser
            </label>
            {keyError && <p className="err">⚠️ {keyError}</p>}
          </div>
        )}
      </div>

      {/* ───── agent team ───── */}
      <div className="ai-team">
        <div className="agent-chip lead">🎼 Raja Guide <small>orchestrator</small></div>
        <span className="arrow">→</span>
        <div className="agent-chip">🎨 Infographic Designer</div>
        <div className="agent-chip">🎶 Playlist Curator</div>
        <div className="agent-chip">🔎 Catalog tools</div>
      </div>

      {/* ───── conversation ───── */}
      <div className="ai-chat">
        {messages.length === 0 && (
          <div className="ai-empty">
            <p>வணக்கம்! Ask anything about Raja&apos;s music, or try one of these:</p>
            <div className="ai-suggest">
              {SUGGESTIONS.map((s) => (
                <button key={s} className="chip" disabled={!settings.apiKey} onClick={() => send(s.replace(/^\S+\s/, ""))}>{s}</button>
              ))}
            </div>
            {!settings.apiKey && <p className="muted small">Add your Groq key above to start.</p>}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            {m.parts.map((part, i) => {
              if (part.type === "text") {
                return m.role === "user" ? <p key={i}>{part.text}</p> : <div key={i} className="md"><ReactMarkdown>{part.text}</ReactMarkdown></div>;
              }
              if (part.type === "tool-createInfographic") {
                const out = part.state === "output-available" ? (part.output as SubagentProgress<ResolvedInfographic>) : undefined;
                return (
                  <div key={i}>
                    <SubagentTrace name="Infographic Designer" icon="🎨" brief={part.input?.brief} progress={out} state={part.state} errorText={part.state === "output-error" ? part.errorText : undefined} />
                    {out?.status === "done" && out.result && <Infographic data={out.result} onAddSongs={onAddSongs} />}
                  </div>
                );
              }
              if (part.type === "tool-curatePlaylist") {
                const out = part.state === "output-available" ? (part.output as SubagentProgress<{ title: string; description: string; songs: Song[] }>) : undefined;
                const p = out?.status === "done" ? out.result : null;
                return (
                  <div key={i}>
                    <SubagentTrace name="Playlist Curator" icon="🎶" brief={part.input?.brief} progress={out} state={part.state} errorText={part.state === "output-error" ? part.errorText : undefined} />
                    {p && (
                      <div className="ai-playlist">
                        <div className="ai-playlist-head">
                          <div><h4>🎶 {p.title}</h4><p className="muted small">{p.description}</p></div>
                          <button className="btn" onClick={() => onAddSongs(p.songs.map((s) => s.id))}>+ Add {p.songs.length} to My Playlist</button>
                        </div>
                        <ol>
                          {p.songs.map((s) => (
                            <li key={s.id}>
                              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${s.title} ${s.film} Ilaiyaraaja`)}`} target="_blank" rel="noreferrer">
                                <b>{s.title}</b> <span className="muted">— {s.film} ({s.year}) · {s.singers.join(", ")}</span>
                              </a>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              }
              if (part.type.startsWith("tool-")) {
                const name = part.type.slice(5);
                const st = "state" in part ? part.state : "";
                return (
                  <span key={i} className={`trace ${st === "output-available" ? "ok" : st === "output-error" ? "bad" : ""}`}>
                    {TOOL_LABEL[name] ?? `🛠 ${name}`} {st === "output-available" ? "✓" : st === "output-error" ? "✕" : "…"}
                  </span>
                );
              }
              return null;
            })}
          </div>
        ))}

        {status === "submitted" && <div className="msg assistant"><span className="typing"><i /><i /><i /></span></div>}
        {errorText && (
          <div className="err-box">
            ⚠️ {errorText}
            <button className="link" onClick={() => setMessages(messages.slice(0, -1))}>Dismiss</button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form className="ai-input" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        <input
          className="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={settings.apiKey ? "Ask Raja Guide… (English or தமிழ்)" : "Add your Groq key to chat"}
          disabled={!settings.apiKey}
        />
        {busy ? <button type="button" className="btn" onClick={() => stop()}>■ Stop</button> : <button className="btn" disabled={!input.trim() || !settings.apiKey}>Send ➤</button>}
        {messages.length > 0 && !busy && <button type="button" className="link" onClick={() => setMessages([])}>New chat</button>}
      </form>
    </div>
  );
}

function SubagentTrace({ name, icon, brief, progress, state, errorText }: {
  name: string; icon: string; brief?: string; progress?: SubagentProgress<unknown>; state: string; errorText?: string;
}) {
  const done = progress?.status === "done";
  return (
    <details className={`subagent ${done ? "done" : ""}`} open={!done}>
      <summary>
        {icon} <b>{name}</b> {state === "output-error" ? "failed" : done ? `finished · ${progress?.steps.length ?? 0} steps` : "is working…"}
        {!done && state !== "output-error" && <span className="spinner" />}
      </summary>
      {brief && <p className="muted small">Brief from Raja Guide: “{brief}”</p>}
      <ul>
        {progress?.steps.map((s, i) => (
          <li key={i}>{TOOL_LABEL[s.tool] ?? s.tool} <code>{compact(s.input)}</code></li>
        ))}
      </ul>
      {errorText && <p className="err">⚠️ {errorText}</p>}
    </details>
  );
}

function compact(v: unknown) {
  const s = JSON.stringify(v ?? {});
  return s.length > 90 ? s.slice(0, 90) + "…" : s;
}
