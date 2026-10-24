import { profile } from "@/content/site";

// Desktop-only vertical link pinned to the left edge.
export function SideRail() {
  return (
    <div className="fixed bottom-10 left-6 z-30 hidden xl:block">
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="block font-mono text-[11px] tracking-[0.12em] text-muted transition-colors duration-200 [writing-mode:vertical-rl] hover:text-amber"
      >
        github.com/MohitSAGAR11
      </a>
    </div>
  );
}
