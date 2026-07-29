import { render, screen, within } from "@testing-library/react";
import { getServerSession } from "next-auth";
import { vi } from "vitest";
import AdminDashboard from "./page";
const mocks = vi.hoisted(() => ({
  getBeritaKesehatan: vi.fn(),
  getBeritaCount: vi.fn(),
  getLayananCount: vi.fn(),
  getJadwalCount: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@/lib/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/actions", () => ({
  getBeritaKesehatan: mocks.getBeritaKesehatan,
  getBeritaCount: mocks.getBeritaCount,
}));
vi.mock("@/lib/layanan-actions", () => ({ getLayananCount: mocks.getLayananCount }));
vi.mock("@/lib/jadwal-actions", () => ({ getJadwalCount: mocks.getJadwalCount }));

const mockedGetServerSession = vi.mocked(getServerSession);

function summaryCard(label: string) {
  return screen.getByText(label).closest("article")!;
}

describe("AdminDashboard", () => {
  beforeEach(() => {
    mockedGetServerSession.mockResolvedValue({ user: { name: "Rina" } } as never);
    mocks.getBeritaKesehatan.mockResolvedValue([]);
    mocks.getBeritaCount.mockResolvedValue(0);
    mocks.getLayananCount.mockResolvedValue(0);
    mocks.getJadwalCount.mockResolvedValue(0);
  });

  it("shows actual empty counts after successful loaders", async () => {
    render(await AdminDashboard());

    expect(within(summaryCard("Berita")).getByText("0")).toBeVisible();
    expect(screen.getByText("Belum ada berita.")).toBeVisible();
    expect(screen.queryByText("Data belum tersedia.")).not.toBeInTheDocument();
  });

  it("shows unavailable state instead of zero when a dashboard loader fails", async () => {
    mocks.getBeritaCount.mockRejectedValue(new Error("database unavailable"));

    render(await AdminDashboard());

    expect(within(summaryCard("Berita")).getByText("Data belum tersedia.")).toBeVisible();
    expect(within(summaryCard("Berita")).queryByText("0")).not.toBeInTheDocument();
  });

  it("shows uncapped news total instead of recent-list length", async () => {
    mocks.getBeritaKesehatan.mockResolvedValue(Array.from({ length: 6 }, (_, index) => ({ title: `Berita ${index}` })));
    mocks.getBeritaCount.mockResolvedValue(7);

    render(await AdminDashboard());

    expect(within(summaryCard("Berita")).getByText("7")).toBeVisible();
  });
});
