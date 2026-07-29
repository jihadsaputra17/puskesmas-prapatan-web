import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LayananSection from "./LayananSection";

describe("LayananSection", () => {
  it("renders service cards with emoji icons and titles", async () => {
    const { container } = render(await LayananSection());

    expect(screen.getByText(/Poli Umum/i)).toBeVisible();
    expect(screen.getByText(/Poli Gigi/i)).toBeVisible();
    expect(screen.getByText(/KIA & KB/i)).toBeVisible();
    expect(screen.getByText(/Laboratorium/i)).toBeVisible();

    // 6 cards + 1 'Semua layanan' button link to /layanan
    const links = container.querySelectorAll('a[href="/layanan"]');
    expect(links.length).toBe(7);

    // Heading visible
    expect(screen.getByText(/Layanan poli/i)).toBeVisible();
    expect(screen.getByText(/Semua layanan/i)).toBeVisible();
  });
});
