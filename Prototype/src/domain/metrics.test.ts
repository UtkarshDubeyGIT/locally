import { describe, expect, it } from "vitest";
import { assembleMonthlyMetrics } from "@/domain/metrics";

describe("assembleMonthlyMetrics", () => {
  it("calculates rating and action progress from stored records", () => {
    const result = assembleMonthlyMetrics({
      reviews: [
        { rating: 5, replied: true, location: "Dwarka" },
        { rating: 3, replied: false, location: "Noida Sector 18" },
      ],
      previousAverageRating: 3.8,
      actions: [{ status: "done" }, { status: "open" }, { status: "in_progress" }],
      latestAuditScore: 72,
    });

    expect(result).toEqual({
      reviewsReceived: 2,
      reviewsReplied: 1,
      averageRating: 4,
      ratingChange: 0.2,
      websiteAuditScore: 72,
      openActions: 2,
      completedActions: 1,
      branchComparison: [
        { location: "Dwarka", averageRating: 5, reviewCount: 1 },
        { location: "Noida Sector 18", averageRating: 3, reviewCount: 1 },
      ],
    });
  });
});
