---
node: checker
role: contract
---

# Contract — checker

**What it reads:** `SKILL.md` and `find-the-idea-prompt.md` at the package root.

**What it does:** `check.mjs` verifies the two functional invariants that keep this a working skill:
1. `SKILL.md` exists at the root with `name: find-the-idea` in its frontmatter (the Claude skill
   loader needs it there).
2. The v6 prompt embedded in `SKILL.md` is identical to `find-the-idea-prompt.md`, the source of
   truth (the copy in SKILL.md must never drift from it).

**What it writes:** `PASS` and exit 0, or `FAIL: <reason>` and exit 1.

**What a human checks:** run it before publishing or after any prompt edit —
`node checker/check.mjs` from the package root. Green means safe to push.
