"use client";

import Link from "next/link";
import { useState } from "react";
import { plainText, truncateText } from "@/lib/public-content";

export type StaticServiceItem = {
  emoji?: string;
  tag: string;
  title: string;
  desc: string;
  items: string[];
  cmsId?: string;
};

export type CmsLayananRow = {
  id: string;
  nama_poli: string;
  deskripsi: string;
  icon?: string | null;
};

export default function LayananFilterGrid({
  services,
  cmsServices = [],
}: {
  services: StaticServiceItem[];
  cmsServices?: CmsLayananRow[];
}) {
  const [activeTag, setActiveTag] = useState<string>("Semua");

  // Match or append CMS services so admin edits in /admin/layanan appear on /layanan
  const mergedServices: StaticServiceItem[] = services.map((s) => {
    const matchedCms = cmsServices.find(
      (c) =>
        c.nama_poli.trim().toLowerCase() === s.title.trim().toLowerCase() ||
        c.nama_poli.trim().toLowerCase() === s.tag.trim().toLowerCase(),
    );
    if (!matchedCms) return s;
    const cmsPlain = plainText(matchedCms.deskripsi);
    return {
      ...s,
      desc: cmsPlain ? truncateText(cmsPlain, 220) : s.desc,
      cmsId: matchedCms.id,
    };
  });

  const extraCmsServices: StaticServiceItem[] = cmsServices
    .filter(
      (c) =>
        !services.some(
          (s) =>
            s.title.trim().toLowerCase() === c.nama_poli.trim().toLowerCase() ||
            s.tag.trim().toLowerCase() === c.nama_poli.trim().toLowerCase(),
        ),
    )
    .map((c) => ({
      tag: c.nama_poli,
      title: c.nama_poli,
      desc: truncateText(plainText(c.deskripsi), 220),
      items: [],
      cmsId: c.id,
    }));

  const allServices = [...mergedServices, ...extraCmsServices];
  const tags = ["Semua", ...Array.from(new Set(allServices.map((s) => s.tag)))];

  const visibleServices =
    activeTag === "Semua"
      ? allServices
      : allServices.filter((s) => s.tag === activeTag);

  return (
    <>
      {/* Interactive Filter tags */}
      <div
        className="flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Filter layanan berdasarkan poli"
      >
        {tags.map((tag) => {
          const isSelected = activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setActiveTag(tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? "bg-[var(--teal)] text-white shadow-sm"
                  : "bg-[var(--teal-soft)] text-[var(--teal)] hover:bg-teal-100"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Service cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleServices.map((s, idx) => {
          const numberCode = String(idx + 1).padStart(2, "0");
          return (
            <article
              key={s.title}
              className="panel panel-lift flex h-full flex-col border-t-4 border-t-[var(--teal)] p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--teal-soft)] text-xs font-extrabold tracking-wider text-[var(--teal)]">
                  {numberCode}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider text-slate-500">
                  {s.tag}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold tracking-tight text-navy">
                {s.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">{s.desc}</p>

              {s.items.length > 0 && (
                <ul className="mt-4 flex-grow space-y-1.5 border-t border-slate-100 pt-3.5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm leading-5 text-slate-600 before:mt-1.5 before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-[var(--teal)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {s.cmsId && (
                <Link
                  href={`/layanan/${s.cmsId}`}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-clinic-teal hover:underline"
                >
                  Info selengkapnya →
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
