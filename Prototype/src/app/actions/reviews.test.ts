import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireActor: vi.fn(),
  consumeQuota: vi.fn(),
  ensureQuotaAvailable: vi.fn(),
  generateReviewReply: vi.fn(),
  createSupabaseServerClient: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/auth", () => ({ requireActor: mocks.requireActor }));
vi.mock("@/lib/integrations/quota", () => ({
  consumeQuota: mocks.consumeQuota,
  ensureQuotaAvailable: mocks.ensureQuotaAvailable,
}));
vi.mock("@/lib/integrations/openai", () => ({ generateReviewReply: mocks.generateReviewReply }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mocks.createSupabaseServerClient,
}));

import { generateReplyAction } from "@/app/actions/reviews";

type ReviewGenerationState = {
  status?: "success" | "error";
  message?: string;
};

type GenerateReplyAction = (
  previousState: ReviewGenerationState,
  formData: FormData,
) => Promise<ReviewGenerationState>;

const runGenerateReplyAction = generateReplyAction as unknown as GenerateReplyAction;

const actor = {
  id: "10000000-0000-4000-8000-000000000001",
  agency_id: "20000000-0000-4000-8000-000000000001",
  role: "agency_owner",
};

const generatedReply = {
  language: "English",
  sentiment: "negative",
  category: "service",
  severity: "medium",
  requiresManagerApproval: false,
  factsToVerify: ["Confirm the reported wait time with the branch."],
  draft: "Thank you for sharing this. We are sorry your visit felt slow and will review the branch context.",
  generationMs: 840,
  model: "gpt-5-mini",
};

function reviewForm() {
  const formData = new FormData();
  formData.set("reviewId", "60000000-0000-4000-8000-000000000001");
  return formData;
}

function createDatabaseDouble() {
  const reviewSingle = vi.fn().mockResolvedValue({
    data: {
      id: "60000000-0000-4000-8000-000000000001",
      review_text: "Service was very slow today.",
      rating: 2,
      category: "service",
      locations: { client_id: "30000000-0000-4000-8000-000000000001" },
      review_replies: null,
    },
    error: null,
  });
  const reviewSelectEq = vi.fn().mockReturnValue({ single: reviewSingle });
  const reviewsSelect = vi.fn().mockReturnValue({ eq: reviewSelectEq });

  const policyMaybeSingle = vi.fn().mockResolvedValue({
    data: {
      response_tone: "Warm, specific, concise",
      prohibited_claims: ["guaranteed refund"],
      escalation_categories: ["safety"],
    },
    error: null,
  });
  const policySelectEq = vi.fn().mockReturnValue({ maybeSingle: policyMaybeSingle });
  const policySelect = vi.fn().mockReturnValue({ eq: policySelectEq });

  const replyUpsert = vi.fn().mockResolvedValue({ error: null });
  const reviewUpdateEq = vi.fn().mockResolvedValue({ error: null });
  const reviewsUpdate = vi.fn().mockReturnValue({ eq: reviewUpdateEq });

  const database = {
    from: vi.fn((table: string) => {
      if (table === "reviews") return { select: reviewsSelect, update: reviewsUpdate };
      if (table === "client_policies") return { select: policySelect };
      if (table === "review_replies") return { upsert: replyUpsert };
      throw new Error(`Unexpected test table: ${table}`);
    }),
  };

  return { database, replyUpsert, reviewUpdateEq, reviewsUpdate };
}

describe("generateReplyAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireActor.mockResolvedValue(actor);
    mocks.ensureQuotaAvailable.mockResolvedValue({ used: 0, limit: 20 });
    mocks.consumeQuota.mockResolvedValue({ used: 1, limit: 20 });
    mocks.generateReviewReply.mockResolvedValue(generatedReply);
  });

  it("returns an actionable, user-safe error state when OpenAI fails", async () => {
    const { database } = createDatabaseDouble();
    mocks.createSupabaseServerClient.mockResolvedValue(database);
    mocks.generateReviewReply.mockRejectedValue(
      new Error("401 invalid_api_key: sk-do-not-leak-this-provider-detail"),
    );

    const state = await runGenerateReplyAction({}, reviewForm());

    expect(state).toMatchObject({ status: "error" });
    expect(state.message).toMatch(/could not generate|unable to generate/i);
    expect(state.message).toMatch(/try again/i);
    expect(state.message).not.toContain("sk-do-not-leak-this-provider-detail");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("does not consume quota when the provider call fails", async () => {
    const { database } = createDatabaseDouble();
    mocks.createSupabaseServerClient.mockResolvedValue(database);
    mocks.generateReviewReply.mockRejectedValue(new Error("OpenAI is unavailable"));

    await runGenerateReplyAction({}, reviewForm());

    expect(mocks.generateReviewReply).toHaveBeenCalledOnce();
    expect(mocks.ensureQuotaAvailable).toHaveBeenCalledOnce();
    expect(mocks.consumeQuota).not.toHaveBeenCalled();
  });

  it("blocks over-limit users before calling OpenAI", async () => {
    const { database } = createDatabaseDouble();
    mocks.createSupabaseServerClient.mockResolvedValue(database);
    mocks.ensureQuotaAvailable.mockRejectedValue(
      new Error("Daily openai limit reached. Try again tomorrow."),
    );

    const state = await runGenerateReplyAction({}, reviewForm());

    expect(mocks.generateReviewReply).not.toHaveBeenCalled();
    expect(mocks.consumeQuota).not.toHaveBeenCalled();
    expect(state).toMatchObject({ status: "error" });
    expect(state.message).toMatch(/limit|reached|try again/i);
  });

  it("consumes quota, persists the reply, updates the review, and returns success", async () => {
    const { database, replyUpsert, reviewUpdateEq, reviewsUpdate } = createDatabaseDouble();
    mocks.createSupabaseServerClient.mockResolvedValue(database);

    const state = await runGenerateReplyAction({}, reviewForm());

    expect(mocks.consumeQuota).toHaveBeenCalledOnce();
    expect(mocks.consumeQuota).toHaveBeenCalledWith(actor, "openai");
    expect(replyUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        review_id: "60000000-0000-4000-8000-000000000001",
        draft_text: generatedReply.draft,
        model_name: "gpt-5-mini",
        status: "draft",
      }),
      { onConflict: "review_id" },
    );
    expect(reviewsUpdate).toHaveBeenCalledWith({
      status: "draft",
      category: "service",
      severity: "medium",
    });
    expect(reviewUpdateEq).toHaveBeenCalledWith(
      "id",
      "60000000-0000-4000-8000-000000000001",
    );
    expect(state).toMatchObject({ status: "success" });
    expect(state.message).toMatch(/draft.*ready/i);
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      "/agency/reviews/60000000-0000-4000-8000-000000000001",
    );
  });

  it("checks the review status write instead of reporting success after a partial save", async () => {
    const { database, reviewUpdateEq } = createDatabaseDouble();
    mocks.createSupabaseServerClient.mockResolvedValue(database);
    reviewUpdateEq.mockResolvedValue({ error: new Error("reviews update rejected") });

    const state = await runGenerateReplyAction({}, reviewForm());

    expect(state).toMatchObject({ status: "error" });
    expect(state.message).toMatch(/could not save|unable to save/i);
    expect(state.message).toMatch(/try again/i);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
