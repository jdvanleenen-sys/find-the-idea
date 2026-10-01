#!/usr/bin/env node
// Turns a real owner's chat (copied out of their AI) into a receipt that verify/grade.mjs can read.
// Accepts two formats:
//   ChatGPT copy-all:  lines "You said:" and "ChatGPT said:" before each message
//   Hand-marked:       lines starting "ME:" and "AI:" (use this for Claude, Perplexity, anything else)
// The owner's first message is the pasted prompt: it is replaced by its hash and a version check.
// Emails and phone numbers are redacted. Possible names are printed for a person to check, never guessed.
//
// Usage: node verify/import-transcript.mjs <pasted.txt> <out.md> [--trade painter] [--ai chatgpt]

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROMPT_ANCHOR = "You are my venture strategist and discovery interviewer.";
const CLOSING = /that('|’)?s the next step\.?"?\s*$/i;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const PHONE = /(\+?1[ .-]?)?\(?\b\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}\b/g;
const MARKERS = [
  { re: /^\s*You said:\s*$/i, who: "OWNER" }, { re: /^\s*(ChatGPT|Claude|Perplexity|Assistant) said:\s*$/i, who: "AI" },
  { re: /^\s*ME:\s?/, who: "OWNER", inline: true }, { re: /^\s*AI:\s?/, who: "AI", inline: true },
];
const sha = (s) => createHash("sha256").update(s.replace(/\r\n/g, "\n").trim()).digest("hex").slice(0, 12);

function splitTurns(text) {
  const turns = [];
  for (const line of text.replace(/\r\n/g, "\n").split("\n")) {
    const m = MARKERS.find((k) => k.re.test(line));
    if (m) {
      turns.push({ who: m.who, lines: m.inline ? [line.replace(m.re, "")] : [] });
    } else if (turns.length) {
      turns[turns.length - 1].lines.push(line);
    }
  }
  return turns.map((t) => ({ who: t.who, text: t.lines.join("\n").trim() })).filter((t) => t.text);
}

function promptCheck(turns) {
  const first = turns.find((t) => t.who === "OWNER");
  if (!first || !first.text.includes(PROMPT_ANCHOR)) return { line: "not found in the chat (owner may have typed their own start)", turns };
  const current = readFileSync(join(ROOT, "find-the-idea-prompt.md"), "utf8");
  const pasted = first.text.slice(first.text.indexOf(PROMPT_ANCHOR));
  const same = sha(pasted) === sha(current);
  const rest = turns.filter((t) => t !== first);
  return { line: `sha256 ${sha(pasted)} (${same ? "matches the current prompt" : "DIFFERS from the current prompt"})`, turns: rest };
}

function possibleNames(text) {
  const hits = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [];
  const common = /^(See it|Do it|Own it|Library match|Evidence Note|Working Hypothesis|Red Deer|Thunder Bay|Nova Scotia|New Brunswick|British Columbia|Prince Edward|Google Maps|Home Depot)$/i;
  return [...new Set(hits.filter((h) => !common.test(h)))];
}

function parseArgs(argv) {
  const opts = { trade: "unknown", ai: "unknown", pos: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--trade") opts.trade = argv[++i];
    else if (argv[i] === "--ai") opts.ai = argv[++i];
    else opts.pos.push(argv[i]);
  }
  if (opts.pos.length !== 2) throw new Error("Usage: import-transcript.mjs <pasted.txt> <out.md> [--trade x] [--ai x]");
  return opts;
}

export function buildReceipt(pastedText, { trade, ai, source }) {
  const turns = splitTurns(pastedText);
  if (!turns.some((t) => t.who === "AI")) {
    throw new Error('No AI turns found. Mark each message with "ME:" or "AI:" at the start of its first line.');
  }
  const { line: promptLine, turns: chat } = promptCheck(turns);
  const aiTurns = chat.filter((t) => t.who === "AI");
  const ended = CLOSING.test(aiTurns[aiTurns.length - 1].text);
  const head = [
    `# Interview receipt: real owner (${trade})`, "",
    `- Source: real owner run, imported from \`${source}\``,
    `- Prompt: ${promptLine}`,
    `- Interviewer: the owner's own AI (${ai})`,
    "- Real web searches by interviewer: unknown · pages fetched: unknown (check every named source by hand)",
    `- AI turns: ${aiTurns.length} · ended with closing line: ${ended}`,
    `- Imported at: ${new Date().toISOString()}`,
    "- Owner feedback (fill in): did the test make sense? will you run it? what was confusing?", "", "---", "",
  ];
  const body = chat.map((t) => `### ${t.who}\n\n${t.text}\n`);
  return head.concat(body).join("\n").replace(EMAIL, "[email redacted]").replace(PHONE, "[phone redacted]");
}

const isMain = (process.argv[1] ?? "").replace(/\\/g, "/").endsWith("verify/import-transcript.mjs");
if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  const receipt = buildReceipt(readFileSync(opts.pos[0], "utf8"), { trade: opts.trade, ai: opts.ai, source: opts.pos[0].split(/[\\/]/).pop() });
  mkdirSync(dirname(opts.pos[1]), { recursive: true });
  writeFileSync(opts.pos[1], receipt);
  console.log(`wrote ${opts.pos[1]}`);
  const names = possibleNames(receipt);
  if (names.length) console.log(`Check these for real names before committing (edit to a role, e.g. "a customer"): ${names.join(", ")}`);
}
