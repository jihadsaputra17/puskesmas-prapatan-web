import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ConfirmDeleteButton from "./ConfirmDeleteButton";

describe("ConfirmDeleteButton", () => {
  afterEach(() => vi.restoreAllMocks());

  it("does not mutate when user cancels confirmation", () => {
    const onConfirm = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<ConfirmDeleteButton onConfirm={onConfirm} itemName="layanan" />);

    fireEvent.click(screen.getByRole("button", { name: "Hapus layanan" }));

    expect(window.confirm).toHaveBeenCalledWith("Hapus layanan? Tindakan ini tidak dapat dibatalkan.");
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("mutates only after user confirms", () => {
    const onConfirm = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<ConfirmDeleteButton onConfirm={onConfirm} itemName="jadwal" />);

    fireEvent.click(screen.getByRole("button", { name: "Hapus jadwal" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables destructive action while pending", () => {
    render(<ConfirmDeleteButton onConfirm={vi.fn()} itemName="berita" pending />);

    expect(screen.getByRole("button", { name: "Menghapus..." })).toBeDisabled();
  });
});
