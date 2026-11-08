const MAX_SINGLE_DATA_URL_LENGTH = 2_000_000;
const MAX_GALLERY_IMAGES = 12;

export function isValidSingleImageUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(trimmed)) {
    return trimmed.length <= MAX_SINGLE_DATA_URL_LENGTH;
  }
  try {
    const protocol = new URL(trimmed).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

export function parseArticleImages(raw?: string | null): string[] {
  if (!raw || typeof raw !== "string") return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch {
      return [];
    }
  }

  if (trimmed.includes("\n")) {
    return trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return [trimmed];
}

export function serializeArticleImages(images: string[]): string {
  const cleaned = images.map((img) => img.trim()).filter(Boolean);
  if (cleaned.length === 0) return "";
  if (cleaned.length === 1) return cleaned[0];
  return JSON.stringify(cleaned);
}

export function getPrimaryArticleImage(raw?: string | null): string {
  const images = parseArticleImages(raw);
  return images[0] ?? "";
}

export function isValidArticleImageField(raw?: string | null): boolean {
  if (!raw || !raw.trim()) return true;
  const images = parseArticleImages(raw);
  if (images.length === 0 || images.length > MAX_GALLERY_IMAGES) return false;
  return images.every(isValidSingleImageUrl);
}
