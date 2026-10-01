#!/usr/bin/env node
// Installs the skill from this repo (the one home) into the local Claude skills folder.
// Copies only the two runtime files; the harness, receipts and checker stay in the repo.
// Usage: node scripts/install.mjs [<skills dir>]   (default ~/.claude/skills/find-the-idea)

import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = process.argv[2] ?? join(homedir(), ".claude", "skills", "find-the-idea");
mkdirSync(target, { recursive: true });
for (const f of ["SKILL.md", "find-the-idea-prompt.md"]) copyFileSync(join(root, f), join(target, f));
console.log(`Installed SKILL.md and find-the-idea-prompt.md to ${target}. Verify: node checker/check.mjs --installed`);
