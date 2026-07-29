import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ServiceExplorer from "./ServiceExplorer";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

describe("ServiceExplorer", () => {
  it("finds service by name and reports no matches", () => {
    render(<ServiceExplorer services={[{ id: "1", nama_poli: "Poli Gigi", deskripsi: "<p>Perawatan <strong>gigi</strong></p>" }]} />);

    fireEvent.change(screen.getByLabelText("Cari layanan"), { target: { value: "gigi" } });
    expect(screen.getByText("Poli Gigi")).toBeVisible();
    expect(screen.getByText("Perawatan gigi")).toBeVisible();

    fireEvent.change(screen.getByLabelText("Cari layanan"), { target: { value: "mata" } });
    expect(screen.getByText("Layanan tidak ditemukan.")).toBeVisible();
  });
});
