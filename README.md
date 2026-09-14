# Find the Idea

A distributable AI skill that turns a general assistant into a venture-discovery interviewer.

It has one job: help a founder (especially a non-technical one, running it unsupervised) land on
**ONE** narrow, painful problem for a buyer they can actually reach and win, plus the single
fastest honest way to test it this week. Then it stops. Concluding "there isn't enough evidence to
recommend yet" is treated as a valid, successful result, not a failure.

This is **Part A (discovery)** of a two-part system. It ends at one idea and one test. It does not
write the full sales or launch plan.

## What makes it different

The instructions are the survivor of two rounds of adversarial red-teaming across ChatGPT, Claude,
and Perplexity. The rules that came out of that are load-bearing:

- **Evidence is split.** Facts about you (your skills, who you can reach, your time and money) are
  taken as you tell them. Facts about the market (demand, prices, competitors) need an outside
  source the assistant actually opened this session, or they are marked unverified and cannot
  support a recommendation.
- **Capabilities are declared and proven, never faked.** If the assistant cannot actually browse,
  it says so and downgrades to a Working Hypothesis instead of inventing research.
- **Consent covers your data.** It will not use your files, memory, saved projects, connectors, or
  earlier chats as a source about you without asking first.
- **Three honest outcomes**, chosen by a rule: Recommendation, Working Hypothesis, or
  Can't-recommend-yet.
- **No earnings or ROI promises.** Regulated or high-stakes domains (health, legal, money, hiring,
  housing, insurance, immigration, minors, safety) get a conversation-only test and a call for
  qualified local review.
- Plain English, main output under about 250 words, one question at a time, and a required
  one-line evidence note at the end.

## How to run it

**Option 1 — Install as a Claude skill.** Copy this folder into your Claude skills directory:

- macOS / Linux: `~/.claude/skills/find-the-idea/`
- Windows: `C:\Users\<you>\.claude\skills\find-the-idea\`

Then start a session and say something like "help me find a business idea" or run
`/find-the-idea`. The skill runs the discovery interview in that chat.

**Option 2 — Paste the raw prompt into any AI.** Open [`find-the-idea-prompt.md`](find-the-idea-prompt.md),
copy the whole thing, and paste it into a fresh chat in ChatGPT, Claude, Perplexity, or any
assistant. Answer its questions one at a time. Use a browsing-capable assistant if you want it to
reach a full recommendation, since the recommendation gates on real, sourced market evidence.

When installed as a skill, it defaults to running in place, and you can also say "give me the raw
prompt" at any point to get the portable version to paste elsewhere.

## Files

| File | What it is |
|---|---|
| [`SKILL.md`](SKILL.md) | The installable skill: trigger description, run instructions, and the full prompt embedded verbatim. |
| [`find-the-idea-prompt.md`](find-the-idea-prompt.md) | The portable prompt on its own, for pasting into any AI. |

## After the idea

Part A gets you to one idea and one test. Turning that into an offer and a full sales plan is a
separate, paid follow-on (Part B, the launch kit), which is not included in this repository.
