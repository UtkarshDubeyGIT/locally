"use server";

import { revalidatePath } from "next/cache";
import { canApproveReply, validateReplySafety } from "@/domain/workflows";
import { requireActor } from "@/lib/auth";
import { consumeQuota, ensureQuotaAvailable } from "@/lib/integrations/quota";
import { generateReviewReply } from "@/lib/integrations/openai";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function reviewContext(reviewId:string) {
  const db=await createSupabaseServerClient();
  const {data,error}=await db.from("reviews").select("*, locations!inner(client_id), review_replies(*)").eq("id",reviewId).single();
  if(error) throw error;
  const {data:policy}=await db.from("client_policies").select("*").eq("client_id",data.locations.client_id).maybeSingle();
  return {db,review:data,reply:data.review_replies,policy};
}

export type ReviewGenerationState = {
  status?: "success" | "error";
  message?: string;
};

type GenerationStage = "authorize" | "load" | "generate" | "quota" | "save";

function safeGenerationError(stage: GenerationStage, error: unknown): ReviewGenerationState {
  const providerError = error as {
    code?: string;
    name?: string;
    request_id?: string;
    status?: number;
  };

  console.error("[review-reply-generation]", {
    code: providerError?.code,
    name: providerError?.name,
    requestId: providerError?.request_id,
    stage,
    status: providerError?.status,
  });

  if (stage === "generate") {
    return {
      status: "error",
      message: "We could not generate an AI reply right now. Try again in a moment.",
    };
  }

  if (stage === "save") {
    return {
      status: "error",
      message: "We could not save the generated reply. Try again.",
    };
  }

  if (stage === "quota") {
    return {
      status: "error",
      message: "The AI drafting limit is unavailable or has been reached. Try again later.",
    };
  }

  return {
    status: "error",
    message: "We could not prepare this review for AI drafting. Refresh and try again.",
  };
}

export async function generateReplyAction(
  _previousState: ReviewGenerationState,
  form: FormData,
): Promise<ReviewGenerationState> {
  let stage: GenerationStage = "authorize";

  try {
    const actor = await requireActor(["agency_owner", "seo_employee"]);
    const reviewId = String(form.get("reviewId") ?? "");
    if (!reviewId) {
      return { status: "error", message: "Choose a review and try again." };
    }

    stage = "load";
    const { db, review, policy } = await reviewContext(reviewId);

    stage = "quota";
    await ensureQuotaAvailable(actor, "openai");

    stage = "generate";
    const generated = await generateReviewReply({
      review: review.review_text,
      rating: review.rating,
      category: review.category,
      tone: policy?.response_tone ?? "Warm, specific, concise",
      prohibitedClaims: policy?.prohibited_claims ?? [],
      escalationCategories: policy?.escalation_categories ?? [],
    });

    stage = "quota";
    await consumeQuota(actor, "openai");

    const warnings = validateReplySafety(generated.draft);
    const escalated =
      generated.severity === "high" ||
      (policy?.escalation_categories ?? []).includes(generated.category);
    const payload = {
      review_id: reviewId,
      draft_text: generated.draft,
      final_text: generated.draft,
      analysis_json: {
        language: generated.language,
        sentiment: generated.sentiment,
        category: generated.category,
        severity: generated.severity,
        generationMs: generated.generationMs,
      },
      facts_to_verify: generated.factsToVerify,
      requires_manager_approval:
        generated.requiresManagerApproval || escalated,
      model_name: generated.model,
      prompt_version: "review-reply-v1",
      generated_at: new Date().toISOString(),
      safety_warnings: warnings,
      status: "draft" as const,
      created_by: actor.id,
    };

    stage = "save";
    const { error: replyError } = await db
      .from("review_replies")
      .upsert(payload, { onConflict: "review_id" });
    if (replyError) throw replyError;

    const { error: reviewError } = await db
      .from("reviews")
      .update({
        status: "draft",
        category: generated.category,
        severity: generated.severity,
      })
      .eq("id", reviewId);
    if (reviewError) throw reviewError;

    revalidatePath(`/agency/reviews/${reviewId}`);
    return {
      status: "success",
      message: "Your AI draft is ready for review.",
    };
  } catch (error) {
    return safeGenerationError(stage, error);
  }
}

export async function submitReplyAction(form:FormData){
  await requireActor(["agency_owner","seo_employee"]); const reviewId=String(form.get("reviewId")); const text=String(form.get("reply")??"").trim();
  if(text.length<20) throw new Error("Reply must be at least 20 characters.");
  const {db,reply}=await reviewContext(reviewId); if(!reply) throw new Error("Generate or save a draft first.");
  const warnings=validateReplySafety(text); const acknowledged=form.get("acknowledgeWarnings")==="on";
  if(warnings.length && !acknowledged) throw new Error("Acknowledge the deterministic safety warnings before submitting.");
  const actor=await requireActor(["agency_owner","seo_employee"]);
  const {error}=await db.from("review_replies").update({draft_text:text,final_text:text,status:"awaiting_approval",safety_warnings:warnings,warnings_acknowledged_at:acknowledged?new Date().toISOString():null,warnings_acknowledged_by:acknowledged?actor.id:null}).eq("id",reply.id); if(error) throw error;
  await db.from("reviews").update({status:"awaiting_approval"}).eq("id",reviewId); revalidatePath(`/agency/reviews/${reviewId}`);
}

export async function approveReplyAction(form:FormData){
  const actor=await requireActor(["agency_owner","seo_employee"]); const reviewId=String(form.get("reviewId")); const {db,review,reply,policy}=await reviewContext(reviewId); if(!reply) throw new Error("No reply to approve.");
  const escalation=(policy?.escalation_categories??[]).includes(review.category??"");
  if(!canApproveReply(actor.role,{severity:review.severity,requiresManagerApproval:reply.requires_manager_approval,escalationCategory:escalation})) throw new Error("This reply requires agency-owner approval.");
  if(Array.isArray(reply.safety_warnings)&&reply.safety_warnings.length&&!reply.warnings_acknowledged_at) throw new Error("Safety warnings must be acknowledged first.");
  await db.from("review_replies").update({status:"approved",approved_by:actor.id,approved_at:new Date().toISOString()}).eq("id",reply.id);
  await db.from("reviews").update({status:"approved"}).eq("id",reviewId); revalidatePath(`/agency/reviews/${reviewId}`);
}

export async function mockPublishReplyAction(form:FormData){
  const actor=await requireActor(["agency_owner","seo_employee"]); const reviewId=String(form.get("reviewId")); const {db,reply}=await reviewContext(reviewId); if(!reply||reply.status!=="approved") throw new Error("Only an approved reply can be mock published.");
  await db.from("review_replies").update({status:"mock_published",mock_published_by:actor.id,mock_published_at:new Date().toISOString()}).eq("id",reply.id);
  await db.from("reviews").update({status:"mock_published"}).eq("id",reviewId); revalidatePath(`/agency/reviews/${reviewId}`);
}

export async function escalateReviewAction(form:FormData){await requireActor(["agency_owner","seo_employee"]);const reviewId=String(form.get("reviewId"));const db=await createSupabaseServerClient();await db.from("reviews").update({status:"escalated",severity:"high"}).eq("id",reviewId);revalidatePath(`/agency/reviews/${reviewId}`)}
export async function addReviewNoteAction(form:FormData){const actor=await requireActor(["agency_owner","seo_employee"]);const reviewId=String(form.get("reviewId"));const note=String(form.get("note")??"").trim();if(!note)return;const db=await createSupabaseServerClient();const {error}=await db.from("review_internal_notes").insert({review_id:reviewId,created_by:actor.id,note});if(error)throw error;revalidatePath(`/agency/reviews/${reviewId}`)}
