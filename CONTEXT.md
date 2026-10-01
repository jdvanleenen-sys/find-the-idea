---
node: find-the-idea
role: contract
part: A (discovery)
---

# Contract — find-the-idea

**What it reads (inputs)**
- The owner's answers, given live, one question at a time: their business, customers, reviews,
  missed calls, lost quotes, reach, time and money (facts about themselves).
- Optionally, a file the founder attaches in the chat.
- The live web, only if the host assistant can actually browse (facts about the market).

**What it does (process)**
1. Declares what it can actually do in this chat, and asks consent before using any context it
   already holds about the user.
2. Grounds itself in the owner's real business, then interviews (up to 8 questions in total, reachability first).
3. If it can search, it must: the few things that decide it, from named sources, plus one search for evidence the idea is wrong.
4. Delivers exactly one of three outcomes, chosen by a rule.

**What it writes (output)** — one of:
- **RECOMMENDATION** — one buyer, one offer sellable by hand, and one falsifiable test this week
  (only when browsing worked, the research bar is met, and the interview minimum is met).
- **WORKING HYPOTHESIS** — best guess, clearly not validated, plus what to check (offline or thin evidence).
- **NOT ENOUGH EVIDENCE YET** — what's missing and one small next step.
Each is laid out as See it / Do it / Own it, names a build-library match or "none", and ends with a
one-line evidence note.

**What a human checks**
The founder judges the output. The recommendation is gated by real evidence, not enthusiasm, and
"not enough evidence yet" is a valid, successful result. Behavior is defined verbatim in
`find-the-idea-prompt.md`.
