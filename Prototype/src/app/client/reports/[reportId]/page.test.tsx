import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getReport: vi.fn(),
  saveFeedbackAction: vi.fn(),
}));

vi.mock("@/lib/data", () => ({ getReport: mocks.getReport }));
vi.mock("@/app/actions/reports", () => ({
  saveFeedbackAction: mocks.saveFeedbackAction,
}));

import ClientReport from "@/app/client/reports/[reportId]/page";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

beforeEach(() => {
  mocks.getReport.mockResolvedValue({
    report: {
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
      clients: { id: "client-a", business_name: "Madhur Sweets" },
    },
    feedback: [],
    deliveries: [],
  });
});

test("prints the visual client report through the browser print dialog", async () => {
  const print = vi.spyOn(window, "print").mockImplementation(() => undefined);

  render(
    await ClientReport({ params: Promise.resolve({ reportId: "report-a" }) }),
  );

  fireEvent.click(screen.getByRole("button", { name: "Print report" }));
  expect(print).toHaveBeenCalledOnce();
});
