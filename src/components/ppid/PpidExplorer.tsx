"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DefaultCoverBanner from "@/components/ui/DefaultCoverBanner";
import SmartImage from "@/components/ui/SmartImage";
import {
  PPID_CATEGORY_META,
  getPpidCategoryShortLabel,
  type PpidItem,
} from "@/lib/ppid-actions";
import { parseArticleImages } from "@/lib/article-images";
import { parsePpidAttachments } from "@/lib/ppid-files";
import type { PpidCategory } from "@/lib/admin-schemas";

const FILTER_TABS: Array<{ value: "all" | PpidCategory; label: string }> = [
  { value: "all", label: "Semua Informasi" },
  { value: "berkala", label: PPID_CATEGORY_META.berkala.label },
  { value: "setiap-saat", label: PPID_CATEGORY_META["setiap-saat"].label },
  { value: "pelayanan-informasi", label: PPID_CATEGORY_META["pelayanan-informasi"].label },
  { value: "sarana-prasarana", label: PPID_CATEGORY_META["sarana-prasarana"].label },
  { value: "digitalisasi-medsos", label: PPID_CATEGORY_META["digitalisasi-medsos"].label },
  { value: "komitmen", label: PPID_CATEGORY_META.komitmen.label },
];

export default function PpidExplorer({ items }: { items: PpidItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | PpidCategory>("all");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, selectedCategory, search]);

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="panel space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-navy">
            Filter Kategori Informasi Publik (PPID)
          </p>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="ppid-search" className="sr-only">
              Cari dokumen atau informasi PPID
            </label>
            <input
              id="ppid-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul atau topik informasi..."
              className="input-field text-sm"
            />
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter kategori informasi PPID"
        >
          {FILTER_TABS.map((tab) => {
            const active = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategory(tab.value)}
                className={`rounded-full px-3.5 py-1.5 text-left text-xs font-semibold transition ${
                  active
                    ? "bg-[var(--teal)] text-white shadow-sm"
                    : "bg-[var(--teal-soft)] text-[var(--teal)] hover:bg-teal-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {filteredItems.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const dateStr = new Date(item.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            const attachments = parsePpidAttachments(item.fileUrl);
            const photos = parseArticleImages(item.imageUrl);
            const coverUrl = photos[0] || "";

            return (
              <article
                key={item.id}
                className="group panel panel-lift flex flex-col overflow-hidden"
              >
                <Link
                  href={`/ppid/${item.slug}`}
                  className="relative block h-44 w-full shrink-0 overflow-hidden bg-clinic-soft"
                  aria-label={`Lihat rincian ${item.title}`}
                >
                  {coverUrl ? (
                    <SmartImage
                      src={coverUrl}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <DefaultCoverBanner
                      title={item.title}
                      badge={`PPID · ${getPpidCategoryShortLabel(item.category)}`}
                      variant="card"
                    />
                  )}
                  <span className="absolute left-3 top-3 z-20 rounded-full bg-navy/85 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    {getPpidCategoryShortLabel(item.category)}
                  </span>
                </Link>

                <div className="flex flex-grow flex-col p-5">
                  <time
                    dateTime={new Date(item.date).toISOString()}
                    className="text-xs font-semibold uppercase tracking-wide text-clinic-teal"
                  >
                    {dateStr}
                  </time>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-navy">
                    <Link
                      href={`/ppid/${item.slug}`}
                      className="transition-colors hover:text-clinic-teal"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  {item.excerpt && (
                    <p className="mt-3 line-clamp-3 flex-grow text-sm leading-6 text-slate-600">
                      {item.excerpt}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                    <Link
                      href={`/ppid/${item.slug}`}
                      className="text-sm font-semibold text-clinic-teal hover:underline"
                    >
                      Baca rincian →
                    </Link>
                    {attachments.length > 0 && (
                      <Link
                        href={`/ppid/${item.slug}#ppid-documents-heading`}
                        className="inline-flex items-center gap-1 rounded-full bg-[var(--teal-soft)] px-3 py-1 text-xs font-semibold text-[var(--teal)] transition hover:bg-[var(--teal)] hover:text-white"
                      >
                        📎 {attachments.length} Dokumen
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="panel p-10 text-center text-slate-500">
          <p className="font-semibold text-navy">Belum ada informasi PPID pada kategori ini</p>
          <p className="mt-1 text-sm">
            Silakan pilih kategori lain atau perbarui kata kunci pencarian Anda.
          </p>
        </div>
      )}
    </div>
  );
}
