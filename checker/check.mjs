#!/usr/bin/env node
// ICM checker for the find-the-idea skill package.
// Enforces the two functional invariants:
//   1. SKILL.md exists at the package root with `name: find-the-idea` in its frontmatter.
//   2. The v6 prompt embedded in SKILL.md is identical to find-the-idea-prompt.md
//      (find-the-idea-prompt.md is the single source of truth; SKILL.md embeds a derived copy).
// Run from the package root:  node checker/check.mjs

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const norm = (s) => s.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();
const anchor = "You are my venture strategist and discovery interviewer.";
let ok = true;
const fail = (m) => { ok = false; console.error("FAIL: " + m); };

const skillPath = join(root, "SKILL.md");
const promptPath = join(root, "find-the-idea-prompt.md");

let skill = "";
let prompt = "";

if (!existsSync(skillPath)) {
  fail("SKILL.md is missing from the package root (the skill loader needs it there).");
} else {
  skill = readFileSync(skillPath, "utf8");
  if (!/^name:\s*find-the-idea\s*$/m.test(skill)) {
    fail("SKILL.md frontmatter is missing `name: find-the-idea`.");
  }
}

if (!existsSync(promptPath)) {
  fail("find-the-idea-prompt.md is missing from the root (the escape hatch pastes it; it is the source of truth).");
} else {
  prompt = readFileSync(promptPath, "utf8");
}

if (skill && prompt) {
  const i = skill.indexOf(anchor);
  if (i === -1) {
    fail("Could not find the v6 prompt inside SKILL.md (anchor line missing).");
  } else if (norm(skill.slice(i)) !== norm(prompt)) {
    fail("The prompt embedded in SKILL.md has DRIFTED from find-the-idea-prompt.md. Re-copy the source into SKILL.md's VERBATIM INSTRUCTIONS block.");
  }
}

if (ok) {
  console.log("PASS: SKILL.md present at root with correct name, and the embedded prompt matches find-the-idea-prompt.md exactly.");
} else {
  console.error("\nChecker found problems. Fix them before publishing.");
  process.exitCode = 1;
}
