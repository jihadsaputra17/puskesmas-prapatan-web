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

  it("converts nbsp entities and unicode to normal spaces for justify wrap", () => {
    const raw = "<p>Kegiatan&nbsp;posyandu\u00A0berjalan&nbsp;lancar</p>".replace(
      "\\u00A0",
      "\u00A0",
    );
    // explicit unicode nbsp in source
    const withUnicode = "<p>Kegiatan&nbsp;posyandu\u00A0berjalan lancar</p>".replace(
      "\\u00A0",
      "\u00A0",
    );
    void raw;
    const result = sanitizeArticleHtml(
      "<p>Kegiatan&nbsp;posyandu" + "\u00A0" + "berjalan&#160;lancar</p>",
    );
    expect(result).not.toMatch(/&nbsp;|\u00A0|&#160;/);
    expect(result).toContain("Kegiatan posyandu berjalan lancar");
    void withUnicode;
  });

  it("strips quill align classes so CSS justify owns layout", () => {
    const result = sanitizeArticleHtml('<p class="ql-align-justify">Teks rata</p>');
    expect(result).not.toContain("ql-align-justify");
    expect(result).toContain("Teks rata");
  });
});
