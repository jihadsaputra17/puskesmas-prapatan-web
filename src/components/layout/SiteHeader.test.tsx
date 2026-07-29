import { fireEvent, render, screen } from "@testing-library/react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import SiteHeader from "./SiteHeader";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: LinkProps) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("SiteHeader", () => {
  it("opens and closes mobile navigation with accurate state", () => {
    render(<SiteHeader isAdmin={false} />);

    const button = screen.getByRole("button", { name: "Buka menu navigasi" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Navigasi utama" })).toBeVisible();
  });
});
