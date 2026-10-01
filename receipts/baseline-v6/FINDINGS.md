# Baseline findings: v6 prompt on three trades owners (2026-10-01)

Runs: `painter.md`, `builder.md`, `hvac.md` in this folder. Interviewer and owner were separate headless
sessions (Sonnet), web tools on. Grader: `node verify/grade.mjs receipts/baseline-v6/*.md`.

## What v6 got right (keep it)
- **No invented research.** Every `[SOURCED: ...]` tag in painter and builder matches a page the session
  actually fetched (checked against the session logs). HVAC searched nothing and said so.
- **No padding in the verdicts.** All three ended in a working hypothesis, not an enthusiastic pick.
  Builder: "Selling 'an AI platform for builders' isn't something I can help with yet. That's a category,
  not a buyer or a pain."
- **It found the strongest real signal when the owner volunteered it.** Painter: the two property managers
  who "asked me more than once" for scheduled turnovers.

## Where it failed (with evidence)
| ID | Failure | Evidence (quote) | Criterion |
|---|---|---|---|
| B1 | Opens with a tech-founder intake, not the owner's business. | All three: "list your projects, skills, work people have paid you for". Painter replied: "Projects, you mean paint jobs?" | D3 |
| B2 | Never asks about reviews or lost quotes unprompted. Grounding depends on the owner volunteering it. | Grader: painter asked about none of reviews, missed calls, lost quotes, things customers ask for; builder only lost quotes (because Marco raised estimating); HVAC only missed calls (Priya raised them). The painter's 112 reviews and 1-star "nobody called back" never came up. | D3 |
| B3 | No library match where one plainly fits. | HVAC: 31% of January calls missed, after-hours voicemail, callers going to a competitor. The AI receptionist build is not mentioned. Painter's missed calls (9 missed, 4 returned) never surfaced at all. | D4 |
| B4 | Can sit on web tools and never search, which locks out a recommendation. | HVAC: "I'll only say I can browse if a search actually returns results. Until then, treat browsing as unavailable." Zero searches in the session log; final: "I also haven't searched the web this session." | D1 |
| B5 | Safety rule over-fires on ordinary licensed trade work. | HVAC turn 2: "heating and gas work touches safety ... I won't recommend a paid pilot in that area." A licensed furnace shop offering more of its own licensed work is treated like a lending product. | D7 |
| B6 | Not in the lesson format. | No See it / Do it / Own it in any final message (grader `lessonBeats` FAIL x3). | D6 |
| B7 | Voice breaks. | En dashes (HVAC "5–8 short conversations", painter "85–90%"); honesty framing (painter "I can't honestly tell you"; HVAC "That's honest, and it matters"); praise opener (painter "Good. That's useful."). | D5, D2 |
| B8 | Several questions bundled into one turn. | HVAC Q3 and Q4, painter Q3 and Q4: three questions in one message (grader `oneQuestionAtATime`). | D1 (interview quality) |
| B9 | Breaks its own "add nothing after the closing line" rule. | Painter appended a "Sources:" list after "that's the next step." | D1 |
| B10 | The "one test this week" is a list of chores, not one test with a yes/no result. | HVAC: three bullets (match call logs, 5 to 8 conversations, ask crew and broker). By design v6 withholds a pass/fail test from a working hypothesis, so all three runs ended without a yes/no result to aim at. | D1 |
| B11 | Outcome label buried. | Painter: "so this is a **Working Hypothesis**, not a validated plan" inside a sentence. | D1 |

## Harness notes (not skill defects)
- The CLI injects the account email, so turn 1 says "The only thing I have is your work email address".
  A member pasting into ChatGPT would not see this.
- The first harness version under-counted web calls (it read `server_tool_use`, which does not include the
  CLI's client-side WebSearch and WebFetch). Fixed to read the session log; receipts corrected and marked.
