import { render, screen } from "@testing-library/react";
import ClinicHero from "./ClinicHero";

vi.mock("next/link", () => ({ default: ({ href, children }: { href: string; children: string }) => <a href={href}>{children}</a> }));

describe("ClinicHero", () => {
  it("uses configured identity and does not claim unknown opening hours", () => {
    render(<ClinicHero settings={{ site_name: "Puskesmas Prapatan", hero_title: "Melayani warga" }} />);
    expect(screen.getByRole("heading", { name: /puskesmas prapatan/i })).toBeVisible();
    expect(screen.queryByText(/buka|tutup/i)).not.toBeInTheDocument();
  });
});
