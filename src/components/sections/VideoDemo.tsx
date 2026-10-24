"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import type { ProjectVideo } from "@/content/site";

type Props = {
  video: ProjectVideo;
  title: string;
};

const POSTER = { width: 1280, height: 720 } as const;

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

// A poster that opens the clip in a native modal <dialog>: focus is trapped and
// restored by the browser, Esc closes it, and sound plays because the user asked.
export function VideoDemo({ video, title }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptId = useId();

  const handleOpen = () => {
    dialogRef.current?.showModal();
    void videoRef.current?.play().catch(() => {
      // Autoplay can still be refused (e.g. data saver); the controls remain.
    });
  };

  const handleClose = () => {
    const player = videoRef.current;
    if (player) {
      player.pause();
      player.currentTime = 0;
    }
    // Safari doesn't focus a button on click, so the browser may not restore focus to it.
    buttonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        data-video-open
        className="group relative mt-6 block w-full max-w-xl overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface text-left"
      >
        <Image
          src={video.poster}
          alt=""
          width={POSTER.width}
          height={POSTER.height}
          sizes="(min-width: 1024px) 36rem, 90vw"
          className="aspect-video h-auto w-full object-cover transition-transform duration-500 ease-[var(--ease-out-strong)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.02]"
        />
        {/* Below the image, not on it, so it never covers the poster's own text.
            The visible words start the accessible name, so voice control can say them. */}
        <span className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] text-bone transition-colors duration-200 group-hover:text-amber">
          <span aria-hidden="true" className="text-amber">▶</span>
          <span>
            Watch the demo<span className="sr-only"> of {title}, a {video.seconds}-second video</span>
            <span aria-hidden="true"> · {clock(video.seconds)}</span>
          </span>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        onClose={handleClose}
        aria-label={`${title} demo video`}
        data-lenis-prevent
        className="video-dialog m-auto rounded-[var(--radius-card)] border border-line bg-canvas p-0 text-bone"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{title} · demo</p>
          <form method="dialog">
            <button type="submit" className="rounded-full px-3 py-1 font-mono text-xs uppercase tracking-[0.1em] text-bone hover:text-amber">
              Close <span aria-hidden="true">✕</span>
            </button>
          </form>
        </div>
        <video
          ref={videoRef}
          src={video.src}
          poster={video.poster}
          controls
          playsInline
          preload="none"
          aria-label={`${title} demo`}
          aria-describedby={transcriptId}
          className="block aspect-video w-full bg-black"
        />
        <p id={transcriptId} className="sr-only">
          {video.transcript}
        </p>
      </dialog>
    </>
  );
}
