# Mohit Sagar — portfolio

A single-page portfolio built around one line: _I find the bug, file it, fix it._
The design direction and motion rules are in [DESIGN.md](DESIGN.md).

## Stack

- Next.js 16 (App Router, static export to `out/`), React 19, TypeScript, Tailwind CSS 4
- Hosted on GitHub Pages at https://mohitsagar11.github.io
- GSAP 3 + ScrollTrigger for animation, Lenis for smooth scrolling
- Vitest for unit tests, Playwright for end-to-end tests

## Commands

```bash
npm run dev        # local dev server on http://localhost:3000
npm run build      # static site in out/
npm start          # serve out/ locally on http://localhost:3000
npm run sync       # refresh src/content/github.json (set GITHUB_TOKEN)
npm run typecheck  # generate Next route types, then tsc
npm run lint
npm test           # unit tests
npm run e2e        # builds, serves out/ on :3200 and runs Playwright (uses installed Chrome)
```

## Deploy and weekly sync

`.github/workflows/deploy.yml` builds the static site and publishes it to GitHub Pages:

- **On every push to `main`:** test, build, deploy.
- **Every Monday at 08:00 IST, or via "Run workflow" in the Actions tab:** first run
  `scripts/sync-github.mts`, which refreshes `src/content/github.json`: merged PRs, issues filed,
  public repos, the Open Library and hyperjump PR list, and each bug trail's fix status. Then test and
  build, commit the new data, and deploy.

The sync validates every API response. On any error it exits before writing, the run fails, and the
live site stays on last week's data. Syncing and deploying share one workflow because a commit pushed
with `GITHUB_TOKEN` does not trigger other workflows. The sync date changes on every run, so there is
a commit each week, which keeps the repository active. GitHub pauses scheduled workflows after 60 days
without activity.

The bug-trail stories and project write-ups stay hand-written in `src/content/site.ts`.

**Custom domain, optional:** add a `public/CNAME` file containing the domain, point its DNS at GitHub
Pages, and change `siteUrl` in `src/content/site.ts`.

## Project videos

PRism and CodeFang have 20-second demo clips made with the
[`/brag`](https://github.com/latent-spaces/brag) skill (`/brag-slim`). The 1080p masters, storyboards,
share copy and the scripts that build them (scene HTML rendered frame by frame with Playwright,
soundtrack synthesised in Python, encoded with ffmpeg) live in `brag-output/`, which is gitignored.
The site uses 720p copies in `public/videos/`. To add one, put `<slug>.mp4` and `<slug>.jpg` there and
set `video` on the project in `src/content/site.ts`, including a transcript of the on-screen text.

## Editing content

The portrait in `public/` is generated from `assets/mohit.png`:
`python scripts/grade_portrait.py assets/mohit.png public/mohit-portrait.jpg public/mohit-color.jpg`

Copy, projects, bug trails, stack and links live in `src/content/site.ts`. Live GitHub numbers
come from `src/content/github.json`; don't edit that file by hand, the weekly sync overwrites it.
Leave any of `linkedin`, `resume`, `photo` or `photoHover` as `""` to hide it.

## Motion and accessibility

- `prefers-reduced-motion`: no smooth scroll, preloader, starfield or scroll-scrubbing; everything is
  shown in its final state.
- Without JavaScript the page is fully readable; reveal targets are only hidden once the inline
  boot script in `layout.tsx` opts the page into motion.
- The preloader plays once per browser session and can be skipped with any key or click.
