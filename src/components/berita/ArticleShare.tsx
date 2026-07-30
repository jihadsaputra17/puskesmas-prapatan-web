"use client";

import { useState } from "react";

export default function ArticleShare({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-slate-200 px-5 py-4">
      <span className="text-sm font-semibold text-slate-600">Bagikan artikel ini</span>
      <div className="flex gap-2">
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke WhatsApp"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-clinic-soft text-xs font-bold text-clinic-teal transition hover:bg-clinic-teal hover:text-white"
        >
          WA
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bagikan ke Facebook"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-clinic-soft text-xs font-bold text-clinic-teal transition hover:bg-clinic-teal hover:text-white"
        >
          FB
        </a>
        <button
          type="button"
          onClick={copyLink}
          aria-label={copied ? "Tautan disalin" : "Salin tautan"}
          className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-clinic-soft px-2 text-xs font-bold text-clinic-teal transition hover:bg-clinic-teal hover:text-white"
        >
          {copied ? "✓" : "↗"}
        </button>
      </div>
    </div>
  );
}
