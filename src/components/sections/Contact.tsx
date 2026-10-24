import { githubSyncedAt, profile, socials } from "@/content/site";
import { formatDate } from "@/lib/text";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SectionLabel } from "./SectionLabel";

const HEADING = [
  { text: "Got a bug", tone: "bright" },
  { text: "for me?", tone: "accent" },
] as const;

export function Contact() {
  // Until a public email is set in content/site.ts, GitHub is the contact point.
  const primary = profile.email
    ? { href: `mailto:${profile.email}`, label: profile.email, isExternal: false }
    : { href: profile.github, label: "github.com/MohitSAGAR11", isExternal: true };

  return (
    <footer id="contact" aria-labelledby="contact-heading" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 pt-32 pb-12 sm:px-8 sm:pt-44">
        <SectionLabel index="05">Contact</SectionLabel>
        <SplitHeading id="contact-heading" lines={HEADING} className="text-[clamp(4rem,15vw,13rem)]" />

        <p className="mt-10 max-w-lg text-lg text-muted">
          I&apos;m looking for backend and AI internships, and I&apos;m always happy to talk about a gnarly issue in a
          project I contribute to.
        </p>

        <div className="mt-12">
          <Magnetic strength={0.15}>
            <a
              href={primary.href}
              {...(primary.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group inline-flex items-center gap-4 font-mono text-[clamp(1.1rem,3.4vw,2.2rem)] text-bone"
            >
              <span className="underline decoration-dim decoration-2 underline-offset-[10px] transition-colors duration-200 group-hover:decoration-amber">
                {primary.label}
              </span>
              <span aria-hidden="true" className="text-amber transition-transform duration-300 ease-[var(--ease-out-strong)] group-hover:translate-x-1 group-hover:-translate-y-1">
                ↗
              </span>
            </a>
          </Magnetic>
        </div>

        <div className="mt-32 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 font-mono text-xs text-muted">
            <p>Designed &amp; built by {profile.name}.</p>
            <p>GitHub data synced {formatDate(githubSyncedAt)}.</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-[0.1em]">
            {socials.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted transition-colors duration-200 hover:text-amber">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#top" className="text-muted transition-colors duration-200 hover:text-amber">
                Back to top <span aria-hidden="true">↑</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
