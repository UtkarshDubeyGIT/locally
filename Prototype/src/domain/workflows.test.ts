import { describe, expect, it } from "vitest";
import {
  canApproveReply,
  nextReportStatus,
  nextReviewStatus,
  validateReplySafety,
} from "@/domain/workflows";

describe("review workflow", () => {
  it("requires an owner for high-risk replies", () => {
    expect(canApproveReply("seo_employee", { severity: "high", requiresManagerApproval: false })).toBe(false);
    expect(canApproveReply("agency_owner", { severity: "high", requiresManagerApproval: false })).toBe(true);
  });

  it("allows specialists to approve low-risk replies", () => {
    expect(canApproveReply("seo_employee", { severity: "low", requiresManagerApproval: false })).toBe(true);
  });

  it("keeps approval separate from mock publishing", () => {
    expect(nextReviewStatus("awaiting_approval", "approve")).toBe("approved");
    expect(nextReviewStatus("approved", "mock_publish")).toBe("mock_published");
    expect(() => nextReviewStatus("awaiting_approval", "mock_publish")).toThrow("Invalid review transition");
  });

  it("flags unsafe promises and liability admissions", () => {
    expect(validateReplySafety("We guarantee a refund and admit this was our fault.")).toEqual([
      "compensation_promise",
      "liability_admission",
    ]);
  });
});

describe("monthly update workflow", () => {
  it("preserves approval when email delivery fails", () => {
    expect(nextReportStatus("awaiting_owner_approval", "approve")).toBe("approved");
    expect(nextReportStatus("approved", "delivery_failed")).toBe("approved");
    expect(nextReportStatus("approved", "delivery_succeeded")).toBe("sent");
  });
});
