import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SettingsForm from "./SettingsForm";

describe("SettingsForm", () => {
  it("links hero subtitle validation error to its control", () => {
    render(<SettingsForm settings={{ hero_title: "Puskesmas", hero_subtitle: "", site_name: "Prapatan" }} />);

    fireEvent.click(screen.getByRole("button", { name: "Simpan Semua Pengaturan" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Periksa isian formulir.");
    expect(screen.getByLabelText("Sub-judul")).toHaveAttribute("aria-describedby", "hero_subtitle-error");
    expect(document.getElementById("hero_subtitle-error")).toHaveTextContent("expected string");
  });
});
