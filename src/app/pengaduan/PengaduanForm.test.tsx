import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import PengaduanForm from "./PengaduanForm";

beforeEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("PengaduanForm", () => {
  it("exposes labelled required fields", () => {
    render(<PengaduanForm />);

    expect(screen.getByLabelText(/nama lengkap/i)).toBeRequired();
    expect(screen.getByLabelText(/isi pengaduan/i)).toBeRequired();
    expect(screen.getByRole("button", { name: /kirim pengaduan/i })).toBeInTheDocument();
  });

  it("shows error alert when API call fails", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Gagal"));

    render(<PengaduanForm />);

    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: "Andi" } });
    fireEvent.change(screen.getByLabelText(/nomor hp/i), { target: { value: "08123456789" } });
    fireEvent.change(screen.getByLabelText(/isi pengaduan/i), { target: { value: "Test" } });

    fireEvent.click(screen.getByRole("button", { name: /kirim pengaduan/i }));

    expect(screen.getByRole("button", { name: /mengirim/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/jaringan|kesalahan/i);
    });

    globalThis.fetch = original;
  });

  it("shows success after successful submit", async () => {
    const original = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    render(<PengaduanForm />);

    fireEvent.change(screen.getByLabelText(/nama lengkap/i), { target: { value: "Andi" } });
    fireEvent.change(screen.getByLabelText(/nomor hp/i), { target: { value: "08123456789" } });
    fireEvent.change(screen.getByLabelText(/isi pengaduan/i), { target: { value: "Test" } });

    fireEvent.click(screen.getByRole("button", { name: /kirim pengaduan/i }));

    await waitFor(() => {
      expect(screen.getByText(/berhasil dikirim/i)).toBeInTheDocument();
    });

    globalThis.fetch = original;
  });
});
