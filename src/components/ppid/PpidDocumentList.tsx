"use client";

import { useState } from "react";
import { toEmbedPreviewUrl, type PpidAttachment } from "@/lib/ppid-files";

export default function PpidDocumentList({
  attachments,
  parentTitle,
}: {
  attachments: PpidAttachment[];
  parentTitle: string;
}) {
  const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({});

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (attachments.length === 0) return null;

  return (
    <section className="mt-10 space-y-5" aria-labelledby="ppid-documents-heading">
      <div className="accent-bar">
        <p className="eyebrow">Dokumen Resmi PPID</p>
        <h2
          id="ppid-documents-heading"
          className="mt-1 text-xl font-extrabold tracking-tight text-navy sm:text-2xl"
        >
          Lampiran Dokumen Informasi Publik ({attachments.length} File)
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Klik tombol <strong>Lihat Dokumen</strong> pada daftar di bawah untuk menampilkan isi dokumen langsung di halaman ini.
        </p>
      </div>

      <div className="space-y-3">
        {attachments.map((att, index) => {
          const isOpen = Boolean(openIndices[index]);
          const { embedUrl, openUrl, isImage } = toEmbedPreviewUrl(att.url);
          const docTitle =
            att.label ||
            (attachments.length > 1
              ? `${parentTitle} — Dokumen ${index + 1}`
              : parentTitle);

          return (
            <div
              key={`${att.url}-${index}`}
              className="overflow-hidden rounded-[var(--radius)] border border-slate-200/90 bg-white shadow-[var(--shadow-soft)] transition"
            >
              <div className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-start gap-3 text-left"
                >
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--teal-soft)] text-xs font-extrabold text-[var(--teal)]">
                    #{index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold uppercase tracking-wider text-[var(--teal)]">
                      Dokumen #{index + 1}
                    </span>
                    <span className="mt-0.5 block text-base font-bold text-navy hover:text-[var(--teal)]">
                      {docTitle}
                    </span>
                  </span>
                </button>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    aria-expanded={isOpen}
                    className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[var(--radius-sm)] px-4 py-2 text-xs font-semibold transition ${
                      isOpen
                        ? "border border-slate-300 bg-slate-100 text-navy hover:bg-slate-200"
                        : "bg-[var(--teal)] text-white shadow-sm hover:bg-[var(--teal-dark)]"
                    }`}
                  >
                    {isOpen ? "✕ Tutup Dokumen" : "👁️ Lihat Dokumen"}
                  </button>
                  <a
                    href={openUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-navy transition hover:border-teal-300 hover:bg-[var(--teal-soft)] hover:text-[var(--teal)]"
                  >
                    Unduh / Layar Penuh ↗
                  </a>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-slate-200 bg-slate-100">
                  {isImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={embedUrl}
                      alt={docTitle}
                      className="mx-auto max-h-[44rem] w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <iframe
                      src={embedUrl}
                      title={docTitle}
                      className="h-[34rem] w-full border-0 bg-slate-100 md:h-[44rem]"
                      allow="autoplay"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
