// Thin wrapper around the headless Claude Code CLI, used by the interview harness.
// Each "session" is an isolated conversation: no user settings, no CLAUDE.md, no MCP servers.

import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";

const CALL_TIMEOUT_MS = 6 * 60 * 1000;
// Short working directory: Windows refuses to start the CLI from a long path, and an empty
// directory means no project CLAUDE.md leaks into the run.
const SESSION_CWD = join(tmpdir(), "fti");

export function findClaudeExe() {
  if (process.env.CLAUDE_EXE) return process.env.CLAUDE_EXE;
  const extDir = join(homedir(), ".vscode", "extensions");
  const candidates = existsSync(extDir)
    ? readdirSync(extDir).filter((d) => d.startsWith("anthropic.claude-code-")).sort().reverse()
    : [];
  for (const dir of candidates) {
    const exe = join(extDir, dir, "resources", "native-binary", "claude.exe");
    if (existsSync(exe)) return exe;
  }
  return "claude";
}

export function createSession({ systemPrompt, model, tools = [] }) {
  if (!existsSync(SESSION_CWD)) mkdirSync(SESSION_CWD, { recursive: true });
  return { id: randomUUID(), systemPrompt, model, tools, turns: 0, costUsd: 0 };
}

function buildArgs(session) {
  const args = ["-p", "--output-format", "json", "--model", session.model,
    "--setting-sources", "", "--strict-mcp-config", "--system-prompt", session.systemPrompt];
  if (session.tools.length) args.push("--tools", ...session.tools, "--allowedTools", ...session.tools);
  else args.push("--tools", "");
  args.push(session.turns === 0 ? "--session-id" : "--resume", session.id);
  return args;
}

// Sends one user message and returns the assistant's text reply.
export function send(session, message) {
  const res = spawnSync(findClaudeExe(), buildArgs(session), {
    input: message, cwd: SESSION_CWD, encoding: "utf8", timeout: CALL_TIMEOUT_MS, maxBuffer: 64 * 1024 * 1024,
  });
  if (res.error) throw new Error(`CLI failed to start: ${res.error.message}`);
  let out;
  try {
    out = JSON.parse(res.stdout);
  } catch {
    throw new Error(`CLI returned non-JSON (exit ${res.status}): ${(res.stdout || res.stderr).slice(0, 500)}`);
  }
  if (out.is_error) throw new Error(`CLI error: ${out.result}`);
  session.turns += 1;
  session.costUsd += out.total_cost_usd ?? 0;
  return String(out.result ?? "").trim();
}

// The CLI's WebSearch/WebFetch are client-side tools, so the JSON usage block does not count them.
// The session's own log on disk is the record of what was actually searched and opened.
export function webToolCalls(session) {
  const slug = SESSION_CWD.replace(/[^A-Za-z0-9]/g, "-");
  const log = join(homedir(), ".claude", "projects", slug, `${session.id}.jsonl`);
  if (!existsSync(log)) return { searches: [], fetches: [], logFound: false };
  const calls = { searches: [], fetches: [], logFound: true };
  for (const line of readFileSync(log, "utf8").split("\n")) {
    if (!line.includes('"tool_use"')) continue;
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }
    for (const part of entry.message?.content ?? []) {
      if (part.type !== "tool_use") continue;
      if (part.name === "WebSearch") calls.searches.push(part.input?.query ?? "");
      if (part.name === "WebFetch") calls.fetches.push(part.input?.url ?? "");
    }
  }
  return calls;
}
