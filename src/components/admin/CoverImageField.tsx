"use client";

import { useCallback, useId, useState } from "react";
import { compressImageFile, isDataImageUrl, isHttpImageUrl } from "@/lib/image-compress";

type Props = {
  name?: string;
  defaultValue?: string;
  error?: string;
  describedBy?: string;
  /** Tailwind aspect class for the preview box, e.g. "aspect-[3/4]". Default 16:9 cover. */
  aspectClass?: string;
  /** Label shown in helper text, e.g. "3:4". Default "16:9". */
  aspectLabel?: string;
  /** Client-side crop to this aspect ratio during compression (e.g. 0.75 = 3:4). */
  cropAspect?: number;
};

export default function CoverImageField({
  name = "image_url",
  defaultValue = "",
  error,
  describedBy,
  aspectClass = "aspect-video",
  aspectLabel = "16:9",
  cropAspect,
}: Props) {
  const inputId = useId();
  const fileId = useId();
  const [value, setValue] = useState(defaultValue || "");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState(
    defaultValue && isHttpImageUrl(defaultValue) ? defaultValue : "",
  );

  const applyFile = useCallback(async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLocalError("Pilih file gambar (JPG, PNG, WebP, GIF).");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setLocalError("Ukuran file maksimal 8 MB sebelum kompresi.");
      return;
    }
    setBusy(true);
    setLocalError(null);
    try {
      const dataUrl = await compressImageFile(file, {
        maxWidth: 1400,
        quality: 0.82,
        ...(cropAspect ? { cropAspect } : {}),
      });
      setValue(dataUrl);
      setUrlDraft("");
    } catch {
      setLocalError("Gagal memproses gambar. Coba file lain.");
    } finally {
      setBusy(false);
    }
  }, [cropAspect]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    void applyFile(file || null);
  };

  const applyUrl = () => {
    const next = urlDraft.trim();
    if (!next) {
      setValue("");
      setLocalError(null);
      return;
    }
    if (!isHttpImageUrl(next)) {
      setLocalError("URL harus diawali http:// atau https://");
      return;
    }
    setValue(next);
    setLocalError(null);
  };

  const clear = () => {
    setValue("");
    setUrlDraft("");
    setLocalError(null);
  };

  const preview = value && (isDataImageUrl(value) || isHttpImageUrl(value) || value.startsWith("data:image/"));

  return (
    <div className="space-y-3">
      <input type="hidden" id={inputId} name={name} value={value} />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`relative rounded-[var(--radius)] border-2 border-dashed p-6 text-center transition ${
          busy ? "border-teal-400 bg-clinic-soft/80" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <input
          id={fileId}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={busy}
          onChange={(e) => void applyFile(e.target.files?.[0] || null)}
          aria-describedby={describedBy}
        />
        <p className="text-sm font-semibold text-slate-700">
          {busy ? "Mengompres gambar…" : "Tarik foto sampul ke sini, atau klik untuk pilih"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Satu gambar · diperkecil (max ~1400px)
          {cropAspect ? ` · potong otomatis rasio ${aspectLabel}` : ""} · WebP
        </p>
      </div>

      {preview ? (
        <div className="relative overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-clinic-soft">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Pratinjau sampul"
            className={`w-full object-cover ${aspectClass}`}
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
          <p className="bg-navy/80 px-3 py-1 text-center text-xs font-medium text-white">
            Rasio {aspectLabel} di situs
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor={`${inputId}-url`} className="mb-1 block text-xs font-medium text-slate-600">
          Atau tempel URL gambar
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={`${inputId}-url`}
            type="url"
            inputMode="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://..."
            className="input-field flex-1"
          />
          <button type="button" onClick={applyUrl} className="button-secondary shrink-0">
            Pakai URL
          </button>
        </div>
      </div>

      {(localError || error) && (
        <p className="text-sm text-red-700" role="alert">
          {localError || error}
        </p>
      )}
    </div>
  );
}
