import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getClientWorkspace: vi.fn(),
  requireActor: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireActor: mocks.requireActor }));
vi.mock("@/lib/data", () => ({ getClientWorkspace: mocks.getClientWorkspace }));

import ClientHome from "@/app/client/page";

afterEach(cleanup);

beforeEach(() => {
  mocks.requireActor.mockResolvedValue({ client_id: "client-a" });
  mocks.getClientWorkspace.mockResolvedValue({
    performance: [
      { location_id: "location-a", review_count: 121, average_rating: 4.2 },
      { location_id: "location-b", review_count: 97, average_rating: 4.4 },
    ],
    actions: [
      { id: "action-a", title: "Confirm festive hours", priority: "high", status: "open" },
      { id: "action-b", title: "Add click-to-call tracking", priority: "medium", status: "done" },
    ],
    reports: [
      { id: "report-a", agency_summary: "Response coverage improved this month." },
    ],
  });
});

test("presents the client home as a factual account overview", async () => {
  const view = render(await ClientHome());

  expect(
    screen.getByRole("heading", { level: 1, name: "Madhur Sweets overview" }),
  ).toBeVisible();
  expect(screen.getByRole("region", { name: "Branch metrics" })).toHaveClass(
    "client-metrics",
  );
  expect(screen.getByRole("heading", { name: "Current actions" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "Latest report" })).toBeVisible();
  expect(screen.queryByText(/moving in the right direction/i)).not.toBeInTheDocument();
  expect(view.container.querySelector(".seal")).toBeNull();
  expect(view.container.querySelector(".section__number")).toBeNull();
});
