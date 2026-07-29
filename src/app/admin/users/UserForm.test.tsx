import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AddUserForm from "./AddUserForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("AddUserForm", () => {
  it("exposes required labeled user fields with admin as default role", () => {
    render(<AddUserForm />);

    expect(screen.getByLabelText(/nama/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/kata sandi/i)).toBeRequired();
    expect(screen.getByLabelText(/peran/i)).toHaveValue("admin");
  });
});
