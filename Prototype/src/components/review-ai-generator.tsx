"use client";

import { useActionState } from "react";

import {
  generateReplyAction,
  type ReviewGenerationState,
} from "@/app/actions/reviews";
import { PendingButton } from "@/components/pending-button";
import { Alert } from "@/components/ui";

const initialState: ReviewGenerationState = {};

export function ReviewAIGenerator({
  reviewId,
  regenerate = false,
}: {
  reviewId: string;
  regenerate?: boolean;
}) {
  const [state, action] = useActionState(generateReplyAction, initialState);

  return (
    <form action={action} className="stack">
      <input type="hidden" name="reviewId" value={reviewId} />
      {state.message ? (
        <Alert tone={state.status === "error" ? "error" : "success"}>
          {state.message}
        </Alert>
      ) : null}
      <PendingButton pendingLabel="Drafting a safe reply…">
        {regenerate ? "Regenerate with AI" : "Generate with AI"}
      </PendingButton>
    </form>
  );
}
