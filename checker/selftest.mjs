#!/usr/bin/env node
// Proves the checker can fail: fixtures/bad-package plants five defects and each must be reported.
// A checker that passes the bad package is decoration. Exit 1 on any defect it misses.

import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const run = spawnSync(process.execPath, [join(here, "check.mjs"), "--root", join(here, "fixtures", "bad-package")],
  { encoding: "utf8" });
const out = run.stderr + run.stdout;
const planted = ["DRIFTED", "Load-bearing rule 7a", "em/en dashes", '"ICM"', "Leak term found in README.md"];
const missed = planted.filter((p) => !out.includes(p));
if (run.status === 0 || missed.length) {
  console.error(`SELFTEST FAIL: checker exit ${run.status}; missed: ${missed.join(", ") || "none"}`);
  process.exitCode = 1;
} else {
  console.log(`SELFTEST PASS: checker failed the bad package and reported all ${planted.length} planted defects.`);
}
