import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServerSession } from "next-auth";
import {
  ForbiddenError,
  requireAdmin,
  requireSuperadmin,
  toAuthorizationResponse,
  UnauthorizedError,
} from "./admin-auth";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));

const mockedGetServerSession = vi.mocked(getServerSession);

describe("admin authorization guards", () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset();
  });

  it("rejects a missing session before mutation work", async () => {
    mockedGetServerSession.mockResolvedValue(null);

    await expect(requireAdmin()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("allows an admin session and returns its stable identity", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
      expires: "2099-01-01",
    });

    await expect(requireAdmin()).resolves.toEqual({ id: "admin-1", role: "admin" });
  });

  it("rejects admin from superadmin-only work", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: { id: "admin-1", role: "admin" },
      expires: "2099-01-01",
    });

    await expect(requireSuperadmin()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows only a superadmin for superadmin-only work", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: { id: "root-1", role: "superadmin" },
      expires: "2099-01-01",
    });

    await expect(requireSuperadmin()).resolves.toEqual({ id: "root-1", role: "superadmin" });
  });

  it("maps safe authorization errors to their HTTP statuses", async () => {
    const unauthorized = toAuthorizationResponse(new UnauthorizedError());
    const forbidden = toAuthorizationResponse(new ForbiddenError());

    expect(unauthorized?.status).toBe(401);
    await expect(unauthorized?.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(forbidden?.status).toBe(403);
    await expect(forbidden?.json()).resolves.toEqual({ error: "Forbidden" });
    expect(toAuthorizationResponse(new Error("database unavailable"))).toBeNull();
  });
});
