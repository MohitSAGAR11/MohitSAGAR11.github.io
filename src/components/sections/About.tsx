import Image from "next/image";
import { about, photoHoverUrl, photoUrl, profile } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { ScrubText } from "@/components/motion/ScrubText";
import { SectionLabel } from "./SectionLabel";

export function About() {
  return (
    <section aria-labelledby="about-heading" className="mx-auto max-w-7xl px-5 py-32 sm:px-8 sm:py-44">
      <SectionLabel index="01">This is me</SectionLabel>
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <div>
          <h2 id="about-heading" className="text-3xl font-medium sm:text-4xl">
            Hi, I&apos;m {profile.name.split(" ")[0]}.
          </h2>
          <p className="mt-4 text-muted">
            CS at {profile.school}, class of {profile.classOf}. {profile.location}.
          </p>
          {photoUrl && (
            <Reveal className="mt-10 max-w-xs">
              <figure data-reveal-item className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                <Image
                  src={photoUrl}
                  alt={profile.photoAlt}
                  width={800}
                  height={1000}
                  sizes="(min-width: 1024px) 20rem, 80vw"
                  className="aspect-[4/5] h-auto w-full object-cover"
                />
                {photoHoverUrl && (
                  // Same centred 4:5 crop as the graded portrait, so the cross-fade lines up.
                  <Image
                    src={photoHoverUrl}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="(min-width: 1024px) 20rem, 80vw"
                    className="object-cover opacity-0 transition-opacity duration-500 ease-[var(--ease-out-strong)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
                  />
                )}
              </figure>
            </Reveal>
          )}
        </div>
        <ScrubText text={about} className="text-2xl leading-snug font-medium text-bone sm:text-4xl sm:leading-tight" />
      </div>
    </section>
  );
}
