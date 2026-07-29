import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ requireAdmin: vi.fn(), requireSuperadmin: vi.fn() }));
vi.mock("@/lib/admin-auth", () => mocks);
vi.mock("@/lib/actions", () => ({ getBeritaKesehatan: vi.fn(), getBeritaBySlug: vi.fn() }));
vi.mock("@/lib/layanan-actions", () => ({ getLayanan: vi.fn(), getLayananById: vi.fn() }));
vi.mock("@/lib/jadwal-actions", () => ({ getJadwal: vi.fn(), getJadwalById: vi.fn() }));
vi.mock("@/lib/settings-actions", () => ({ getSettings: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn(), notFound: vi.fn() }));

import LayananPage from "./layanan/page";
import TambahLayananPage from "./layanan/tambah/page";
import EditLayananPage from "./layanan/[id]/edit/page";
import JadwalPage from "./jadwal/page";
import TambahJadwalPage from "./jadwal/tambah/page";
import EditJadwalPage from "./jadwal/[id]/edit/page";
import SettingsPage from "./settings/page";
import BeritaPage from "./berita/page";
import EditBeritaPage from "./berita/edit/[slug]/page";

describe("admin content page authorization", () => {
  beforeEach(() => {
    mocks.requireAdmin.mockReset();
  });

  it.each([
    ["service list", () => LayananPage()],
    ["service create", () => TambahLayananPage()],
    ["service edit", () => EditLayananPage({ params: Promise.resolve({ id: "id" }) })],
    ["schedule list", () => JadwalPage()],
    ["schedule create", () => TambahJadwalPage()],
    ["schedule edit", () => EditJadwalPage({ params: Promise.resolve({ id: "id" }) })],
    ["settings", () => SettingsPage()],
    ["news list", () => BeritaPage()],
    ["news edit", () => EditBeritaPage({ params: Promise.resolve({ slug: "news" }) })],
  ])("uses requireAdmin before %s loader", async (_name, load) => {
    mocks.requireAdmin.mockRejectedValueOnce(new Error("blocked"));
    await expect(load()).rejects.toThrow("blocked");
    expect(mocks.requireAdmin).toHaveBeenCalledOnce();
  });
});
