import { afterEach, describe, expect, it, vi } from "vitest";
import { compressImageFile } from "./image-compress";

type Bitmap = { width: number; height: number; close: () => void };

function setup(bitmap: Bitmap, ctx: { drawImage: ReturnType<typeof vi.fn> }) {
  const canvas = {
    width: 0,
    height: 0,
    getContext: vi.fn(() => ctx),
    toDataURL: vi.fn(() => "data:image/webp;base64,AAAA"),
  } as unknown as HTMLCanvasElement;
  vi.stubGlobal("createImageBitmap", vi.fn(async () => bitmap));
  vi.spyOn(document, "createElement").mockImplementation((tag: string) =>
    tag === "canvas" ? canvas : document.createElement(tag),
  );
  return canvas;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("compressImageFile cropAspect", () => {
  it("crops a wide image to 3:4 by trimming width (centered)", async () => {
    const ctx = { drawImage: vi.fn() };
    setup({ width: 2000, height: 1000, close: vi.fn() }, ctx);

    const result = await compressImageFile({} as File, { cropAspect: 0.75 });

    // 2000x1000 → crop width to 750, keep height 1000 → exact 3:4.
    expect(ctx.drawImage).toHaveBeenCalledWith(
      expect.anything(), 625, 0, 750, 1000, 0, 0, 750, 1000,
    );
    expect(result.startsWith("data:image/webp")).toBe(true);
  });

  it("crops a tall image to 3:4 from the top (keeps face)", async () => {
    const ctx = { drawImage: vi.fn() };
    setup({ width: 1000, height: 2000, close: vi.fn() }, ctx);

    await compressImageFile({} as File, { cropAspect: 0.75 });

    // 1000x2000 → crop height to 1333 from y=0, keep width 1000.
    expect(ctx.drawImage).toHaveBeenCalledWith(
      expect.anything(), 0, 0, 1000, 1333, 0, 0, 1000, 1333,
    );
  });

  it("does not crop when cropAspect is omitted", async () => {
    const ctx = { drawImage: vi.fn() };
    setup({ width: 2000, height: 1000, close: vi.fn() }, ctx);

    await compressImageFile({} as File, { maxWidth: 1200 });

    // Only downscale, source rect is the full bitmap.
    expect(ctx.drawImage).toHaveBeenCalledWith(
      expect.anything(), 0, 0, 2000, 1000, 0, 0, 1200, 600,
    );
  });
});
