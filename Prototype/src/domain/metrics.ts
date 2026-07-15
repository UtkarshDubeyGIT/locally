type ReviewMetric = { rating: number; replied: boolean; location: string };
type ActionMetric = { status: "open" | "in_progress" | "done" };

export function assembleMonthlyMetrics(input: {
  reviews: ReviewMetric[];
  previousAverageRating: number;
  actions: ActionMetric[];
  latestAuditScore: number | null;
}) {
  const average = input.reviews.length
    ? input.reviews.reduce((sum, review) => sum + review.rating, 0) / input.reviews.length
    : 0;
  const byLocation = new Map<string, number[]>();
  for (const review of input.reviews) {
    byLocation.set(review.location, [...(byLocation.get(review.location) ?? []), review.rating]);
  }

  return {
    reviewsReceived: input.reviews.length,
    reviewsReplied: input.reviews.filter((review) => review.replied).length,
    averageRating: Number(average.toFixed(2)),
    ratingChange: Number((average - input.previousAverageRating).toFixed(2)),
    websiteAuditScore: input.latestAuditScore,
    openActions: input.actions.filter((action) => action.status !== "done").length,
    completedActions: input.actions.filter((action) => action.status === "done").length,
    branchComparison: [...byLocation.entries()].map(([location, ratings]) => ({
      location,
      averageRating: Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2)),
      reviewCount: ratings.length,
    })),
  };
}
