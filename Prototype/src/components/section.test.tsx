import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

import { Section } from "@/components/section";

afterEach(cleanup);

test("uses the section title without decorative numbering", () => {
  const view = render(
    <Section title="Team access" intro="Manage access for agency staff.">
      <p>People</p>
    </Section>,
  );

  expect(screen.getByRole("heading", { name: "Team access" })).toBeVisible();
  expect(screen.queryByText("04")).not.toBeInTheDocument();
  expect(view.container.querySelector(".section__number")).toBeNull();
});
