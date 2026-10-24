import { describe, expect, test } from "vitest";
import { formatDate, publicUrl, repoName, splitWords, statusLabel } from "./text";

describe("publicUrl", () => {
  test("adds the leading slash a public/ file needs", () => {
    expect(publicUrl("mohit.png")).toBe("/mohit.png");
  });

  test("leaves a root-relative path alone", () => {
    expect(publicUrl("/resume.pdf")).toBe("/resume.pdf");
  });

  test("leaves absolute URLs alone", () => {
    expect(publicUrl("https://example.com/cv.pdf")).toBe("https://example.com/cv.pdf");
  });

  test("keeps empty as empty so the feature stays off", () => {
    expect(publicUrl("")).toBe("");
    expect(publicUrl("   ")).toBe("");
  });

  test("strips a mistaken public/ prefix", () => {
    expect(publicUrl("public/mohit.png")).toBe("/mohit.png");
  });
});

describe("splitWords", () => {
  test("splits on any run of whitespace and drops empties", () => {
    expect(splitWords("  find   the\nbug  ")).toEqual(["find", "the", "bug"]);
  });

  test("returns an empty array for blank input", () => {
    expect(splitWords("   ")).toEqual([]);
  });

  test("keeps punctuation attached to its word", () => {
    expect(splitWords("file it, fix it.")).toEqual(["file", "it,", "fix", "it."]);
  });
});

describe("formatDate", () => {
  test("formats an ISO date as short month, day and year", () => {
    expect(formatDate("2026-10-21")).toBe("Oct 21, 2026");
  });

  test("does not shift the day across time zones", () => {
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
  });

  test("throws on a malformed date instead of rendering 'Invalid Date'", () => {
    expect(() => formatDate("21/10/2026")).toThrow(/Invalid ISO date/);
  });
});

describe("repoName", () => {
  test("drops the owner from owner/repo", () => {
    expect(repoName("internetarchive/openlibrary")).toBe("openlibrary");
  });

  test("returns the input when there is no owner", () => {
    expect(repoName("openlibrary")).toBe("openlibrary");
  });
});

describe("statusLabel", () => {
  test("labels each PR status", () => {
    expect(statusLabel("merged")).toBe("Merged");
    expect(statusLabel("review")).toBe("In review");
  });
});
