import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import AddUserForm from "./AddUserForm";
import EditUserForm from "./[id]/edit/EditUserForm";
import ResetPasswordForm from "./[id]/reset/ResetPasswordForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("user forms", () => {
  it("exposes required labeled user fields with admin as default role", () => {
    render(<AddUserForm />);

    expect(screen.getByLabelText(/nama/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/kata sandi/i)).toBeRequired();
    expect(screen.getByLabelText(/peran/i)).toHaveValue("admin");
  });

  it.each([
    ["create", <AddUserForm key="create" />, "Simpan Pengguna"],
    ["edit", <EditUserForm key="edit" user={{ id: "a-user", name: "Budi", email: "budi@example.com", role: "admin" }} />, "Simpan Perubahan"],
  ])("renders server field errors for %s user submission", async (_kind, form, submitLabel) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ fields: { email: "Email tidak valid." } }) }));
    render(form);

    fireEvent.click(screen.getByRole("button", { name: submitLabel }));

    expect(await screen.findByText("Email tidak valid.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-describedby", "email-error");
  });

  it("renders server password field errors after reset submission", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, json: async () => ({ fields: { password: "Kata sandi ditolak." } }) }));
    render(<ResetPasswordForm userId="a-user" />);

    fireEvent.change(screen.getByLabelText("Kata Sandi Baru"), { target: { value: "password-valid" } });
    fireEvent.change(screen.getByLabelText("Konfirmasi Kata Sandi Baru"), { target: { value: "password-valid" } });
    fireEvent.click(screen.getByRole("button", { name: "Reset Kata Sandi" }));

    expect(await screen.findByText("Kata sandi ditolak.")).toBeInTheDocument();
    expect(screen.getByLabelText("Kata Sandi Baru")).toHaveAttribute("aria-describedby", "password-error");
  });
});
