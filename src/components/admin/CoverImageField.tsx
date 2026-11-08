"use client";

import { useCallback, useId, useState } from "react";
import DefaultCoverBanner from "@/components/ui/DefaultCoverBanner";
import { parseArticleImages, serializeArticleImages } from "@/lib/article-images";
import { compressImageFile, isDataImageUrl, isHttpImageUrl } from "@/lib/image-compress";

const MAX_IMAGES = 12;

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
  /** Optional title for the default cover preview when no custom image is uploaded. */
  previewTitle?: string;
  /** Allow uploading multiple photos for slideshow. Defaults to true when cropAspect is not set. */
  multiple?: boolean;
};

export default function CoverImageField({
  name = "image_url",
  defaultValue = "",
  error,
  describedBy,
  aspectClass = "aspect-video",
  aspectLabel = "16:9",
  cropAspect,
  previewTitle,
  multiple,
}: Props) {
  const allowMultiple = multiple ?? !cropAspect;
  const inputId = useId();
  const fileId = useId();

  const [images, setImages] = useState<string[]>(() => {
    const parsed = parseArticleImages(defaultValue);
    return allowMultiple ? parsed : parsed.slice(0, 1);
  });
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  const serializedValue = allowMultiple
    ? serializeArticleImages(images)
    : images[0] || "";

  const applyFiles = useCallback(
    async (fileList: FileList | File[] | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setLocalError("Pilih file gambar (JPG, PNG, WebP, GIF).");
          return;
        }
        if (file.size > 8 * 1024 * 1024) {
          setLocalError("Ukuran tiap file maksimal 8 MB sebelum kompresi.");
          return;
        }
      }

      setBusy(true);
      setLocalError(null);
      try {
        const compressedList: string[] = [];
        const maxToProcess = allowMultiple
          ? Math.max(0, MAX_IMAGES - images.length)
          : 1;

        if (allowMultiple && maxToProcess === 0) {
          setLocalError(`Maksimal ${MAX_IMAGES} foto dalam satu berita.`);
          setBusy(false);
          return;
        }

        for (const file of files.slice(0, maxToProcess)) {
          const dataUrl = await compressImageFile(file, {
            maxWidth: 1400,
            quality: 0.82,
            ...(cropAspect ? { cropAspect } : {}),
          });
          compressedList.push(dataUrl);
        }

        setImages((prev) =>
          allowMultiple
            ? [...prev, ...compressedList].slice(0, MAX_IMAGES)
            : compressedList.slice(0, 1),
        );
      } catch {
        setLocalError("Gagal memproses gambar. Coba file lain.");
      } finally {
        setBusy(false);
      }
    },
    [allowMultiple, cropAspect, images.length],
  );

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    void applyFiles(e.dataTransfer.files);
  };

  const applyUrl = () => {
    const next = urlDraft.trim();
    if (!next) {
      setLocalError(null);
      return;
    }
    if (!isHttpImageUrl(next)) {
      setLocalError("URL harus diawali http:// atau https://");
      return;
    }
    if (allowMultiple && images.length >= MAX_IMAGES) {
      setLocalError(`Maksimal ${MAX_IMAGES} foto dalam satu berita.`);
      return;
    }
    setImages((prev) => (allowMultiple ? [...prev, next] : [next]));
    setUrlDraft("");
    setLocalError(null);
  };

  const removeAt = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setLocalError(null);
  };

  const makePrimary = (index: number) => {
    if (index <= 0) return;
    setImages((prev) => {
      const target = prev[index];
      if (!target) return prev;
      const rest = prev.filter((_, i) => i !== index);
      return [target, ...rest];
    });
  };

  const clearAll = () => {
    setImages([]);
    setUrlDraft("");
    setLocalError(null);
  };

  const validImages = images.filter(
    (val) => isDataImageUrl(val) || isHttpImageUrl(val) || val.startsWith("data:image/"),
  );
  const primaryImage = validImages[0] || "";

  return (
    <div className="space-y-4">
      <input type="hidden" id={inputId} name={name} value={serializedValue} />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={`relative rounded-[var(--radius)] border-2 border-dashed p-6 text-center transition ${
          busy
            ? "border-teal-400 bg-clinic-soft/80"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100"
        }`}
      >
        <input
          id={fileId}
          type="file"
          multiple={allowMultiple}
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={busy}
          onChange={(e) => {
            void applyFiles(e.target.files);
            e.target.value = "";
          }}
          aria-describedby={describedBy}
        />
        <p className="text-sm font-semibold text-slate-700">
          {busy
            ? "Mengompres gambar…"
            : allowMultiple
              ? "Tarik foto sampul ke sini, atau klik untuk pilih (bisa pilih banyak foto sekaligus)"
              : "Tarik foto sampul ke sini, atau klik untuk pilih"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {allowMultiple
            ? `Bisa unggah 1 hingga ${MAX_IMAGES} foto (otomatis tampil sebagai Slideshow di halaman baca) · WebP`
            : `Satu gambar · diperkecil (max ~1400px)${cropAspect ? ` · potong otomatis rasio ${aspectLabel}` : ""} · WebP`}
        </p>
      </div>

      {primaryImage ? (
        <div className="space-y-3">
          {/* Main Cover Preview */}
          <div className="relative overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-clinic-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage}
              alt="Pratinjau sampul utama"
              className={`w-full object-cover ${aspectClass}`}
            />
            <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
              {validImages.length > 1
                ? `Slide 1 / ${validImages.length} (Sampul Utama)`
                : "Sampul Utama"}
            </span>
            <div className="absolute right-2 top-2 flex gap-2">
              <button
                type="button"
                onClick={clearAll}
                className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
              >
                {validImages.length > 1 ? "Hapus Semua" : "Hapus"}
              </button>
            </div>
            <p className="bg-navy/85 px-3 py-1.5 text-center text-xs font-medium text-white">
              {validImages.length > 1
                ? `${validImages.length} foto siap ditampilkan sebagai Slideshow (${aspectLabel})`
                : `Rasio ${aspectLabel} di situs`}
            </p>
          </div>

          {/* Multi-image Thumbnail Grid */}
          {allowMultiple && validImages.length > 1 && (
            <div className="rounded-[var(--radius)] border border-slate-200 bg-slate-50 p-3.5">
              <div className="mb-2.5 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-navy">
                  Urutan Foto Slideshow ({validImages.length} Foto)
                </p>
                <p className="text-xs text-slate-500">
                  Foto ke-1 menjadi gambar sampul di daftar berita
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {validImages.map((imgUrl, idx) => (
                  <div
                    key={`${idx}-${imgUrl.slice(0, 28)}`}
                    className={`group relative overflow-hidden rounded-lg border bg-white ${
                      idx === 0
                        ? "border-2 border-[var(--teal)] shadow-sm"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Slide ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-1.5 top-1.5 rounded bg-navy/80 px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
                        #{idx + 1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 p-1.5 text-[0.6875rem]">
                      {idx === 0 ? (
                        <span className="font-bold text-[var(--teal)]">Sampul Utama</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => makePrimary(idx)}
                          className="font-semibold text-slate-600 hover:text-[var(--teal)] hover:underline"
                        >
                          Jadikan Utama
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeAt(idx)}
                        className="font-semibold text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-clinic-soft">
          <div className={`relative w-full overflow-hidden ${aspectClass}`}>
            <DefaultCoverBanner
              title={previewTitle || "Sampul Resmi Otomatis Puskesmas Prapatan"}
              badge="Sampul Default (Otomatis)"
              variant="card"
            />
          </div>
          <p className="bg-navy/85 px-3 py-1.5 text-center text-xs font-medium text-white">
            Pratinjau Sampul Default — otomatis digunakan jika Anda tidak mengunggah gambar sampul
          </p>
        </div>
      )}

      <div>
        <label htmlFor={`${inputId}-url`} className="mb-1 block text-xs font-medium text-slate-600">
          {allowMultiple
            ? "Atau tambahkan URL gambar (bisa tambah lebih dari satu)"
            : "Atau tempel URL gambar"}
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
