import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getLayanan: vi.fn() }));
vi.mock("@/lib/layanan-actions", () => ({ getLayanan: mocks.getLayanan }));

import LayananSection from "./LayananSection";

describe("LayananSection", () => {
  it("renders plain-text excerpts and strips unsafe rich HTML", async () => {
    mocks.getLayanan.mockResolvedValue([
      {
        id: "service-1",
        icon: "🏥",
        nama_poli: "Umum",
        deskripsi:
          '<img src="javascript:alert(1)" onerror="alert(1)"><svg><script>alert(1)</script></svg><p>Aman untuk dibaca</p>',
      },
    ]);

    const { container } = render(await LayananSection());

    expect(screen.getByText(/Aman untuk dibaca/i)).toBeVisible();
    expect(container.querySelector("script, svg")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
    expect(container.querySelector('img[src^="javascript:"]')).toBeNull();
  });
});
