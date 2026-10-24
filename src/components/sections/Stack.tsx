import { journey, stack } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SectionLabel } from "./SectionLabel";

const HEADING = [
  { text: "Stack &", tone: "bright" },
  { text: "path", tone: "dim" },
] as const;

export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-heading" className="mx-auto max-w-7xl px-5 py-32 sm:px-8 sm:py-40">
      <SectionLabel index="04">What I use, where I&apos;ve been</SectionLabel>
      <SplitHeading id="stack-heading" lines={HEADING} className="mb-16 text-[clamp(3.5rem,11vw,9rem)]" />

      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal as="ul" className="flex flex-col">
          {stack.map((group) => (
            <li key={group.label} data-reveal-item className="grid gap-3 border-t border-line py-6 sm:grid-cols-[10rem_1fr]">
              <h3 className="label pt-1">{group.label}</h3>
              <p className="text-xl text-bone">{group.items.join(" · ")}</p>
            </li>
          ))}
        </Reveal>

        <Reveal as="ol" className="relative flex flex-col gap-10 border-l border-line pl-8">
          {journey.map((step) => (
            <li key={step.what} data-reveal-item className="relative">
              <span aria-hidden="true" className="absolute top-2 -left-[2.32rem] size-2.5 rounded-full border-2 border-canvas bg-amber" />
              <p className="font-mono text-xs text-muted">{step.when}</p>
              <h3 className="mt-2 text-xl font-medium text-bone">{step.what}</h3>
              <p className="mt-1 text-muted">{step.detail}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
