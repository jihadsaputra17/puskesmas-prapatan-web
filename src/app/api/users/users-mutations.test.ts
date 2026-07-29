import { beforeEach, describe, expect, it, vi } from "vitest";
import { getServerSession } from "next-auth";

const { mockedSql, mockedHash } = vi.hoisted(() => ({
  mockedSql: vi.fn(),
  mockedHash: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("@vercel/postgres", () => ({ sql: mockedSql }));
vi.mock("bcryptjs", () => ({ default: { hash: mockedHash } }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { POST as createUser } from "./route";
import { DELETE, PUT } from "./[id]/route";
import { POST as resetUserPassword } from "./reset-password/route";
import { getUserById, resetPassword } from "@/lib/user-actions";

const mockedGetServerSession = vi.mocked(getServerSession);
const validId = "123e4567-e89b-42d3-a456-426614174000";
const validUser = { name: "Admin Baru", email: "ADMIN@EXAMPLE.TEST", password: "password8", role: "admin" };
const superadmin = { user: { id: "root-1", role: "superadmin" }, expires: "2099-01-01" };
const params = { params: Promise.resolve({ id: validId }) };

const jsonRequest = (url: string, body: unknown, method = "POST") => new Request(url, {
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

describe("user mutations", () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset();
    mockedSql.mockReset();
    mockedSql.mockResolvedValue({ rows: [] });
    mockedHash.mockReset();
    mockedHash.mockResolvedValue("hashed-password");
  });

  it("rejects admin user creation before SQL", async () => {
    mockedGetServerSession.mockResolvedValue({ user: { id: "a", role: "admin" }, expires: "2099-01-01" });

    const response = await createUser(jsonRequest("http://test/api/users", validUser));

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
    expect(mockedSql).not.toHaveBeenCalled();
  });

  it("rejects malformed user bodies before hashing or SQL", async () => {
    mockedGetServerSession.mockResolvedValue(superadmin);

    const response = await createUser(jsonRequest("http://test/api/users", { ...validUser, role: "owner" }));

    expect(response.status).toBe(400);
    expect(mockedHash).not.toHaveBeenCalled();
    expect(mockedSql).not.toHaveBeenCalled();
  });

  it("normalizes validated creation email before SQL", async () => {
    mockedGetServerSession.mockResolvedValue(superadmin);

    const response = await createUser(jsonRequest("http://test/api/users", validUser));

    expect(response.status).toBe(200);
    expect(mockedHash).toHaveBeenCalledWith("password8", 10);
    expect(mockedSql).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid route IDs before SQL", async () => {
    mockedGetServerSession.mockResolvedValue(superadmin);
    const invalidParams = { params: Promise.resolve({ id: "not-a-uuid" }) };

    const responses = await Promise.all([
      DELETE(new Request("http://test/api/users/not-a-uuid", { method: "DELETE" }), invalidParams),
      PUT(jsonRequest("http://test/api/users/not-a-uuid", { name: "Admin", email: "admin@example.test", role: "admin" }, "PUT"), invalidParams),
      resetUserPassword(jsonRequest("http://test/api/users/reset-password", { id: "not-a-uuid", password: "password8" })),
    ]);

    expect(responses.map((response) => response.status)).toEqual([400, 400, 400]);
    expect(mockedSql).not.toHaveBeenCalled();
  });

  it("keeps database errors out of password-reset action responses", async () => {
    mockedGetServerSession.mockResolvedValue(superadmin);
    mockedSql.mockRejectedValue(new Error("database secret"));

    const result = await resetPassword(validId, "password8");

    expect(result).toEqual({ error: "Gagal memperbarui kata sandi." });
  });

  it("requires superadmin before legacy user reads", async () => {
    mockedGetServerSession.mockResolvedValue({ user: { id: "a", role: "admin" }, expires: "2099-01-01" });

    await expect(getUserById(validId)).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(mockedSql).not.toHaveBeenCalled();
  });
});
