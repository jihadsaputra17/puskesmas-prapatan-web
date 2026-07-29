import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import ConfirmDeleteButton from "./ConfirmDeleteButton";

describe("ConfirmDeleteButton", () => {
  afterEach(() => vi.restoreAllMocks());

  it("does not mutate before confirmation", async () => {
    const onConfirm = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<ConfirmDeleteButton onConfirm={onConfirm} itemName="layanan" />);

    fireEvent.click(screen.getByRole("button", { name: /hapus layanan/i }));

    expect(onConfirm).not.toHaveBeenCalled();
  });
});
