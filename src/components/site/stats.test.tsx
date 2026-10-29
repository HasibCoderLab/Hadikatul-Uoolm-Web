import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { stats } from "@/content/site";
import { Stats } from "./stats";

describe("Stats", () => {
  it("renders every audited statistic", () => {
    render(<Stats />);

    for (const stat of stats) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    }
  });

  it("exposes the strip as a labelled region", () => {
    render(<Stats />);
    expect(screen.getByRole("region", { name: "পরিসংখ্যান" })).toBeInTheDocument();
  });
});
