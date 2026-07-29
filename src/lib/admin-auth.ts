import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type AdminRole = "admin" | "superadmin";

type AdminIdentity = {
  id: string;
  role: AdminRole;
};

export class UnauthorizedError extends Error {
  readonly code = "UNAUTHORIZED";

  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  readonly code = "FORBIDDEN";

  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

async function getAuthorizedIdentity(): Promise<AdminIdentity> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  const role = session?.user?.role;

  if (!id || (role !== "admin" && role !== "superadmin")) {
    if (!session?.user) throw new UnauthorizedError();
    throw new ForbiddenError();
  }

  return { id, role };
}

export async function requireAdmin(): Promise<AdminIdentity> {
  return getAuthorizedIdentity();
}

export async function requireSuperadmin(): Promise<{ id: string; role: "superadmin" }> {
  const identity = await getAuthorizedIdentity();

  if (identity.role !== "superadmin") throw new ForbiddenError();

  return { id: identity.id, role: "superadmin" };
}

export function toAuthorizationResponse(error: unknown): NextResponse | null {
  if (error instanceof UnauthorizedError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
