import { describe, expect, it } from "vitest";
import { sanitizeArticleHtml } from "./sanitize-html";

describe("sanitizeArticleHtml", () => {
  it("removes script and event handler attributes", () => {
    const result = sanitizeArticleHtml('<p onclick="alert(1)">Aman</p><script>alert(1)</script>');

    expect(result).toBe("<p>Aman</p>");
  });

  it("removes unsafe links", () => {
    expect(sanitizeArticleHtml('<a href="javascript:alert(1)">tautan</a>')).toBe("<a>tautan</a>");
  });

  it("keeps safe data image sources for inline uploads", () => {
    const src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const result = sanitizeArticleHtml(`<p>Foto</p><img src="${src}" alt="x">`);
    expect(result).toContain(src);
    expect(result).toContain("<img");
  });

  it("strips non-image data URLs on img", () => {
    const result = sanitizeArticleHtml('<img src="data:text/html;base64,PHNjcmlwdD4=" alt="x">');
    expect(result).not.toContain("data:text/html");
  });
});
