"use client";

import { useState } from "react";

export default function ArticleShare({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [notice, setNotice] = useState<string | null>(null);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedTextAndUrl = encodeURIComponent(`${title} — ${url}`);

  function showNotice(msg: string) {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2600);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      showNotice("Tautan berhasil disalin!");
    } catch {
      showNotice(null);
    }
  }

  async function shareToApp(platform: "Instagram" | "TikTok", webUrl: string) {
    try {
      await navigator.clipboard.writeText(`${title} — ${url}`);
    } catch {
      // ignore clipboard error
    }

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {
        // user cancelled or unsupported on desktop; fall through to open platform
      }
    }

    showNotice(`Tautan disalin! Silakan tempel di ${platform}.`);
    window.open(webUrl, "_blank", "noopener,noreferrer");
  }

  const buttonClass =
    "inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-clinic-soft px-3.5 text-xs font-bold text-clinic-teal transition hover:bg-clinic-teal hover:text-white";

  return (
    <div className="mt-8 rounded-[12px] border border-slate-200 bg-white px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-700">Bagikan artikel ini</span>
        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke WhatsApp"
            title="Bagikan ke WhatsApp"
            className={buttonClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.82 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.97-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.15-.2-1.19-1.58-1.19-3.01 0-1.43.75-2.13 1.01-2.42.27-.29.59-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.59.83 2.03.9 2.17.07.15.12.32.02.51-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.73-.85.93-1.15.2-.29.39-.24.66-.15.27.1 1.71.81 2 .95.29.15.49.22.56.34.07.12.07.71-.17 1.39z" />
            </svg>
            <span>WA</span>
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke Facebook"
            title="Bagikan ke Facebook"
            className={buttonClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span>Facebook</span>
          </a>

          {/* Instagram */}
          <button
            type="button"
            onClick={() => shareToApp("Instagram", "https://www.instagram.com/")}
            aria-label="Bagikan ke Instagram"
            title="Bagikan ke Instagram"
            className={buttonClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
            </svg>
            <span>Instagram</span>
          </button>

          {/* TikTok */}
          <button
            type="button"
            onClick={() => shareToApp("TikTok", "https://www.tiktok.com/")}
            aria-label="Bagikan ke TikTok"
            title="Bagikan ke TikTok"
            className={buttonClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
            <span>TikTok</span>
          </button>

          {/* Threads */}
          <a
            href={`https://www.threads.net/intent/post?text=${encodedTextAndUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bagikan ke Threads"
            title="Bagikan ke Threads"
            className={buttonClass}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.332-3.023.88-.726 2.106-1.138 3.545-1.192 1.07-.04 2.062.09 2.962.386-.085-.86-.357-1.506-.812-1.925-.55-.508-1.411-.768-2.56-.776h-.027c-.957 0-1.75.249-2.357.74-.482.39-.772.888-.885 1.52l-2.07-.37c.198-1.11.737-2.022 1.602-2.712 1.012-.806 2.29-1.216 3.799-1.216h.044c1.732.01 3.08.47 4.006 1.366.854.828 1.304 2.023 1.339 3.555l.005.291c1.158.615 2.022 1.472 2.513 2.592.752 1.716.798 4.442-1.466 6.66-1.825 1.788-4.088 2.626-7.334 2.652zm-.776-8.606c-1.01.038-1.798.29-2.279.687-.412.34-.607.772-.58 1.284.032.589.354 1.095.908 1.425.565.337 1.326.494 2.143.45 1.073-.058 1.883-.43 2.478-1.137.456-.542.765-1.31.908-2.267-.787-.256-1.693-.402-2.704-.435-.285-.01-.576-.013-.874-.007z" />
            </svg>
            <span>Threads</span>
          </a>

          {/* Copy Link */}
          <button
            type="button"
            onClick={copyLink}
            aria-label="Salin tautan"
            title="Salin tautan"
            className={buttonClass}
          >
            <span>{notice ? "✓ Disalin" : "🔗 Salin"}</span>
          </button>
        </div>
      </div>

      {notice && (
        <p className="mt-2.5 text-right text-xs font-semibold text-[var(--teal)]" role="status">
          {notice}
        </p>
      )}
    </div>
  );
}
