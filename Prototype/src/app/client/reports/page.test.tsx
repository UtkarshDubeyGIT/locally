import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getClientWorkspace: vi.fn(),
  requireActor: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ requireActor: mocks.requireActor }));
vi.mock("@/lib/data", () => ({ getClientWorkspace: mocks.getClientWorkspace }));

import ClientReports from "@/app/client/reports/page";

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
  mocks.requireActor.mockResolvedValue({ client_id: "client-a", role: "client_owner" });
  mocks.getClientWorkspace.mockResolvedValue({
    reports: [
      {
        id: "report-a",
        month: "2026-06-01",
        status: "sent",
        agency_summary: "Response coverage improved across the month.",
        metrics_json: {
          reviewsReceived: 18,
          reviewsReplied: 16,
          averageRating: 4.2,
          ratingChange: 0.1,
          websiteAuditScore: 61,
          openActions: 4,
          completedActions: 5,
        },
      },
    ],
  });
});

test("leads the report archive with the latest growth story", async () => {
  render(await ClientReports());

  const latest = screen.getByRole("region", { name: "Latest growth report" });
  expect(latest).toHaveTextContent("4.2");
  expect(latest).toHaveTextContent("89% response coverage");
  expect(
    screen.getByRole("link", { name: /view june growth report/i }),
  ).toHaveAttribute("href", "/client/reports/report-a");
});
