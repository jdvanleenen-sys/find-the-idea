#!/usr/bin/env node
// Grades one or more interview receipts against the mechanical rules in grade-rules.mjs.
// Prints a matrix (rule x receipt). Exit 1 if any rule fails on any receipt.
// libraryMention is informational (pass: null): whether a match is right depends on the persona.
//
// Usage: node verify/grade.mjs <receipt.md> [more receipts...] [--json]

import { readFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { RULES } from "./grade-rules.mjs";

export function parseReceipt(text) {
  const searches = Number((text.match(/Real web searches by interviewer: (\d+)/) || [])[1] ?? 0);
  const ended = /ended with closing line: true/.test(text);
  const body = text.split(/\n---\n/).slice(1).join("\n---\n");
  const blocks = body.split(/^### (AI|OWNER)\s*$/m).slice(1);
  const ai = [];
  for (let i = 0; i < blocks.length; i += 2) if (blocks[i] === "AI") ai.push(blocks[i + 1].trim());
  return { ai, final: ai[ai.length - 1] ?? "", webSearches: searches, ended };
}

export function gradeReceipt(text) {
  const r = parseReceipt(text);
  return Object.fromEntries(Object.entries(RULES).map(([name, rule]) => [name, rule(r)]));
}

function label(file) {
  return `${basename(dirname(file))}/${basename(file, ".md")}`;
}

function printMatrix(results) {
  const names = Object.keys(RULES);
  const files = Object.keys(results);
  const mark = (v) => (v.pass === null ? "info" : v.pass ? "PASS" : "FAIL");
  console.log(["rule", ...files.map(label)].join(" | "));
  for (const n of names) console.log([n, ...files.map((f) => mark(results[f][n]))].join(" | "));
  console.log("\nDetails:");
  for (const f of files) {
    console.log(`- ${label(f)}`);
    for (const n of names) console.log(`    ${n}: ${results[f][n].detail}`);
  }
}

const isMain = process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]));
if (isMain) {
  const args = process.argv.slice(2);
  const files = args.filter((a) => !a.startsWith("--"));
  if (!files.length) { console.error("Usage: grade.mjs <receipt.md> [...] [--json]"); process.exit(2); }
  const results = Object.fromEntries(files.map((f) => [f, gradeReceipt(readFileSync(f, "utf8"))]));
  if (args.includes("--json")) console.log(JSON.stringify(results, null, 2));
  else printMatrix(results);
  const failed = Object.values(results).some((res) => Object.values(res).some((v) => v.pass === false));
  process.exitCode = failed ? 1 : 0;
}
