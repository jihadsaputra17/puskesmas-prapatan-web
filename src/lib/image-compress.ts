/** Browser-only: compress image file → data URL (WebP, max width, optional aspect crop). */

export async function compressImageFile(
  file: File,
  options?: { maxWidth?: number; quality?: number; cropAspect?: number },
): Promise<string> {
  const maxWidth = options?.maxWidth ?? 1200;
  const quality = options?.quality ?? 0.8;
  const cropAspect = options?.cropAspect;

  const bitmap = await createImageBitmap(file);

  // Crop to aspect ratio BEFORE scaling so stored image is already uniform.
  // Tall images crop from the top (keeps face); wide images crop centered.
  let sx = 0;
  let sy = 0;
  let sw = bitmap.width;
  let sh = bitmap.height;
  if (cropAspect && cropAspect > 0) {
    const current = bitmap.width / bitmap.height;
    if (current > cropAspect) {
      // Too wide → crop width, centered.
      sw = Math.round(bitmap.height * cropAspect);
      sx = Math.round((bitmap.width - sw) / 2);
    } else if (current < cropAspect) {
      // Too tall → crop height from top (keeps face).
      sh = Math.round(bitmap.width / cropAspect);
      sy = 0;
    }
  }

  const scale = sw > maxWidth ? maxWidth / sw : 1;
  const width = Math.max(1, Math.round(sw * scale));
  const height = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Canvas tidak tersedia di browser ini.");
  }
  ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height);
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
