import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/lib/dokter-actions", () => ({
  getDokterPublik: vi.fn(),
}));

vi.mock("@/components/ui/SmartImage", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import { getDokterPublik } from "@/lib/dokter-actions";
import DokterSection from "./DokterSection";

const mockedGet = vi.mocked(getDokterPublik);

describe("DokterSection", () => {
  it("renders nothing when there are no public doctors", async () => {
    mockedGet.mockResolvedValue([]);
    const ui = await DokterSection();
    const { container } = render(<>{ui}</>);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders photo name and poli cards for active doctors", async () => {
    mockedGet.mockResolvedValue([
      {
        id: "1",
        nama: "Dr. Sari",
        poli: "Poli Umum",
        foto_url: "https://cdn.example.test/sari.webp",
        urutan: 0,
        aktif: true,
      },
    ]);
    const ui = await DokterSection();
    render(<>{ui}</>);
    expect(screen.getByRole("heading", { name: /dokter kami/i })).toBeVisible();
    expect(screen.getByText("Dr. Sari")).toBeVisible();
    expect(screen.getByText("Poli Umum")).toBeVisible();
    expect(screen.getByAltText("Dr. Sari")).toBeVisible();
  });
});
