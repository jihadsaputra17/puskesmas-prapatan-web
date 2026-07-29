import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PengaduanForm from "./PengaduanForm";

describe("PengaduanForm", () => {
  it("exposes labelled required fields", () => {
    render(<PengaduanForm />);

    expect(screen.getByLabelText(/nama lengkap/i)).toBeRequired();
    expect(screen.getByLabelText(/isi pengaduan/i)).toBeRequired();
    fireEvent.click(screen.getByRole("button", { name: /kirim pengaduan/i }));
  });
});
