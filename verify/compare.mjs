#!/usr/bin/env node
// Before/after table for the three main personas: hard rules passed, outcome, searches/fetches, library line.
// Usage: node verify/compare.mjs <before dir> <after dir>   (e.g. receipts/baseline-v6 receipts/cycle6)

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gradeReceipt } from "./grade.mjs";

const OUTCOME = /^\s*(\*\*|#+\s*)?(RECOMMENDATION|WORKING HYPOTHESIS|NOT ENOUGH EVIDENCE YET)/im;
function row(dir, persona) {
  const text = readFileSync(join(dir, `${persona}.md`), "utf8");
  const res = gradeReceipt(text);
  const hard = Object.entries(res).filter(([, v]) => v.pass !== null);
  const failed = hard.filter(([, v]) => !v.pass).map(([k]) => k);
  const final = text.split(/^### AI\s*$/m).pop();
  const outcome = (final.match(OUTCOME) || [])[2] ?? ((final.match(/working hypothesis/i) || [])[0] ?? "unlabelled");
  const web = text.match(/searches by interviewer: (\d+) · pages fetched: (\d+)/) || [];
  return `| ${persona} | ${dir.split(/[\/]/).pop()} | ${hard.length - failed.length}/${hard.length} | ${outcome} | ${web[1]}/${web[2]} | ${res.libraryMention.detail} | ${failed.join(", ") || "none"} |`;
}

const [before, after] = process.argv.slice(2);
console.log("| Persona | Run | Hard rules passed | Outcome | Searches/pages | Library | Failed rules |");
console.log("|---|---|---|---|---|---|---|");
for (const p of ["painter", "builder", "hvac"]) { console.log(row(before, p)); console.log(row(after, p)); }
