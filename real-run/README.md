# Real-owner runs: the runbook

The harness proves the rules hold when one AI plays an owner. This folder is for the part it can't prove:
real trades owners using the tool in their own AI. Send `FOR-OWNERS.md`; work each reply through the steps below.

## Where the transcripts live
`receipts/real/` is **gitignored**. Real transcripts never go into this public repo, even scrubbed: a trade,
a city and a crew size can identify someone. They stay on the local machine. The checker still scans them.

## For each reply
1. Save the pasted chat as `receipts/real/raw/<trade>-<n>.txt`. If it isn't a ChatGPT copy-all ("You said:" /
   "ChatGPT said:"), put `ME:` or `AI:` at the start of each message.
2. Import: `node verify/import-transcript.mjs receipts/real/raw/painter-1.txt receipts/real/painter-1.md --trade painter --ai chatgpt`
   It redacts emails and phone numbers and prints possible names. Change each real name to a role ("a customer").
3. Check the header says the prompt **matches the current prompt**. If it differs, the owner used an old copy.
4. Fill in the owner-feedback line in the header from their three answers.
5. Grade: `node verify/grade.mjs receipts/real/painter-1.md`. Web use is unknown here, so open every
   `[SOURCED: ...]` source by hand and confirm it says what the chat claims.
6. Run `node checker/check.mjs` before any commit (it scans `receipts/` for emails and private names).

## Turning runs into v7.3
- Change the prompt for anything that breaks in 2 of 3 runs, or anything that breaks a load-bearing rule once.
- The best signal is the owner's answer to "will you run it this week?". A grader pass with a "no" is a miss.
- After a change: rerun the harness (`verify/`), then `node scripts/install.mjs`.
