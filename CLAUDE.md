# find-the-idea — ICM router

The "Find the Idea" venture-discovery skill. Following one prompt, a general AI assistant
interviews a founder down to ONE narrow, sourced, honestly-gated venture idea plus one fast test
this week — or an honest "not enough evidence yet." Part A (discovery) only.

## Where things live
| You want to… | Go to |
|---|---|
| Run it as a Claude skill | `SKILL.md` (loader entry — do not move or rename) |
| The raw portable prompt (paste into any AI) | `find-the-idea-prompt.md` — **the source of truth** |
| What it is · how it was hardened · what NOT to change | `provenance.md` |
| The exact contract (inputs · process · output · human check) | `CONTEXT.md` |
| Check nothing drifted before publishing | `checker/` — run `node checker/check.mjs` |
| Use or install it as a human | `README.md` |

## The one rule that matters
`find-the-idea-prompt.md` is the single home for the prompt text. `SKILL.md` embeds a copy so the
skill loads reliably in one read. If you change the prompt: edit `find-the-idea-prompt.md`, paste it
back into SKILL.md's VERBATIM INSTRUCTIONS block, then run the checker. The prompt is
red-team-hardened — read `provenance.md` before touching any rule.

## Scope
Part A only: it stops at one idea + one test. The full offer and sales plan (Part B) is a separate
tool and is not in this package.
