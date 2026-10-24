import { profile, resumeUrl, stats } from "@/content/site";
import { CountUp } from "@/components/motion/CountUp";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Starfield } from "@/components/Starfield";
import { HeroDetails } from "./HeroDetails";

const HEADLINE = [
  { text: "I find the bug,", tone: "bright" },
  { text: "file it,", tone: "dim" },
  { text: "fix it.", tone: "accent" },
] as const;

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-heading" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <Starfield />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 px-5 pt-28 pb-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <div className="max-w-4xl">
          <p className="label mb-6">
            {profile.name} — {profile.role}
          </p>
          <SplitHeading
            as="h1"
            id="hero-heading"
            trigger="intro"
            lines={HEADLINE}
            className="text-[clamp(3.4rem,9vw,8.5rem)]"
          />

          <HeroDetails>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">{profile.intro}</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Magnetic>
                <a
                  href="#open-source"
                  className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.1em] text-canvas transition-transform duration-150 active:scale-[0.97]"
                >
                  See the trail <span aria-hidden="true">↓</span>
                </a>
              </Magnetic>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-[0.1em] text-bone underline decoration-dim underline-offset-[6px] transition-colors duration-200 hover:decoration-amber"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-[0.1em] text-bone underline decoration-dim underline-offset-[6px] transition-colors duration-200 hover:decoration-amber"
                >
                  Resume <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (PDF)</span>
                </a>
              )}
            </div>
            <p className="mt-8 flex items-center gap-3 text-sm text-muted">
              <span className="live-dot inline-block size-2 rounded-full bg-amber" aria-hidden="true" />
              {profile.availability}
            </p>
          </HeroDetails>
        </div>

        <HeroDetails as="dl" className="grid grid-cols-3 gap-6 lg:grid-cols-1 lg:gap-8 lg:text-right">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end gap-1">
              <dt className="text-xs leading-snug text-muted sm:text-sm">{stat.label}</dt>
              <dd className="display text-5xl text-amber sm:text-6xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </HeroDetails>
      </div>

      <p className="label pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block" aria-hidden="true">
        Scroll
      </p>
    </section>
  );
}
