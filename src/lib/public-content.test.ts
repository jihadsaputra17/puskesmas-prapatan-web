import { plainText, toServiceSearchText, truncateText } from "./public-content";

describe("public content helpers", () => {
  it("removes markup and normalizes whitespace", () => {
    expect(plainText("<p>Poli <strong>umum</strong></p>\n<p>untuk warga</p>"))
      .toBe("Poli umum untuk warga");
  });

  it("truncates without breaking the maximum length", () => {
    expect(truncateText("abcdef", 5)).toBe("abcd…");
  });

  it("returns normalized searchable service text", () => {
    expect(toServiceSearchText("Poli Umum", "<p>Untuk warga</p>"))
      .toBe("poli umum untuk warga");
  });
});
