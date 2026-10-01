#!/usr/bin/env node
// Proves the grader can fail: the bad fixture must fail every hard rule, the good fixture must pass
// every hard rule. A grader that passes the bad fixture is decoration. Exit 1 on any surprise.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gradeReceipt } from "./grade.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const grade = (name) => gradeReceipt(readFileSync(join(here, "fixtures", name), "utf8"));
const bad = grade("bad.md");
const good = grade("good.md");
const surprises = [];
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
