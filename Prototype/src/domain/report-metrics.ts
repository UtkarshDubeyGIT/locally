export type BranchReportMetric = {
  location: string;
  averageRating: number;
  reviewCount?: number;
};

export type ReportMetrics = {
  reviewsReceived: number;
  reviewsReplied: number;
  averageRating: number;
  ratingChange: number;
  websiteAuditScore: number;
  openActions: number;
  completedActions: number;
  branchComparison: BranchReportMetric[];
};

const numberOrZero = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const percentage = (part: number, total: number) =>
  total > 0 ? Math.round(clamp((part / total) * 100, 0, 100)) : 0;

export function normalizeReportMetrics(raw: unknown): ReportMetrics {
  const value =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const branches = Array.isArray(value.branchComparison)
    ? value.branchComparison.flatMap((candidate) => {
        if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
          return [];
        }
        const branch = candidate as Record<string, unknown>;
        if (typeof branch.location !== "string" || !branch.location.trim()) return [];
        return [{
          location: branch.location,
          averageRating: clamp(numberOrZero(branch.averageRating), 0, 5),
          reviewCount: numberOrZero(branch.reviewCount) || undefined,
        }];
      })
    : [];

  return {
    reviewsReceived: Math.max(0, numberOrZero(value.reviewsReceived)),
    reviewsReplied: Math.max(0, numberOrZero(value.reviewsReplied)),
    averageRating: clamp(numberOrZero(value.averageRating), 0, 5),
    ratingChange: numberOrZero(value.ratingChange),
    websiteAuditScore: clamp(numberOrZero(value.websiteAuditScore), 0, 100),
    openActions: Math.max(0, numberOrZero(value.openActions)),
    completedActions: Math.max(0, numberOrZero(value.completedActions)),
    branchComparison: branches.sort(
      (left, right) => right.averageRating - left.averageRating,
    ),
  };
}

export function getReportGrowth(raw: unknown) {
  const metrics = normalizeReportMetrics(raw);
  const previousRating = clamp(
    Number((metrics.averageRating - metrics.ratingChange).toFixed(1)),
    0,
    5,
  );
  const actionTotal = metrics.completedActions + metrics.openActions;

  return {
    metrics,
    previousRating,
    responseCoverage: percentage(metrics.reviewsReplied, metrics.reviewsReceived),
    actionCompletion: percentage(metrics.completedActions, actionTotal),
  };
}
