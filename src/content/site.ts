// All copy and data for the site lives here. Numbers and links were pulled from
// GitHub on 2026-10-24; refresh them when they go stale.

import { publicUrl } from "@/lib/text";
import githubSnapshot from "./github.json";

export type PrStatus = "merged" | "review";

export interface Link {
  readonly label: string;
  readonly href: string;
}

export interface BugTrail {
  readonly repo: string;
  readonly bug: string;
  readonly issue: { readonly number: number; readonly href: string };
  readonly fix: { readonly number: number; readonly href: string; readonly status: PrStatus };
}

export interface Contribution {
  readonly repo: string;
  readonly number: number;
  readonly title: string;
  readonly date: string; // ISO date, merged or opened
  readonly status: PrStatus;
  readonly href: string;
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly repo: string;
  readonly live?: string;
  readonly preview: readonly string[]; // how it works, as terminal lines; never invented metrics
  readonly video?: ProjectVideo;
}

export interface ProjectVideo {
  readonly src: string; // file in public/
  readonly poster: string;
  readonly seconds: number;
  // The clips have no narration, so screen readers get the on-screen text instead.
  readonly transcript: string;
}

export interface StackGroup {
  readonly label: string;
  readonly items: readonly string[];
}

const GITHUB = "https://github.com/MohitSAGAR11";

export const profile = {
  name: "Mohit Sagar",
  role: "Backend & AI Engineer",
  location: "Bangalore, India",
  school: "Scaler School of Technology",
  classOf: "'28",
  availability: "Open to backend & AI internships",
  intro:
    "I build backend systems and AI developer tools, and I contribute to Open Library and the Hyperjump JSON Schema validator. I care about the unglamorous parts: untrusted input, failure paths, and tests that fail before the fix.",
  github: GITHUB,
  email: "mohitsagar378@gmail.com",
  // Leave any of these "" to hide that link.
  linkedin: "https://www.linkedin.com/in/mohit-sagar-066834328/",
  // Files go in the project's public/ folder; reference them from the site root.
  resume: "Mohit_Sagar_Resume.pdf", // e.g. "/resume.pdf" → Resume button in the hero and a footer link
  // Portrait in the About section. Both files are generated from the original:
  //   python scripts/grade_portrait.py assets/mohit.png public/mohit-portrait.jpg public/mohit-color.jpg
  photo: "mohit-portrait.jpg",
  photoHover: "mohit-color.jpg", // colour version, revealed on hover (mouse only); "" to disable
  siteUrl: "https://mohitsagar11.github.io",
  photoAlt: "Mohit Sagar",
} as const;

// Normalised so "mohit.png", "/mohit.png" and "public/mohit.png" all work.
export const resumeUrl = publicUrl(profile.resume);
export const photoUrl = publicUrl(profile.photo);
export const photoHoverUrl = publicUrl(profile.photoHover);

// Live numbers come from github.json, refreshed weekly by scripts/sync-github.mts.
interface GithubSnapshot {
  readonly syncedAt: string;
  readonly stats: { readonly mergedPrs: number; readonly issuesFiled: number; readonly publicRepos: number };
  readonly contributions: readonly Contribution[];
  readonly prStatus: Readonly<Record<string, "merged" | "review" | "closed">>;
}

// Written only by the sync script, which validates every API response first.
const github = githubSnapshot as GithubSnapshot;

export const githubSyncedAt = github.syncedAt;

export const stats = [
  { value: github.stats.mergedPrs, suffix: "", label: "PRs merged upstream" },
  { value: github.stats.issuesFiled, suffix: "", label: "Bugs filed upstream" },
  { value: github.stats.publicRepos, suffix: "", label: "Public repositories" },
] as const;

// A trail's fix status follows GitHub; the curated value is the fallback.
function liveStatus(href: string, fallback: PrStatus): PrStatus {
  const status = github.prStatus[href];
  return status === "merged" || status === "review" ? status : fallback;
}

export const about =
  "I read the failing test before I read the docs. Most of what I know about distributed caches, rate limiters and vector search came from building them myself, watching them break and working out why. In open source I do the same thing on code I didn't write: reproduce the bug, write it up so a maintainer can act on it, then send the smallest fix that closes it.";

// Curated stories; only each fix's status updates from GitHub.
const curatedTrails: readonly BugTrail[] = [
  {
    repo: "hyperjump-io/json-schema",
    bug: "An invalid schema was only rejected the first time it was validated.",
    issue: { number: 133, href: "https://github.com/hyperjump-io/json-schema/issues/133" },
    fix: { number: 134, href: "https://github.com/hyperjump-io/json-schema/pull/134", status: "merged" },
  },
  {
    repo: "hyperjump-io/uri",
    bug: "Dot-segment removal was wrong for paths that don't start with a slash.",
    issue: { number: 11, href: "https://github.com/hyperjump-io/uri/issues/11" },
    fix: { number: 12, href: "https://github.com/hyperjump-io/uri/pull/12", status: "review" },
  },
  {
    repo: "hyperjump-io/json-schema-errors",
    bug: "contentMediaType, contentEncoding and contentSchema threw “unsupported keyword”.",
    issue: { number: 294, href: "https://github.com/hyperjump-io/json-schema-errors/issues/294" },
    fix: { number: 296, href: "https://github.com/hyperjump-io/json-schema-errors/pull/296", status: "review" },
  },
];

export const bugTrails: readonly BugTrail[] = curatedTrails.map((trail) => ({
  ...trail,
  fix: { ...trail.fix, status: liveStatus(trail.fix.href, trail.fix.status) },
}));

const MAX_LISTED_PRS = 10;
const trailFixes = new Set(curatedTrails.map((trail) => trail.fix.href));

// Open Library and hyperjump PRs from the weekly sync, minus the ones already
// told as bug trails. Merged first, newest first.
export const contributions: readonly Contribution[] = github.contributions
  .filter((pr) => !trailFixes.has(pr.href))
  .slice(0, MAX_LISTED_PRS);

export const projects: readonly Project[] = [
  {
    slug: "prism",
    title: "PRism",
    summary:
      "A precision-first AI code reviewer, run as a GitHub Action or CLI. One model proposes defects, a second tries to refute each, and only survivors are posted inline. PR code is treated as untrusted and never executed. In a field test all 3 of its comments landed on the right line, and one flagged a real bug nobody had planted.",
    tags: ["TypeScript", "GitHub Actions", "OpenRouter", "Octokit", "Zod", "Vitest"],
    repo: `${GITHUB}/PRism`,
    preview: ["on: pull_request", "propose → refute → gate", "PR head code never executed", "field test: 3/3 on the right line", "✓ 87 Vitest tests"],
    // Made with /brag; masters and storyboard in brag-output/prism (not deployed).
    video: {
      src: "/videos/prism.mp4",
      poster: "/videos/prism.jpg",
      seconds: 20,
      transcript:
        "A pull request fills with twenty vague AI comments: 20 AI comments, 4 real. PRism: the AI reviewer that tries to prove itself wrong. Pass 1 finds, pass 2 tries to refute: of five findings, one is refuted, one falls below the confidence bar, three are posted. 3/3 comments on the exact line, including an off-by-one on line 14 with a suggested fix. An empty review is a correct review. GitHub Action and CLI, github.com/MohitSAGAR11/PRism.",
    },
  },
  {
    slug: "codefang",
    title: "CodeFang",
    summary:
      "A terminal coding agent that can't touch the disk without consent. Edits are staged in memory, and you approve them from a unified diff in the terminal or over Telegram. Every path is jailed to the workspace, with .env, .git and node_modules blocked.",
    tags: ["TypeScript", "Bun", "Vercel AI SDK", "Telegraf", "Zod"],
    repo: `${GITHUB}/CodeFang`,
    preview: ["$ codefang", "edits staged in memory, not on disk", "review the unified diff", "? approve changes (y/N)", "✓ 81 Bun tests"],
    // Made with /brag; masters and storyboard in brag-output/codefang (not deployed).
    video: {
      src: "/videos/codefang.mp4",
      poster: "/videos/codefang.jpg",
      seconds: 20,
      transcript:
        "The agent reads, edits and queues a command: 3 changes staged, 0 written. CodeFang, agentic coding in your terminal: nothing touches your disk until you say so. Read the diff, then it lands: the change is reviewed one by one and applied. Approve from your phone with Telegram's Accept All. Your secrets stay invisible: reading .env is excluded by policy and paths outside the workspace are refused. 81 tests, nothing written without a yes. github.com/MohitSAGAR11/CodeFang.",
    },
  },
  {
    slug: "typeahead",
    title: "Search Typeahead",
    summary:
      "A distributed typeahead with a consistent-hashing Redis cache, Kafka-backed async writes and split services, all running from one Docker Compose file.",
    tags: ["TypeScript", "Redis", "Kafka", "PostgreSQL", "Docker"],
    repo: `${GITHUB}/typeahead-system`,
    preview: ["GET /suggest?q=…", "hash ring → cache node", "Redis hit, else PostgreSQL", "search event → Kafka → batch writer", "✓ docker compose up"],
    // Made with /brag; masters and storyboard in brag-output/typeahead (not deployed).
    video: {
      src: "/videos/typeahead.mp4",
      poster: "/videos/typeahead.jpg",
      seconds: 20,
      transcript:
        "Typing t, th, the: the suggestions re-rank on every keystroke with real counts from the dataset. Every keystroke, answered. TypeAhead, distributed: one search box, Redis, Kafka and Postgres behind it. One ring, three cache nodes: the prefix the hashes onto a ring of 150 virtual nodes per Redis node and lands on Redis-B. Searches queue, writes batch: searches go to the search-events Kafka topic and the batch writer turns 14 searches into one multi-row upsert. The whole stack, one command: docker compose up starts all ten services. github.com/MohitSAGAR11/typeahead-system.",
    },
  },
  {
    slug: "notebooklm",
    title: "Notebook LM",
    summary: "A full RAG pipeline: upload documents, chunk and embed them, then chat with answers grounded in your own files.",
    tags: ["JavaScript", "RAG", "Embeddings"],
    repo: `${GITHUB}/Notebook-LM`,
    live: "https://rag-notebook-lm.netlify.app/",
    preview: ["upload your documents", "chunk → embed → store", "retrieve by similarity", "answer from your own files", "✓ live on Netlify"],
    // Made with /brag; masters and storyboard in brag-output/notebooklm (not deployed).
    video: {
      src: "/videos/notebooklm.mp4",
      poster: "/videos/notebooklm.jpg",
      seconds: 20,
      transcript:
        "A README is uploaded to the Notebook-LLM workspace and split into 6 chunks. Chat with your documents. Notebook-LLM, a retrieval-augmented generation application: upload a PDF or TXT, get grounded answers. Three searches, one reranked top 5: the question is expanded into three variants, candidates are merged and an LLM scores them 0 to 10, keeping the top 5. Answers from your file: the chat answers that documents are split into 800-character chunks with a 150-character overlap. Temperature 0.1, no guessing. github.com/MohitSAGAR11/Notebook-LM.",
    },
  },
];

// Mirrors "Technical Skills" on the resume; keep the two in sync.
export const stack: readonly StackGroup[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { label: "Working knowledge", items: ["Go", "Java"] },
  { label: "Backend", items: ["Node.js", "Bun", "Express", "REST APIs", "Server-Sent Events", "Vercel AI SDK"] },
  { label: "Databases", items: ["PostgreSQL", "Firestore", "Pinecone"] },
  { label: "AI & data", items: ["LLM tool-calling agents", "OpenRouter model fallback", "Zod structured output", "RAG"] },
  { label: "Cloud & tools", items: ["GitHub Actions", "Docker", "Firebase", "Git", "Vitest", "Octokit"] },
];

export const marquee = ["TypeScript", "Python", "Node.js", "Bun", "PostgreSQL", "GitHub Actions", "Docker", "RAG", "LLM agents", "Open source"];

// Mirrors "Experience" and "Education" on the resume.
export const journey = [
  {
    when: "Oct 2026 — now",
    what: "Open source contributor, Hyperjump JSON Schema",
    detail: "Found, filed and fixed a validation bug in a validator with ~366K weekly npm downloads, with regression tests that fail on main.",
  },
  {
    when: "Sep 2026 — now",
    what: "Open source contributor, Open Library (Internet Archive)",
    detail: "Rebuilt the author-merge confirmation for librarians; fixes across author matching, MARC import and tests.",
  },
  {
    when: "Aug 2024 — 2028",
    what: "Computer Science, Scaler School of Technology",
    detail: "Undergraduate program, Bengaluru.",
  },
  {
    when: "Aug 2024 — 2027",
    what: "B.Sc., BITS Pilani (online)",
    detail: "Bachelor of Science, studied alongside Scaler.",
  },
] as const;

export const nav = [
  { id: "top", label: "Index" },
  { id: "open-source", label: "Open source" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export const socials: readonly Link[] = [
  { label: "GitHub", href: GITHUB },
  ...(profile.linkedin ? [{ label: "LinkedIn", href: profile.linkedin }] : []),
  ...(profile.email ? [{ label: "Email", href: `mailto:${profile.email}` }] : []),
  ...(resumeUrl ? [{ label: "Resume", href: resumeUrl }] : []),
];
