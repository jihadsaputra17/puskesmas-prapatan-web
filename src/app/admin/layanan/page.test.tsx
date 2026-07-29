import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), getLayanan: vi.fn() }));
vi.mock("@/lib/admin-auth", () => ({ requireAdmin: mocks.requireAdmin }));
vi.mock("@/lib/layanan-actions", () => ({ getLayanan: mocks.getLayanan }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import ManajemenLayananPage from "./page";

describe("ManajemenLayananPage", () => {
  it("allows admin and sanitizes service previews", async () => {
    mocks.requireAdmin.mockResolvedValue({ id: "admin-1", role: "admin" });
    mocks.getLayanan.mockResolvedValue([{ id: "service-1", icon: "🏥", nama_poli: "Umum", deskripsi: '<a href="javascript:alert(1)" onclick="alert(1)">Aman</a><script>alert(1)</script>' }]);

    const { container } = render(await ManajemenLayananPage());

    expect(mocks.requireAdmin).toHaveBeenCalledOnce();
    expect(screen.getAllByText("Aman")).toHaveLength(2);
    expect(container.querySelector("script, [onclick], a[href^='javascript:']")).toBeNull();
  });
});
