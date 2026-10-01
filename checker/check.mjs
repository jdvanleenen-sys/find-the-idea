#!/usr/bin/env node
// Checker for the find-the-idea skill package. Fails loud on any drift.
//   1. SKILL.md has `name: find-the-idea` and embeds find-the-idea-prompt.md exactly.
//   2. The seven load-bearing rules from provenance.md are still in the prompt.
//   3. Voice: no em/en dashes, no "ICM", no honesty framing, within the word budget.
//   4. No private names (checker/leak-terms.local.txt, gitignored) in the shipped files.
//   5. With --installed: the installed skill matches this repo.
//
// Usage: node checker/check.mjs [--root <package dir>] [--installed [<skills dir>]]

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { checkEmbedding, checkLoadBearing, checkVoice, checkLeaks, checkInstalled } from "./rules.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const flag = (name) => args.indexOf(name);
const root = flag("--root") >= 0 ? args[flag("--root") + 1] : join(here, "..");
const read = (f) => (existsSync(join(root, f)) ? readFileSync(join(root, f), "utf8") : null);

const fails = [];
const skill = read("SKILL.md");
const prompt = read("find-the-idea-prompt.md");
if (skill === null) fails.push("SKILL.md is missing from the package root (the skill loader needs it there).");
if (prompt === null) fails.push("find-the-idea-prompt.md is missing (it is the source of truth and the escape hatch).");
if (skill !== null && prompt !== null) {
  fails.push(...checkEmbedding(skill, prompt), ...checkLoadBearing(prompt), ...checkVoice(prompt));
  const shipped = { "SKILL.md": skill, "find-the-idea-prompt.md": prompt, "README.md": read("README.md") ?? "" };
  fails.push(...checkLeaks(shipped, join(here, "leak-terms.local.txt")));
}
if (flag("--installed") >= 0) {
  const next = args[flag("--installed") + 1];
  const dir = next && !next.startsWith("--") ? next : join(homedir(), ".claude", "skills", "find-the-idea");
  fails.push(...checkInstalled(root, dir));
}

if (fails.length) {
  for (const f of fails) console.error("FAIL: " + f);
  console.error("\nChecker found problems. Fix them before publishing.");
  process.exitCode = 1;
} else {
  console.log("PASS: prompt embedded exactly, load-bearing rules present, voice clean, no leak terms" +
    (flag("--installed") >= 0 ? ", installed copy matches." : "."));
}
