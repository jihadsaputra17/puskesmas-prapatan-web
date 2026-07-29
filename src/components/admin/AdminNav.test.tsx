import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import AdminNav from "./AdminNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/admin/berita",
}));

describe("AdminNav", () => {
  it("shows content and settings navigation to admins without user management", () => {
    render(<AdminNav role="admin" userName="Rina" />);

    expect(screen.getByRole("link", { name: /kelola berita/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /layanan poli/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /jadwal dokter/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /pengaturan situs/i })).toBeVisible();
    expect(screen.queryByRole("link", { name: /manajemen pengguna/i })).not.toBeInTheDocument();
  });

  it("shows user management only to superadmins and marks current page", () => {
    render(<AdminNav role="superadmin" userName="Rina" />);

    expect(screen.getByRole("link", { name: /manajemen pengguna/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /kelola berita/i })).toHaveAttribute("aria-current", "page");
  });
});
