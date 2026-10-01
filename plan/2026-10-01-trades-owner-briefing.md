# Briefing: find-the-idea for trades owners (2026-10-01)

The plan that governs this round of work. If any other file disagrees, the definition of done below wins.

## The job
Make find-the-idea the engine of the "Find Your Idea" track in the See It, Build It, Own It Skool. The
member is a trades or home-service owner, not a tech founder. The tool must strengthen the Skool's edge
(operator proof, the trades build library, access to the industry, a teacher built it) and must not
compete on the folder system.

## Definition of done (each item has the evidence that proves it)
| # | Done means | Evidence |
|---|---|---|
| D1 | Every run ends in exactly one outcome: one narrow idea plus one test this week, a working hypothesis, or "not enough evidence yet". A test names who, how to reach them, the exact ask, and the result that means yes or no. | `verify/grade.mjs` outcome check, plus a read of the transcript |
| D2 | No padding. No praise openers, no hype words, no promises. | grade.mjs hype and opener checks |
| D3 | The idea is grounded in the owner's real business: their customers, reviews, missed calls, lost quotes. The interview asks for at least two of these. | grade.mjs grounding check on the questions, plus a read of the deliverable |
| D4 | Where the idea (or the thing blocking it) matches a build in the trades library, the tool says so. It does not force a match where none fits. | Persona runs: HVAC should match, one persona should not |
| D5 | Voice: no em dashes, no "ICM" (say "folder system"), Canadian spelling, no hype. | grade.mjs voice checks on every AI turn |
| D6 | The deliverable runs in the lesson format: See it, Do it, Own it. | grade.mjs heading check |
| D7 | The seven load-bearing rules in `provenance.md` still hold, and the regulated-area rule does not block ordinary trades work. | Adversarial cycle runs plus checker |
| D8 | Ownership: no employer name, employer examples or job title anywhere (terms kept in a gitignored local list). RyMac material is cleared to borrow without credit. Jake Van Clief is credited by name wherever ICM itself is taught. | Leak-scrub grep in the checker |
| D9 | One home. The repo is canonical; the installed skill is installed from it; the private working copy is a pointer with no code. | checker `--installed` flag, folder listing |

## Protected surface (do not break)
- The portable prompt must still work pasted into a plain ChatGPT, Claude or Perplexity chat.
- The seven load-bearing rules in `provenance.md`.
- Scope: Part A only. It stops at one idea and one test.

## Autonomy boundary
No publishing to Skool, no public posts. Commits and pushes go to the feature branch only.

## Out of scope (asked about, not built)
The member-facing "customer pain finder" (ideas log, 2026-10-01). Decision and reasoning go to Jeff; it is
not built inside this skill without his yes.
