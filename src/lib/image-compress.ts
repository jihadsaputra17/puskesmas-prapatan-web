/** Browser-only: compress image file → data URL (WebP, max width). */

export async function compressImageFile(
  file: File,
  options?: { maxWidth?: number; quality?: number },
): Promise<string> {
  const maxWidth = options?.maxWidth ?? 1200;
  const quality = options?.quality ?? 0.8;

  const bitmap = await createImageBitmap(file);
  const scale = bitmap.width > maxWidth ? maxWidth / bitmap.width : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas tidak tersedia di browser ini.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = canvas.toDataURL("image/webp", quality);
  if (webp.startsWith("data:image/webp")) return webp;
  // Fallback browsers without WebP encode
  return canvas.toDataURL("image/jpeg", quality);
}

export function isDataImageUrl(value: string) {
  return /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(value.trim());
}

export function isHttpImageUrl(value: string) {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
