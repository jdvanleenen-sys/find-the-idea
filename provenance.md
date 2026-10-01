---
node: find-the-idea
role: provenance
---

# What this is, how it was hardened, and what not to change

## What it is
"Find the Idea" is **Part A** of a two-part venture toolkit. Part A finds one idea + one test and
stops. Part B (the offer, validation, first-sale, delivery, and sprint — the "launch kit") is a
separate tool and deliberately not in this package. Concluding "not enough evidence yet" is a
success, not a failure.

## How it was hardened
The prompt was tested and rewritten across multiple rounds of adversarial review, run independently
on **ChatGPT, Claude, and Perplexity**:
- Early versions broke on assistants with no web or file access — they faked research to satisfy a
  mandatory "deep research" step. Fixed with capability-by-declaration and an honest offline mode.
- A later version forced an "AI-enabled" answer even when the best opportunity wasn't AI. Fixed by
  making AI one option among several.
- One version became over-engineered (too many rules for a weak model to follow). It was cut back.
- The final version (v6) fixed the last round's findings: separate evidence about the user from
  evidence about the market; a research bar that needs proof the pain recurs, not just that a
  category exists; consent before using held context (memory, projects, connectors); and a real
  "can't recommend yet" exit.

## Load-bearing rules — do NOT soften these
Each survived a reviewer trying to break it. Changing one reopens a failure:
1. **Declare capabilities, never fake them.** No claiming a search or a source it didn't actually use.
2. **Consent for held context.** Never mine memory/projects/connectors/past chats about the user
   without asking in this session. (A real assistant leaked this before it was fixed.)
3. **Two kinds of evidence, kept apart.** The user is the source for facts about themselves; facts
   about the market need a source opened this session.
4. **Offline → Working Hypothesis only.** No invented market size, prices, or competitors.
5. **The research bar is the pain, not the category.** "Dentists exist" is not evidence dentists
   feel this pain often enough to pay.
6. **Abstention is allowed and valid.** It must be free to say "not enough evidence yet."
7. **No earnings/ROI promises; regulated domains get review, not a paid pilot.**

If you edit the prompt, edit `find-the-idea-prompt.md`, re-embed it in `SKILL.md`, run `node checker/check.mjs`, and rerun the harness in `verify/`. Old wording: run
`node checker/check.mjs`.

## v7 (2026-10-01): rebuilt for trades and home-service owners
Tested with a two-session harness (`verify/`) on a painter, a home builder and an HVAC shop; v6 baseline and
findings in `receipts/baseline-v6/FINDINGS.md`. What changed, and why:
- **Grounding** asks about the owner's real business (what customers ask for, reviews, missed calls, lost
  quotes) instead of "projects and skills". v6 never asked about reviews or lost quotes on its own.
- **Search is mandatory when a tool exists.** v6 let a model sit on a working search tool and never use it.
- **Regulated rule is scoped, not removed.** It still fires on advice, lending, insurance, hiring, tenancy,
  immigration, minors, and safety claims beyond the owner's licence, and "if unsure, assume it is" stays.
  More of the owner's own licensed trade work is not in the group by itself. v6 blocked a licensed furnace shop.
- **Own-customer records count as pain evidence** (v7.1). When the buyer is the owner's existing customers,
  a record (a count from reviews, a phone log, quotes, or repeat requests) meets bar (1). A vague "lots of
  people ask" does not. The workaround (bar 2) must still be sourced, so no search still means a working
  hypothesis. Rules 3 to 5 above are unchanged: a record about your own customers is not a market claim.
- **Output** leads with the outcome label, then See it / Do it / Own it (the curriculum's lesson beats), a
  library line, and a test with a yes/no result even for a working hypothesis (no prices, no competitor claims).
- **Voice**: no em dashes, no honesty framing, Canadian spelling, "folder system", one question per message.
The checker now pins each load-bearing rule to a phrase (`checker/rules.mjs`); rewording one fails the build.
