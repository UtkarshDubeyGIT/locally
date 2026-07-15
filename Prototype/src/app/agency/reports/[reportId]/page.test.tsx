import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  approveAndSendReportAction: vi.fn(),
  getReport: vi.fn(),
  saveReportSummaryAction: vi.fn(),
}));

vi.mock("@/lib/data", () => ({ getReport: mocks.getReport }));
vi.mock("@/app/actions/reports", () => ({
  approveAndSendReportAction: mocks.approveAndSendReportAction,
  saveReportSummaryAction: mocks.saveReportSummaryAction,
}));

import AgencyReport from "@/app/agency/reports/[reportId]/page";

afterEach(cleanup);

beforeEach(() => {
  mocks.getReport.mockResolvedValue({
    report: {
      id: "report-a",
      month: "2026-06-01",
      status: "draft",
      agency_summary: "Keep building response coverage.",
      metrics_json: { averageRating: 4.2, ratingChange: 0.1 },
      clients: { id: "client-a", business_name: "Madhur Sweets" },
    },
    feedback: [],
    deliveries: [],
  });
});

test("continues the report sequence for agency editing and delivery", async () => {
  const view = render(
    await AgencyReport({ params: Promise.resolve({ reportId: "report-a" }) }),
  );

  expect(
    [...view.container.querySelectorAll(".section__number")].map(
      (node) => node.textContent,
    ),
  ).toEqual(["04", "05"]);
});
