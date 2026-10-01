// Invariants the prompt and its package must keep. Each check returns a list of failure strings.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const ANCHOR = "You are my venture strategist and discovery interviewer.";
export const WORD_BUDGET = 1700;

// The seven load-bearing rules in provenance.md, each pinned to a phrase that carries it.
// Removing or rewording one of these phrases is a change to a load-bearing rule: update provenance.md first.
export const LOAD_BEARING = [
  ["1 declare capabilities, never fake", "Never say you searched, browsed, or read a source that you didn't."],
  ["2 consent for held context", "If you already hold context about me, say so and ask before using it."],
  ["3 two kinds of evidence", "needs an outside source you actually opened this session"],
  ["4 offline means working hypothesis", "If you can't search: say so, invent nothing"],
  ["5 the bar is the pain, not the category", "\"The category exists\" is not enough."],
  ["6 abstention is valid", "Concluding there isn't enough evidence yet is a valid, successful result"],
  ["7a no promises", "Never promise earnings, ROI, or outcomes."],
  ["7b regulated areas get review", "it needs qualified local review"],
];

export const norm = (s) => s.replace(/\r\n/g, "\n").replace(/[ \t]+$/gm, "").trim();

export function checkEmbedding(skill, prompt) {
  const fails = [];
  if (!/^name:\s*find-the-idea\s*$/m.test(skill)) fails.push("SKILL.md frontmatter is missing `name: find-the-idea`.");
  const i = skill.indexOf(ANCHOR);
  if (i === -1) fails.push("Could not find the prompt inside SKILL.md (anchor line missing).");
  else if (norm(skill.slice(i)) !== norm(prompt)) {
    fails.push("The prompt embedded in SKILL.md has DRIFTED from find-the-idea-prompt.md. Re-copy it into the VERBATIM INSTRUCTIONS block.");
  }
  return fails;
}

export function checkLoadBearing(prompt) {
  const flat = prompt.replace(/\s+/g, " ");
  return LOAD_BEARING.filter(([, phrase]) => !flat.includes(phrase))
    .map(([name, phrase]) => `Load-bearing rule ${name} is missing its phrase: "${phrase}"`);
}

export function checkVoice(prompt) {
  const fails = [];
  const dashes = (prompt.match(/[—–]/g) || []).length;
  if (dashes) fails.push(`Prompt contains ${dashes} em/en dashes (models copy them into the output).`);
  if (/\bICM\b/.test(prompt)) fails.push('Prompt says "ICM"; members see "folder system".');
  const withoutBan = prompt.replace(/"honest" or "honestly"/g, "");
  if (/\bhonest(ly|y)?\b/i.test(withoutBan)) fails.push('Prompt uses "honest"/"honesty" outside the ban line (voice rule).');
  const words = prompt.split(/\s+/).filter(Boolean).length;
  if (words > WORD_BUDGET) fails.push(`Prompt is ${words} words; budget is ${WORD_BUDGET} (long prompts broke weak models before).`);
  return fails;
}

// Private names live in checker/leak-terms.local.txt (gitignored). "executive" is built in.
export function checkLeaks(files, leakFile) {
  const terms = ["executive"];
  if (existsSync(leakFile)) {
    terms.push(...readFileSync(leakFile, "utf8").split(/\r?\n/).map((t) => t.trim()).filter(Boolean));
  }
  const fails = [];
  for (const [name, text] of Object.entries(files)) {
    for (const t of terms) if (text.toLowerCase().includes(t.toLowerCase())) fails.push(`Leak term found in ${name}.`);
  }
  return fails;
}

export function checkInstalled(root, installedDir) {
  const fails = [];
  for (const f of ["SKILL.md", "find-the-idea-prompt.md"]) {
    const a = join(root, f);
    const b = join(installedDir, f);
    if (!existsSync(b)) fails.push(`Installed copy is missing ${f} (run node scripts/install.mjs).`);
    else if (norm(readFileSync(a, "utf8")) !== norm(readFileSync(b, "utf8"))) {
      fails.push(`Installed ${f} differs from the repo (run node scripts/install.mjs).`);
    }
  }
  return fails;
}
