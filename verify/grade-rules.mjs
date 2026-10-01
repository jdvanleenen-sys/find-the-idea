// The mechanical checks for an interview receipt. Each rule reads the parsed receipt and returns
// { pass, detail }. Judgment calls (is the idea narrow, is it grounded well) are not here; a person
// or a reviewing model reads the transcript for those.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HYPE = ["revolutionary", "game-changer", "game changer", "unlock", "supercharge", "effortless",
  "magic", "the future of", "seamless", "robust", "leverage", "streamline", "empower", "cutting-edge",
  "honestly", "to be honest", "the truth is", "exciting", "amazing", "incredible"];
const PRAISE_OPENER = /^(great|good|love|awesome|perfect|excellent|fantastic|amazing|nice|that's a great|what a)\b/i;
const US_SPELLING = /\b(color|colors|colored|favorite|behavior|behaviors|center|centers|labor|neighbor|neighbors|honor|catalog)\b/i;
// Private names (the author's employer and similar) live in a gitignored local file, one per line,
// so this public repo never contains them. "executive" stays built in: no job title in member output.
const LEAK_FILE = join(dirname(fileURLToPath(import.meta.url)), "..", "checker", "leak-terms.local.txt");
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const localTerms = existsSync(LEAK_FILE)
  ? readFileSync(LEAK_FILE, "utf8").split(/\r?\n/).map((t) => t.trim()).filter(Boolean) : [];
const LEAK = new RegExp(["\\bexecutive\\b", ...localTerms.map(escapeRe)].join("|"), "i");
export const LEAK_TERMS_LOADED = localTerms.length;
const CLAIMS_SEARCH = /\b(i searched|i looked (it )?up|search(es)? (returned|show)|i found (online|that)|according to [A-Z]|\[SOURCED)/i;
// An outcome counts only as a label: at the start of a line, optionally after a heading mark or bold.
const asLabel = (words) => new RegExp(String.raw`^\s*(#+\s*|\*\*)?(${words})\b`, "im");
const OUTCOME_LABELS = [asLabel("recommendation"), asLabel("working hypothesis"),
  asLabel("can'?t recommend yet|not enough evidence yet")];
const CLOSING = /that('|’)?s the next step\.?"?\s*$/i;
const GROUNDING = {
  reviews: /\breviews\b|google review|star rating/i,
  missedCalls: /\bmiss(ed|ing)?\b.{0,25}\bcalls?\b|\bcalls?\b.{0,30}\bmiss|voicemail|go unanswered/i,
  lostQuotes: /(lost|lose|losing|win|won|close)\w* (a |your |the )?(quotes?|bids?|estimates?)|(quotes?|bids?|estimates?) (you )?(lost|lose|don'?t win)/i,
  askedFor: /(customers?|clients?|people) (keep |always )?(ask|asking|request)/i,
};
const LIBRARY = /receptionist|quote[- ]to[- ]invoice|build library|trades library|Course 3|the Vault/i;

const countMatches = (text, re) => (text.match(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g")) || []).length;
const aiText = (r) => r.ai.join("\n");
const questionsAsked = (r) => r.ai.slice(0, -1).join("\n");

export const RULES = {
  emDashes: (r) => { const n = countMatches(aiText(r), /[—–]/); return { pass: n === 0, detail: `${n} em/en dashes` }; },
  noIcm: (r) => { const n = countMatches(aiText(r), /\bICM\b/); return { pass: n === 0, detail: `${n} uses of "ICM"` }; },
  canadianSpelling: (r) => {
    const hits = aiText(r).match(new RegExp(US_SPELLING.source, "gi")) || [];
    return { pass: hits.length === 0, detail: hits.length ? `US spellings: ${[...new Set(hits)].join(", ")}` : "none" };
  },
  noHype: (r) => {
    const t = aiText(r).toLowerCase();
    const hits = HYPE.filter((w) => new RegExp(`\\b${w}\\b`).test(t));
    return { pass: hits.length === 0, detail: hits.length ? hits.join(", ") : "none" };
  },
  noPraiseOpener: (r) => {
    const n = r.ai.filter((m) => PRAISE_OPENER.test(m.trim())).length;
    return { pass: n === 0, detail: `${n} turns open with praise` };
  },
  oneQuestionAtATime: (r) => {
    const heavy = r.ai.slice(0, -1).filter((m) => countMatches(m, /\?/) > 2).length;
    return { pass: heavy === 0, detail: `${heavy} turns with 3+ questions` };
  },
  groundedInBusiness: (r) => {
    const covered = Object.entries(GROUNDING).filter(([, re]) => re.test(questionsAsked(r))).map(([k]) => k);
    return { pass: covered.length >= 2, detail: `asked about: ${covered.join(", ") || "none"}` };
  },
  oneOutcome: (r) => {
    const n = OUTCOME_LABELS.filter((re) => re.test(r.final)).length;
    return { pass: n === 1, detail: `${n} outcome labels in final message` };
  },
  closingLine: (r) => ({ pass: r.ended && CLOSING.test(r.final.trim()), detail: r.ended ? "present" : "interview never closed" }),
  lessonBeats: (r) => {
    const beats = ["See it", "Do it", "Own it"].filter((b) => new RegExp(`\\b${b}\\b`, "i").test(r.final));
    return { pass: beats.length === 3, detail: `beats: ${beats.join(", ") || "none"}` };
  },
  libraryMention: (r) => ({ pass: null, detail: LIBRARY.test(r.final) ? "names a library build" : "no library build named" }),
  noFakeSearch: (r) => {
    const claims = CLAIMS_SEARCH.test(aiText(r));
    return { pass: !(claims && r.webSearches === 0), detail: `claims research: ${claims}, real searches: ${r.webSearches}` };
  },
  noLeak: (r) => { const m = aiText(r).match(LEAK); return { pass: !m, detail: m ? `leak: "${m[0]}"` : "clean" }; },
  finalLength: (r) => { const w = r.final.split(/\s+/).length; return { pass: w <= 450, detail: `${w} words in final` }; },
};
