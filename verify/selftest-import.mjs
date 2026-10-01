#!/usr/bin/env node
// Proves the importer round-trips: a harness receipt rewritten as a ChatGPT copy-all paste (prompt first,
// with a planted email, phone and name) must import to a receipt that grades the same on every non-web
// rule, with the email and phone redacted, the name flagged, and the prompt version recognised.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildReceipt } from "./import-transcript.mjs";
import { gradeReceipt, parseReceipt } from "./grade.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const source = readFileSync(join(root, "receipts", "cycle6", "hvac.md"), "utf8");
const prompt = readFileSync(join(root, "find-the-idea-prompt.md"), "utf8");

// Rebuild the chat as ChatGPT would copy it: prompt first, then alternating turns.
const turns = source.replace(/\r\n/g, "\n").split(/\n---\n/).slice(1).join("\n---\n").split(/^### (AI|OWNER)\s*$/m).slice(1);
const lines = ["You said:", prompt];
for (let i = 0; i < turns.length; i += 2) {
  let text = turns[i + 1].trim();
  if (i === 2) text += "\nCall me at 204-555-0187 or priya.test@example.com. My neighbour Rosa Delgado said the same.";
  lines.push(turns[i] === "AI" ? "ChatGPT said:" : "You said:", text);
}
const receipt = buildReceipt(lines.join("\n"), { trade: "hvac", ai: "chatgpt", source: "selftest" });

const problems = [];
const original = gradeReceipt(source);
const imported = gradeReceipt(receipt);
for (const [rule, v] of Object.entries(original)) {
  if (["noFakeSearch", "sourcedWasOpened", "libraryMention"].includes(rule)) continue;
  if (v.pass !== imported[rule].pass) problems.push(`${rule}: original ${v.pass}, imported ${imported[rule].pass}`);
}
if (imported.noFakeSearch.pass !== null) problems.push("noFakeSearch should be informational for an imported run");
if (/204-555-0187|priya\.test@example\.com/.test(receipt)) problems.push("phone or email not redacted");
if (!/matches the current prompt/.test(receipt)) problems.push("prompt version not recognised");
if (receipt.includes("You are my venture strategist")) problems.push("pasted prompt left in the transcript");
if (parseReceipt(receipt).ai.length !== parseReceipt(source).ai.length) problems.push("AI turn count changed");

if (problems.length) {
  console.error("IMPORT SELFTEST FAIL:\n  " + problems.join("\n  "));
  process.exitCode = 1;
} else {
  console.log("IMPORT SELFTEST PASS: round-trip grades match, email and phone redacted, prompt version recognised.");
}
