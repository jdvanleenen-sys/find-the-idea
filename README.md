# Find the Idea

A venture-discovery tool for trades and home-service owners. Give it to any capable AI assistant
(ChatGPT, Claude, or Perplexity) and it interviews you about your real business (what customers keep
asking for, what your reviews say, the calls you miss, the quotes you lose) down to **one** narrow,
painful problem for a buyer you can actually reach, plus **one** test you can run this week. If the
evidence isn't there, it says so instead of inventing a business.

It is built to be safe for a non-technical person to run unsupervised: it won't fake research it
didn't do, won't use your private data without asking, and won't promise earnings.

> **Status: under construction.** It works and has been hardened, but it's still being tested in the
> wild. Treat its output as a starting point, not gospel.

## Two ways to use it

**1. Paste the prompt (works anywhere).**
Open [`find-the-idea-prompt.md`](find-the-idea-prompt.md), copy the whole thing, paste it into a
fresh chat, and answer its questions. For a full recommendation, use an assistant that can search
the web; without search it gives you a working hypothesis instead.

**2. Install it as a Claude skill.**
Run `node scripts/install.mjs` (it copies `SKILL.md` and the prompt to `~/.claude/skills/find-the-idea/`). Then
just say "help me find a business idea" or type `/find-the-idea`. Say "give me the raw prompt" and
it hands you the portable version to paste elsewhere.

## What you get
One of three outcomes, laid out as **See it** (what the evidence shows), **Do it** (one test this
week with the result that means yes or no) and **Own it** (what you do with the result): a
**Recommendation**, a **Working Hypothesis** (best guess, not validated), or **Not enough evidence
yet** (what's missing and one small step). If your idea, or a leak that would sink it, matches a build
in the trades build library (the AI receptionist, quote-to-invoice), it says so. This is discovery only. Turning the idea into a full offer
and sales plan is a separate step.

## What it reads
It works best when some of your work is already written down where it can read it, like your files,
notes, and past projects. Most people who need this do not have that yet. Their operation lives in
their head, their phone, and the workarounds they use to get past their own system. If that is you,
point it at your exceptions instead: the spreadsheet someone keeps on the side because the real
system cannot handle a case, the email thread that is actually the approval step, the job done twice
because two records disagree and nobody decided which one counts. That is where the real process
lives, and that is what it should read.

This is the part still being worked on. Run it, then tell me where it fell short.

## How it's built
The folder is an ICM (Interpretable Context Methodology) package, and the structure is the
documentation. Start at [`CLAUDE.md`](CLAUDE.md) to walk it, [`provenance.md`](provenance.md) for
how the prompt was hardened and which rules must not be softened, and [`CONTEXT.md`](CONTEXT.md) for
the exact contract. Before publishing changes, run `node checker/check.mjs`.

## How it's tested
`verify/harness/run-interview.mjs` runs a full interview between two separate AI sessions: one gets
only the prompt, the other plays a trades owner from `verify/personas/`. `verify/grade.mjs` checks
the transcript (outcome label, See it / Do it / Own it, voice, grounding questions, no faked
research). Every run is kept in `receipts/`, with the prompt's hash and the searches it actually made.
`node checker/selftest.mjs` and `node verify/selftest.mjs` prove both checks can fail.

## License
This package is released under the MIT License, copyright 2026 Jeff Van Leenen. See
[`LICENSE`](LICENSE). The ICM method it builds on is separately MIT-licensed (Van Clief &
McDermott, arXiv:2603.16021).
