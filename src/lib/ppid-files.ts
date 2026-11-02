export type PpidAttachment = {
  label: string;
  url: string;
};

function isHttpUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Parses `file_url` stored in `ppid_items.file_url` into a normalized array of attachments.
 * Supports:
 * 1. JSON array of `{ label?: string, url: string }` or `string`
 * 2. Newline-separated URLs
 * 3. Single URL string
 */
export function parsePpidAttachments(raw?: string | null): PpidAttachment[] {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        const result: PpidAttachment[] = [];
        for (const item of parsed) {
          if (typeof item === "string") {
            const u = item.trim();
            if (u && isHttpUrl(u)) {
              result.push({ label: "", url: u });
            }
          } else if (item && typeof item === "object") {
            const rec = item as Record<string, unknown>;
            const u = String(rec.url ?? "").trim();
            const label = String(rec.label ?? "").trim();
            if (u && isHttpUrl(u)) {
              result.push({ label, url: u });
            }
          }
        }
        return result;
      }
    } catch {
      // Fall through to line/single URL parsing
    }
  }

  return trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && isHttpUrl(line))
    .map((url) => ({ label: "", url }));
}

/**
 * Serializes attachments into a compact string for `ppid_items.file_url`.
 * - Empty -> `""`
 * - Single URL without label -> raw URL string (backward compatible)
 * - Multiple URLs or URL with label -> JSON array string
 */
export function serializePpidAttachments(items: PpidAttachment[]): string {
  const cleaned = items
    .map((item) => ({
      label: item.label.trim(),
      url: item.url.trim(),
    }))
    .filter((item) => item.url.length > 0);

  if (cleaned.length === 0) return "";
  if (cleaned.length === 1 && !cleaned[0].label) {
    return cleaned[0].url;
  }
  return JSON.stringify(cleaned);
}

/**
 * Validates that a raw `file_url` string is either empty, a valid HTTP(S) URL,
 * or a JSON array / newline list where every non-empty entry is a valid HTTP(S) URL.
 */
export function isValidPpidFileUrlField(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return true;

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) return false;
      for (const item of parsed) {
        if (typeof item === "string") {
          const u = item.trim();
          if (u && !isHttpUrl(u)) return false;
        } else if (item && typeof item === "object") {
          const u = String((item as Record<string, unknown>).url ?? "").trim();
          if (!u || !isHttpUrl(u)) return false;
        } else {
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.every(isHttpUrl);
}

/**
 * Converts a Google Drive, Google Docs/Sheets/Slides, or direct PDF/file URL
 * into an embeddable preview URL so the document renders directly inside the website.
 */
export function toEmbedPreviewUrl(rawUrl: string): {
  embedUrl: string;
  openUrl: string;
  isImage: boolean;
} {
  const url = rawUrl.trim();

  // Check if direct image URL
  if (/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(url)) {
    return { embedUrl: url, openUrl: url, isImage: true };
  }

  // Google Drive file link: https://drive.google.com/file/d/<FILE_ID>/view...
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch?.[1]) {
    const fileId = driveFileMatch[1];
    return {
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      openUrl: `https://drive.google.com/file/d/${fileId}/view`,
      isImage: false,
    };
  }

  // Google Drive open?id=<FILE_ID> or uc?id=<FILE_ID>
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("drive.google.com")) {
      const idParam = parsedUrl.searchParams.get("id");
      if (idParam) {
        return {
          embedUrl: `https://drive.google.com/file/d/${idParam}/preview`,
          openUrl: `https://drive.google.com/file/d/${idParam}/view`,
          isImage: false,
        };
      }
      // Google Drive folder fallback: embeddedfolderview
      const folderMatch = url.match(/drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([a-zA-Z0-9_-]+)/i);
      if (folderMatch?.[1]) {
        return {
          embedUrl: `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#list`,
          openUrl: url,
          isImage: false,
        };
      }
    }

    // Google Docs / Sheets / Slides
    const docsMatch = url.match(
      /docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/i,
    );
    if (docsMatch?.[1] && docsMatch?.[2]) {
      return {
        embedUrl: `https://docs.google.com/${docsMatch[1]}/d/${docsMatch[2]}/preview`,
        openUrl: url,
        isImage: false,
      };
    }
  } catch {
    // ignore URL parse error
  }

  return { embedUrl: url, openUrl: url, isImage: false };
}
