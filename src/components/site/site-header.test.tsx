import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { SiteHeader } from "@/components/site/site-header";

vi.mock("next/image", () => ({
  default: () => <span data-testid="next-image" aria-hidden="true" />,
}));

vi.mock("next/link", () => ({
  default: ({ children, ...props }: ComponentProps<"a">) => <a {...props}>{children}</a>,
}));

describe("SiteHeader", () => {
  it("opens the mobile menu, closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);

    const trigger = screen.getByRole("button", { name: "মেনু খুলুন" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "মোবাইল মেনু" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "মোবাইল মেনু" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("renders no dead anchors", () => {
    render(<SiteHeader />);
    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link.getAttribute("href")).not.toBe("#");
    }
  });
});
