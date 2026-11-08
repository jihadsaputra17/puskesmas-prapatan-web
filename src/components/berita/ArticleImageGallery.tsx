"use client";

import { useCallback, useEffect, useState } from "react";
import DefaultCoverBanner from "@/components/ui/DefaultCoverBanner";
import SmartImage from "@/components/ui/SmartImage";
import { parseArticleImages } from "@/lib/article-images";

type Props = {
  imageUrl?: string | null;
  title: string;
  badge: string;
  subtitle?: string;
  caption?: string;
};

export default function ArticleImageGallery({
  imageUrl,
  title,
  badge,
  subtitle = "UPTD Puskesmas Prapatan · Kota Balikpapan",
  caption,
}: Props) {
  const images = parseArticleImages(imageUrl);
  const total = images.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeIndex = total > 0 ? activeIndex % total : 0;

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || paused || lightboxOpen) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [total, paused, lightboxOpen, nextSlide]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, nextSlide, prevSlide]);

  if (total === 0) {
    return (
      <figure className="content-container max-w-4xl">
        <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-clinic-soft shadow-[var(--shadow-soft)]">
          <DefaultCoverBanner
            title={title}
            badge={badge}
            subtitle={subtitle}
            variant="hero"
          />
        </div>
        {caption ? (
          <figcaption className="mt-2.5 text-center text-[0.8125rem] text-slate-400">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="content-container max-w-4xl">
      <div
        className="group relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-slate-900 shadow-[var(--shadow-soft)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <SmartImage
          key={images[safeIndex]}
          src={images[safeIndex]}
          alt={`${title} — Foto ${safeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 896px) 100vw, 896px"
          priority={safeIndex === 0}
        />

        {/* Top Bar: Counter & Lightbox Zoom */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-navy/60 to-transparent p-3.5 sm:p-4">
          {total > 1 ? (
            <span className="rounded-full bg-navy/85 px-3 py-1 text-xs font-bold tracking-wide text-white backdrop-blur-sm">
              Foto {safeIndex + 1} / {total}
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-[var(--teal)]"
            aria-label="Perbesar foto"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
              />
            </svg>
            Perbesar
          </button>
        </div>

        {/* Prev / Next Navigation Controls when multiple photos */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy/75 text-white shadow-md backdrop-blur-sm transition hover:bg-[var(--teal)] focus:outline-none"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 z-20 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-navy/75 text-white shadow-md backdrop-blur-sm transition hover:bg-[var(--teal)] focus:outline-none"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Bottom Dot Indicators */}
            <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Pilih foto ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === safeIndex
                      ? "w-6 bg-white shadow-sm"
                      : "w-2 bg-white/55 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip below Hero when multiple photos */}
      {total > 1 && (
        <div
          className="mt-3 flex gap-2.5 overflow-x-auto pb-1"
          role="region"
          aria-label="Galeri foto artikel"
        >
          {images.map((img, idx) => {
            const active = idx === safeIndex;
            return (
              <button
                key={`${idx}-${img.slice(0, 24)}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  active
                    ? "border-[var(--teal)] ring-2 ring-[var(--teal)]/30"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`Lihat foto ${idx + 1}`}
                aria-current={active ? "true" : undefined}
              >
                <SmartImage
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            );
          })}
        </div>
      )}

      {caption ? (
        <figcaption className="mt-2.5 text-center text-[0.8125rem] text-slate-400">
          {caption}
        </figcaption>
      ) : null}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri foto ${title}`}
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex w-full items-center justify-between text-white">
              <span className="text-sm font-semibold">
                {title} {total > 1 ? `(${safeIndex + 1} / ${total})` : ""}
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/30"
              >
                Tutup ✕
              </button>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <SmartImage
                src={images[safeIndex]}
                alt={`${title} — Foto ${safeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Foto sebelumnya"
                    className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-[var(--teal)]"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Foto berikutnya"
                    className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-[var(--teal)]"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}
