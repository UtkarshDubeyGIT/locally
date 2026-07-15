export type UserRole = "agency_owner" | "seo_employee" | "client_owner";
export type Severity = "low" | "medium" | "high";
export type ReviewStatus =
  | "needs_reply"
  | "draft"
  | "awaiting_approval"
  | "approved"
  | "mock_published"
  | "escalated";
export type ReportStatus = "draft" | "awaiting_owner_approval" | "approved" | "sent";

export function canApproveReply(
  role: UserRole,
  risk: { severity: Severity; requiresManagerApproval: boolean; escalationCategory?: boolean },
) {
  if (role === "client_owner") return false;
  const ownerRequired =
    risk.severity === "high" || risk.requiresManagerApproval || risk.escalationCategory === true;
  return ownerRequired ? role === "agency_owner" : true;
}

const reviewTransitions: Record<string, ReviewStatus> = {
  "needs_reply:generate": "draft",
  "draft:submit": "awaiting_approval",
  "awaiting_approval:approve": "approved",
  "approved:mock_publish": "mock_published",
  "needs_reply:escalate": "escalated",
  "draft:escalate": "escalated",
};

export function nextReviewStatus(current: ReviewStatus, action: string): ReviewStatus {
  const next = reviewTransitions[`${current}:${action}`];
  if (!next) throw new Error("Invalid review transition");
  return next;
}

const reportTransitions: Record<string, ReportStatus> = {
  "draft:submit": "awaiting_owner_approval",
  "awaiting_owner_approval:approve": "approved",
  "approved:delivery_failed": "approved",
  "approved:delivery_succeeded": "sent",
};

export function nextReportStatus(current: ReportStatus, action: string): ReportStatus {
  const next = reportTransitions[`${current}:${action}`];
  if (!next) throw new Error("Invalid report transition");
  return next;
}

export type SafetyWarning =
  | "compensation_promise"
  | "liability_admission"
  | "unverified_investigation";

export function validateReplySafety(reply: string): SafetyWarning[] {
  const normalized = reply.toLowerCase();
  const warnings: SafetyWarning[] = [];
  if (/\b(guarantee|promise|issue|provide|give)\b.{0,20}\b(refund|compensation|reimbursement)\b/.test(normalized)) {
    warnings.push("compensation_promise");
  }
  if (/\b(our fault|we are liable|we admit|our negligence)\b/.test(normalized)) {
    warnings.push("liability_admission");
  }
  if (/\b(we investigated|our investigation found|we have taken action)\b/.test(normalized)) {
    warnings.push("unverified_investigation");
  }
  return warnings;
}
