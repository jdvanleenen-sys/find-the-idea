#!/usr/bin/env node
// Runs one full find-the-idea interview between two isolated sessions:
//   interviewer = a plain assistant given only the portable prompt (the way a member uses it)
//   owner       = a role-play of a trades owner given only a persona card
// Writes the transcript plus run facts (turns, real web searches, cost) to a markdown receipt.
//
// Usage: node verify/harness/run-interview.mjs <persona.md> <out.md> [--prompt file] [--no-web]
//        [--model sonnet] [--owner-model sonnet] [--max-turns 16]

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createSession, send, webToolCalls } from "./claude-cli.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const INTERVIEWER_SYSTEM = "You are Claude, a helpful AI assistant made by Anthropic. Today is 2026-10-01.";
const OWNER_WRAP = (aiText) =>
  `The AI tool just said this to you:\n\n<<<\n${aiText}\n>>>\n\nReply as yourself, in character. Output only your reply, nothing else.`;
// The interview is over once the prompt's fixed closing line appears.
const CLOSING_MARKERS = [/that's the next step/i, /that is the next step/i];

function parseArgs(argv) {
  const opts = { prompt: join(ROOT, "find-the-idea-prompt.md"), web: true, model: "sonnet",
    ownerModel: "sonnet", maxTurns: 16 };
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--prompt") opts.prompt = argv[++i];
    else if (a === "--no-web") opts.web = false;
    else if (a === "--model") opts.model = argv[++i];
    else if (a === "--owner-model") opts.ownerModel = argv[++i];
    else if (a === "--max-turns") opts.maxTurns = Number(argv[++i]);
    else pos.push(a);
  }
  if (pos.length !== 2) throw new Error("Usage: run-interview.mjs <persona.md> <out.md> [options]");
  return { ...opts, persona: pos[0], out: pos[1] };
}

function runConversation(opts) {
  const interviewer = createSession({ systemPrompt: INTERVIEWER_SYSTEM, model: opts.model,
    tools: opts.web ? ["WebSearch", "WebFetch"] : [] });
  const owner = createSession({ systemPrompt: readFileSync(opts.persona, "utf8"), model: opts.ownerModel });
  const turns = [];
  let toInterviewer = readFileSync(opts.prompt, "utf8");
  opts.promptSha = createHash("sha256").update(toInterviewer).digest("hex").slice(0, 12);
  for (let i = 0; i < opts.maxTurns; i++) {
    const ai = send(interviewer, toInterviewer);
    turns.push({ who: "AI", text: ai });
    process.stderr.write(`  turn ${i + 1}: AI ${ai.length} chars\n`);
    if (CLOSING_MARKERS.some((re) => re.test(ai))) return { turns, interviewer, owner, ended: true };
    const reply = send(owner, OWNER_WRAP(ai));
    turns.push({ who: "OWNER", text: reply });
    toInterviewer = reply;
  }
  return { turns, interviewer, owner, ended: false };
}

function toMarkdown(opts, run) {
  const web = webToolCalls(run.interviewer);
  const head = [
    `# Interview receipt: ${opts.persona.split(/[\\/]/).pop()}`, "",
    `- Prompt: \`${opts.prompt.split(/[\\/]/).slice(-2).join("/")}\` (sha256 ${opts.promptSha}, read at start)`,
    `- Interviewer model: ${opts.model} · web tools: ${opts.web ? "on" : "off"}`,
    `- Owner model: ${opts.ownerModel}`,
    `- Real web searches by interviewer: ${web.searches.length} · pages fetched: ${web.fetches.length}` +
      (web.logFound ? "" : " (session log not found, counts unknown)"),
    ...web.searches.map((q) => `  - search: ${q}`),
    ...web.fetches.map((u) => `  - fetch: ${u}`),
    `- AI turns: ${run.turns.filter((t) => t.who === "AI").length} · ended with closing line: ${run.ended}`,
    `- Cost (USD, both sides): ${(run.interviewer.costUsd + run.owner.costUsd).toFixed(3)}`,
    `- Run at: ${new Date().toISOString()}`, "", "---", "",
  ];
  const body = run.turns.map((t) => `### ${t.who}\n\n${t.text}\n`);
  // The CLI injects the account email into each session, and a model may repeat it. Receipts are public.
  return head.concat(body).join("\n").replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[email redacted]");
}

const opts = parseArgs(process.argv.slice(2));
const run = runConversation(opts);
mkdirSync(dirname(opts.out), { recursive: true });
writeFileSync(opts.out, toMarkdown(opts, run));
console.log(`wrote ${opts.out} (${run.turns.length} messages, ${webToolCalls(run.interviewer).searches.length} searches)`);
