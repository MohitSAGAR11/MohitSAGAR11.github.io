import { describe, expect, test } from "vitest";
import { parseSearch, prStatusOf, selectContributions, type SearchItem } from "./github.ts";

function pr(overrides: Partial<SearchItem> & { number: number }): SearchItem {
  return {
    title: `PR ${overrides.number}`,
    html_url: `https://github.com/internetarchive/openlibrary/pull/${overrides.number}`,
    repository_url: "https://api.github.com/repos/internetarchive/openlibrary",
    state: "open",
    created_at: "2026-10-01T00:00:00Z",
    closed_at: null,
    pull_request: { merged_at: null },
    ...overrides,
  };
}

describe("parseSearch", () => {
  test("returns the total and items of a valid search response", () => {
    const body = { total_count: 1, items: [pr({ number: 1 })] };
    expect(parseSearch(body)).toEqual({ total: 1, items: [pr({ number: 1 })] });
  });

  test("rejects a response without items, e.g. a rate-limit error body", () => {
    expect(() => parseSearch({ message: "API rate limit exceeded" })).toThrow(/Unexpected search response/);
  });

  test("rejects items missing required fields", () => {
    expect(() => parseSearch({ total_count: 1, items: [{ number: 1 }] })).toThrow(/Unexpected search item/);
  });

  test("rejects a URL that is not on github.com", () => {
    const bad = pr({ number: 2, html_url: "javascript:alert(1)" });
    expect(() => parseSearch({ total_count: 1, items: [bad] })).toThrow(/Unexpected search item/);
  });
});

describe("prStatusOf", () => {
  test("merged when merged_at is set", () => {
    expect(prStatusOf(pr({ number: 1, state: "closed", pull_request: { merged_at: "2026-10-02T00:00:00Z" } }))).toBe("merged");
  });

  test("review while open", () => {
    expect(prStatusOf(pr({ number: 1 }))).toBe("review");
  });

  test("closed when closed without merging", () => {
    expect(prStatusOf(pr({ number: 1, state: "closed", closed_at: "2026-10-02T00:00:00Z" }))).toBe("closed");
  });
});

describe("selectContributions", () => {
  const merged = (number: number, date: string) =>
    pr({ number, state: "closed", closed_at: date, pull_request: { merged_at: date } });

  test("lists merged PRs newest first, then open PRs newest first", () => {
    const items = [
      pr({ number: 10, created_at: "2026-10-05T00:00:00Z" }),
      merged(11, "2026-10-01T00:00:00Z"),
      merged(12, "2026-10-09T00:00:00Z"),
      pr({ number: 13, created_at: "2026-10-08T00:00:00Z" }),
    ];
    const result = selectContributions(items, { owners: ["internetarchive"], exclude: [], limit: 10 });
    expect(result.map((c) => c.number)).toEqual([12, 11, 13, 10]);
    expect(result[0]).toMatchObject({ repo: "internetarchive/openlibrary", status: "merged", date: "2026-10-09" });
  });

  test("keeps only allowed owners, drops excluded URLs and closed-unmerged PRs", () => {
    const other = pr({ number: 20, repository_url: "https://api.github.com/repos/someone/else", html_url: "https://github.com/someone/else/pull/20" });
    const closed = pr({ number: 21, state: "closed", closed_at: "2026-10-02T00:00:00Z" });
    const excluded = pr({ number: 22 });
    const kept = pr({ number: 23 });
    const result = selectContributions([other, closed, excluded, kept], {
      owners: ["internetarchive"],
      exclude: [excluded.html_url],
      limit: 10,
    });
    expect(result.map((c) => c.number)).toEqual([23]);
  });

  test("caps the list at the limit", () => {
    const items = [1, 2, 3].map((n) => pr({ number: n }));
    expect(selectContributions(items, { owners: ["internetarchive"], exclude: [], limit: 2 })).toHaveLength(2);
  });
});
