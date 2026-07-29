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
});
