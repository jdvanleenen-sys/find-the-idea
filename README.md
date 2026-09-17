# Find the Idea

A venture-discovery tool. Give it to any capable AI assistant (ChatGPT, Claude, or Perplexity) and
it interviews you down to **one** narrow, painful problem for a buyer you can actually reach, plus
**one** fast test you can run this week to find out if it's real. If the evidence isn't there, it
says so honestly instead of inventing a business.

It is built to be safe for a non-technical person to run unsupervised: it won't fake research it
didn't do, won't use your private data without asking, and won't promise earnings.

> **Status: under construction.** It works and has been hardened, but it's still being tested in the
> wild. Treat its output as a starting point, not gospel.

## Two ways to use it

**1. Paste the prompt (works anywhere).**
Open [`find-the-idea-prompt.md`](find-the-idea-prompt.md), copy the whole thing, paste it into a
fresh chat, and answer its questions. For a full recommendation, use an assistant that can browse
the web; without browsing it will give you an honest working hypothesis instead.

**2. Install it as a Claude skill.**
Copy this folder into your Claude skills directory (e.g. `~/.claude/skills/find-the-idea/`). Then
just say "help me find a business idea" or type `/find-the-idea`. Say "give me the raw prompt" and
it hands you the portable version to paste elsewhere.

## What you get
One of three honest outcomes: a **Recommendation** (buyer, offer, and a test with a clear pass/fail),
a **Working Hypothesis** (best guess plus what still needs checking), or **Can't Recommend Yet**
(what's missing and one small next step). This is discovery only. Turning the idea into a full offer
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

## License
This package is released under the MIT License, copyright 2026 Jeff Van Leenen. See
[`LICENSE`](LICENSE). The ICM method it builds on is separately MIT-licensed (Van Clief &
McDermott, arXiv:2603.16021).
