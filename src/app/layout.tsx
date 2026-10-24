import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Dock } from "@/components/Dock";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Preloader } from "@/components/Preloader";
import { SideRail } from "@/components/SideRail";
import { profile } from "@/content/site";
import { PRELOADER_SEEN_KEY } from "@/lib/intro";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: `${profile.name} — ${profile.role}`,
  description: `${profile.role} and Open Library contributor. I find the bug, file it, fix it.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: "I find the bug, file it, fix it.",
    url: "/",
    type: "website",
    images: [{ url: "/mohit-portrait.jpg", width: 800, height: 1000, alt: profile.name }],
  },
  twitter: { card: "summary", title: `${profile.name} — ${profile.role}`, images: ["/mohit-portrait.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#0f0e0c",
};

// Runs before first paint. It opts the page into motion (so reveal targets
// start hidden), decides whether the first-visit preloader plays, and if the
// app fails to hydrate within 4s it falls back to the fully visible static page.
const MOTION_BOOT = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='done';return}d.classList.add('motion');var seen=false;try{seen=sessionStorage.getItem('${PRELOADER_SEEN_KEY}')==='1'}catch(e){}if(!seen)d.classList.add('preload');setTimeout(function(){if(!d.dataset.motionReady){d.classList.remove('motion','preload');d.dataset.intro='done'}},4000)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {/* Static string defined above; no user input reaches it. */}
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
      </head>
      <body className="min-h-svh">
        <a
          href="#main"
          className="sr-only z-[70] rounded-full bg-amber px-4 py-2 font-mono text-xs text-canvas focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          Skip to content
        </a>
        <MotionProvider />
        <Preloader />
        <ScrollProgress />
        <Dock />
        <SideRail />
        {children}
      </body>
    </html>
  );
}
