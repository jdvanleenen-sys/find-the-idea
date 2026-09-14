---
node: find-the-idea
role: contract
part: A (discovery)
---

# Contract — find-the-idea

**What it reads (inputs)**
- The founder's answers, given live, one question at a time (facts about themselves).
- Optionally, a file the founder attaches in the chat.
- The live web, only if the host assistant can actually browse (facts about the market).

**What it does (process)**
1. Declares what it can actually do in this chat, and asks consent before using any context it
   already holds about the user.
2. Grounds itself in the user's real work, then interviews (up to 8 questions, reachability first).
3. If it can browse, researches the few things that decide it, from named sources.
4. Delivers exactly one of three outcomes, chosen by a rule.

**What it writes (output)** — one of:
- **RECOMMENDATION** — one buyer, one offer sellable by hand, and one falsifiable test this week
  (only when browsing worked, the research bar is met, and the interview minimum is met).
- **WORKING HYPOTHESIS** — best guess, clearly not validated, plus what to check (offline or thin evidence).
- **CAN'T RECOMMEND YET** — what's missing and one small next step.
Each ends with a one-line evidence note.

**What a human checks**
The founder judges the output. The recommendation is gated by real evidence, not enthusiasm, and
"not enough evidence yet" is a valid, successful result. Behavior is defined verbatim in
`find-the-idea-prompt.md`.
