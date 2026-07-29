import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServerSession } from "next-auth";

const { mockedSql, mockedUpdateSettings } = vi.hoisted(() => ({ mockedSql: vi.fn(), mockedUpdateSettings: vi.fn() }));

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@vercel/postgres", () => ({ sql: mockedSql }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/settings-actions", () => ({ updateSettings: mockedUpdateSettings }));

import { POST as createNews } from "./berita/route";
import { POST as createSchedule } from "./jadwal/route";
import { POST as createService } from "./layanan/route";
import { POST as updateSettings } from "./settings/route";

const mockedGetServerSession = vi.mocked(getServerSession);
const admin = { user: { id: "admin-1", role: "admin" }, expires: "2099-01-01" };
const formRequest = (fields: Record<string, string>) => {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.set(key, value));
  return new Request("http://test/api/berita", { method: "POST", body: form });
};

describe("CMS content mutations", () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset();
    mockedSql.mockReset();
    mockedSql.mockResolvedValue({});
    mockedUpdateSettings.mockReset();
  });

  it("returns 401 for unauthenticated service creation before SQL", async () => {
    mockedGetServerSession.mockResolvedValue(null);
    const response = await createService(new Request("http://test/api/layanan", { method: "POST", body: JSON.stringify({}) }));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(mockedSql).not.toHaveBeenCalled();
  });

  it("returns 403 for non-admin service creation before parsing", async () => {
    mockedGetServerSession.mockResolvedValue({ user: { id: "patient-1", role: "patient" }, expires: "2099-01-01" });
    const response = await createService(new Request("http://test/api/layanan", { method: "POST", body: JSON.stringify({}) }));
    expect(response.status).toBe(403);
    expect(mockedSql).not.toHaveBeenCalled();
  });

  it("rejects invalid service fields before SQL", async () => {
    mockedGetServerSession.mockResolvedValue(admin);
    const response = await createService(new Request("http://test/api/layanan", { method: "POST", body: JSON.stringify({ nama_poli: "", deskripsi: "" }) }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "Data layanan tidak valid.", fields: { nama_poli: "Required", deskripsi: "Required" } });
    expect(mockedSql).not.toHaveBeenCalled();
  });

  it("rejects news image URL outside HTTP(S) before SQL", async () => {
    mockedGetServerSession.mockResolvedValue(admin);
    const response = await createNews(formRequest({ title: "Kabar", slug: "kabar", excerpt: "Ringkas", content: "Isi", image_url: "javascript:alert(1)", template: "standard" }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: "Data berita tidak valid.", fields: { image_url: "URL must use HTTP or HTTPS" } });
    expect(mockedSql).not.toHaveBeenCalled();
  });

  it("normalizes comma-separated schedule days for authorized creation", async () => {
    mockedGetServerSession.mockResolvedValue(admin);
    const response = await createSchedule(new Request("http://test/api/jadwal", { method: "POST", body: JSON.stringify({ nama_dokter: "Dr. Sari", poli: "Umum", hari: "Senin, Rabu", jam_mulai: "08:00", jam_selesai: "12:00" }) }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mockedSql).toHaveBeenCalledTimes(2);
  });

  it("accepts only validated settings for authorized admin", async () => {
    mockedGetServerSession.mockResolvedValue(admin);
    const response = await updateSettings(new Request("http://test/api/settings", { method: "POST", body: JSON.stringify({ site_name: "Puskesmas", instagram: "https://instagram.com/puskesmas" }) }));
    expect(response.status).toBe(200);
    expect(mockedUpdateSettings).toHaveBeenCalledWith({ site_name: "Puskesmas", instagram: "https://instagram.com/puskesmas" });
  });
});
