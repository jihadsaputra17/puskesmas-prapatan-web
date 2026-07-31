"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DokterCard from "./DokterCard";
import type { Dokter } from "@/lib/dokter-actions";

const GAP = 16; // gap-4

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden="true"
    >
      {dir === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}

/** Slideshow for the doctor list when there are more than 3 doctors. */
export default function DokterCarousel({ doctors }: { doctors: Dokter[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + GAP : track.clientWidth;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const idx = maxScroll <= 0 ? 0 : Math.round(track.scrollLeft / step);
    setActive(Math.min(idx, doctors.length - 1));
    setCanPrev(track.scrollLeft > 8);
    setCanNext(track.scrollLeft < maxScroll - 8);
  }, [doctors.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // One-time mount measurement; later updates come from scroll/resize events.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial layout sync
    update();
    const onResize = () => update();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [update]);

  const step = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector<HTMLElement>("[data-card]");
    return card ? card.offsetWidth + GAP : track.clientWidth;
  };

  const scrollByOne = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * step(), behavior: "smooth" });
  };

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * step(), behavior: "smooth" });
  };

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollByOne(-1)}
          disabled={!canPrev}
          aria-label="Dokter sebelumnya"
          className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/70 text-[var(--navy)] shadow-md backdrop-blur-md transition hover:scale-110 hover:bg-white hover:text-[var(--teal)] disabled:pointer-events-none disabled:opacity-35 sm:left-4"
        >
          <ArrowIcon dir="left" />
        </button>
        <button
          type="button"
          onClick={() => scrollByOne(1)}
          disabled={!canNext}
          aria-label="Dokter berikutnya"
          className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/70 text-[var(--navy)] shadow-md backdrop-blur-md transition hover:scale-110 hover:bg-white hover:text-[var(--teal)] disabled:pointer-events-none disabled:opacity-35 sm:right-4"
        >
          <ArrowIcon dir="right" />
        </button>

        <ul
          ref={trackRef}
          onScroll={update}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {doctors.map((d) => (
            <li
              key={d.id}
              data-card
              className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
            >
              <DokterCard d={d} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {doctors.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ke dokter ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === active ? "w-6 bg-[var(--teal)]" : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
