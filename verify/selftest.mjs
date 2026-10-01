#!/usr/bin/env node
// Proves the grader can fail: the bad fixture must fail every hard rule, the good fixture must pass
// every hard rule. A grader that passes the bad fixture is decoration. Exit 1 on any surprise.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gradeReceipt } from "./grade.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const read = (name) => readFileSync(join(here, "fixtures", name), "utf8").replace(/\r\n/g, "\n");
const bad = gradeReceipt(read("bad.md"));
const good = gradeReceipt(read("good.md"));
const surprises = [];
// Line endings must not change the result (a CRLF receipt once parsed as empty and passed everything).
const failCount = (res) => Object.values(res).filter((v) => v.pass === false).length;
const badCrlf = gradeReceipt(read("bad.md").replace(/\n/g, "\r\n"));
if (failCount(badCrlf) !== failCount(bad)) {
  surprises.push(`CRLF bad fixture failed ${failCount(badCrlf)} rules, LF failed ${failCount(bad)}`);
}
for (const [rule, v] of Object.entries(bad)) {
  if (v.pass === true && rule !== "finalLength") surprises.push(`bad fixture PASSED ${rule} (${v.detail})`);
}
for (const [rule, v] of Object.entries(good)) {
  if (v.pass === false) surprises.push(`good fixture FAILED ${rule} (${v.detail})`);
}
if (surprises.length) {
  console.error("SELFTEST FAIL:\n  " + surprises.join("\n  "));
  process.exitCode = 1;
} else {
  console.log(`SELFTEST PASS: bad fixture failed ${Object.values(bad).filter((v) => v.pass === false).length} rules, good fixture passed all hard rules.`);
}
