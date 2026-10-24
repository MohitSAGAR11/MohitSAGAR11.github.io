// Pure helpers for scripts/sync-github.ts. Kept free of path aliases and
// non-erasable TypeScript so Node can run the sync script directly.
import type { Contribution } from "../content/site.ts";

export type PrState = "merged" | "review" | "closed";

export interface SearchItem {
  readonly number: number;
  readonly title: string;
  readonly html_url: string;
  readonly repository_url: string;
  readonly state: "open" | "closed";
  readonly created_at: string;
  readonly closed_at: string | null;
  readonly pull_request?: { readonly merged_at: string | null };
}

export interface SearchResult {
  readonly total: number;
  readonly items: readonly SearchItem[];
}

const GITHUB_URL = /^https:\/\/github\.com\//;
const API_REPO_URL = /^https:\/\/api\.github\.com\/repos\/([^/]+)\/([^/]+)$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSearchItem(value: unknown): value is SearchItem {
  if (!isRecord(value)) return false;
  const merged = value.pull_request;
  return (
    typeof value.number === "number" &&
    typeof value.title === "string" &&
    typeof value.html_url === "string" &&
    GITHUB_URL.test(value.html_url) &&
    typeof value.repository_url === "string" &&
    API_REPO_URL.test(value.repository_url) &&
    (value.state === "open" || value.state === "closed") &&
    typeof value.created_at === "string" &&
    (value.closed_at === null || typeof value.closed_at === "string") &&
    (merged === undefined || (isRecord(merged) && (merged.merged_at === null || typeof merged.merged_at === "string")))
  );
}

// Validates a GitHub search API body. Anything unexpected (a rate-limit error,
// a schema change) throws, so a bad sync never overwrites good data.
export function parseSearch(body: unknown): SearchResult {
  if (!isRecord(body) || typeof body.total_count !== "number" || !Array.isArray(body.items)) {
    throw new Error(`Unexpected search response: ${JSON.stringify(body).slice(0, 200)}`);
  }
  for (const item of body.items) {
    if (!isSearchItem(item)) throw new Error(`Unexpected search item: ${JSON.stringify(item).slice(0, 200)}`);
  }
  return { total: body.total_count, items: body.items as SearchItem[] };
}

export function repoOf(item: SearchItem): string {
  const match = API_REPO_URL.exec(item.repository_url);
  return match ? `${match[1]}/${match[2]}` : item.repository_url;
}

export function prStatusOf(item: SearchItem): PrState {
  if (item.pull_request?.merged_at) return "merged";
  return item.state === "open" ? "review" : "closed";
}

interface SelectOptions {
  readonly owners: readonly string[]; // only PRs to repos under these owners
  readonly exclude: readonly string[]; // PR URLs shown elsewhere (bug trails)
  readonly limit: number;
}

// Merged PRs newest first, then open ones newest first. Closed-unmerged PRs are dropped.
export function selectContributions(items: readonly SearchItem[], options: SelectOptions): Contribution[] {
  const rows = items.flatMap((item): Contribution[] => {
    const status = prStatusOf(item);
    const repo = repoOf(item);
    const owner = repo.split("/")[0] ?? "";
    if (status === "closed" || !options.owners.includes(owner) || options.exclude.includes(item.html_url)) return [];
    const date = (status === "merged" ? item.pull_request?.merged_at : item.created_at) ?? item.created_at;
    return [{ repo, number: item.number, title: item.title, date: date.slice(0, 10), status, href: item.html_url }];
  });

  const byDateDesc = (a: Contribution, b: Contribution) => b.date.localeCompare(a.date) || b.number - a.number;
  const merged = rows.filter((row) => row.status === "merged").sort(byDateDesc);
  const open = rows.filter((row) => row.status === "review").sort(byDateDesc);
  return [...merged, ...open].slice(0, options.limit);
}
