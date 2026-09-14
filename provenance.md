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

If you edit the prompt, edit `find-the-idea-prompt.md`, re-embed it in `SKILL.md`, and run
`node checker/check.mjs`.
