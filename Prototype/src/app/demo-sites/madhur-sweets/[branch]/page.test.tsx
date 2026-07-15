import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

vi.mock("next/navigation", () => ({ notFound: vi.fn() }));

import DemoBranch from "@/app/demo-sites/madhur-sweets/[branch]/page";

afterEach(cleanup);

test("identifies the fictional branch immediately and uses a real image element", async () => {
  render(await DemoBranch({ params: Promise.resolve({ branch: "dwarka" }) }));

  expect(screen.getByText("Fictional demo branch")).toBeVisible();
  expect(
    screen.getByRole("heading", { level: 1, name: "Madhur Sweets, Dwarka" }),
  ).toBeVisible();
  expect(
    screen.getByRole("img", { name: "Mithai counter at the fictional Madhur Sweets Dwarka branch" }),
  ).toBeVisible();
  expect(screen.queryByText(/freshness, generosity/i)).not.toBeInTheDocument();
});
