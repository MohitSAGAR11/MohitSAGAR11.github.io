// Refreshes src/content/github.json from the GitHub API.
//
//   node scripts/sync-github.mts         (Node 24 runs TypeScript directly)
//
// Set GITHUB_TOKEN for higher rate limits; the weekly workflow does. Every
// response is validated, and any failure exits non-zero before the file is
// written, so the site keeps the last good snapshot.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseSearch, prStatusOf, selectContributions, type PrState } from "../src/lib/github.ts";

const USER = "MohitSAGAR11";
const OWNERS = ["internetarchive", "hyperjump-io"]; // whose PRs appear in the list
const MAX_CONTRIBUTIONS = 30;
const OUTPUT = fileURLToPath(new URL("../src/content/github.json", import.meta.url));

const token = process.env.GITHUB_TOKEN;

async function api(path: string): Promise<unknown> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": `${USER}-portfolio-sync`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${response.status} for ${path}: ${(await response.text()).slice(0, 200)}`);
  }
  return response.json();
}

const search = (query: string) => api(`/search/issues?q=${encodeURIComponent(query)}&per_page=100`).then(parseSearch);

async function main(): Promise<void> {
  const external = `author:${USER} -user:${USER}`;
  const [prs, merged, issues, user] = await Promise.all([
    search(`${external} type:pr`),
    search(`${external} type:pr is:merged`),
    search(`${external} type:issue`),
    api(`/users/${USER}`),
  ]);

  if (typeof user !== "object" || user === null || typeof (user as { public_repos?: unknown }).public_repos !== "number") {
    throw new Error("Unexpected /users response");
  }
  if (prs.total > prs.items.length) {
    console.warn(`Only the first ${prs.items.length} of ${prs.total} PRs were read; the list may be incomplete.`);
  }

  const prStatus: Record<string, PrState> = {};
  for (const item of prs.items) prStatus[item.html_url] = prStatusOf(item);

  const snapshot = {
    syncedAt: new Date().toISOString().slice(0, 10),
    stats: {
      mergedPrs: merged.total,
      issuesFiled: issues.total,
      publicRepos: (user as { public_repos: number }).public_repos,
    },
    contributions: selectContributions(prs.items, { owners: OWNERS, exclude: [], limit: MAX_CONTRIBUTIONS }),
    prStatus,
  };

  writeFileSync(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.info(
    `Synced: ${snapshot.stats.mergedPrs} merged PRs, ${snapshot.stats.issuesFiled} issues, ` +
      `${snapshot.stats.publicRepos} repos, ${snapshot.contributions.length} listed PRs.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
