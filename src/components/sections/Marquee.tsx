import { marquee } from "@/content/site";

function Row({ isCopy }: { isCopy?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={isCopy ? "true" : undefined}>
      {marquee.map((item) => (
        <li key={item} className="display flex items-center text-4xl text-dim sm:text-5xl">
          <span className="px-6">{item}</span>
          <span className="text-amber" aria-hidden="true">
            ✱
          </span>
        </li>
      ))}
    </ul>
  );
}

// The two rows are identical, so translating by -50% loops seamlessly.
export function Marquee() {
  return (
    <div className="marquee overflow-hidden border-y border-line py-5">
      <div className="marquee-track flex w-max">
        <Row />
        <Row isCopy />
      </div>
    </div>
  );
}
