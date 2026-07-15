import {
  addReviewNoteAction,
  approveReplyAction,
  escalateReviewAction,
  mockPublishReplyAction,
  submitReplyAction,
} from "@/app/actions/reviews";
import { PendingButton } from "@/components/pending-button";
import { ReviewAIGenerator } from "@/components/review-ai-generator";
import { Section } from "@/components/section";
import { Badge, Card, Textarea } from "@/components/ui";
import { getReview } from "@/lib/data";
import { formatDate, sourceLabel, titleCase } from "@/lib/format";

export default async function ReviewDetail({
  params,
}: {
  params: Promise<{ reviewId: string }>;
}) {
  const { reviewId } = await params;
  const { review: r, notes } = await getReview(reviewId);
  const reply = r.review_replies;
  const facts: string[] = Array.isArray(reply?.facts_to_verify)
    ? reply.facts_to_verify.map(String)
    : [];
  const warnings: string[] = Array.isArray(reply?.safety_warnings)
    ? reply.safety_warnings.map(String)
    : [];

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">
            {r.locations.clients.business_name} · {r.locations.name}
          </p>
          <h1>
            {r.reviewer_name} left a {r.rating}-star review.
          </h1>
          <p>
            {formatDate(r.review_date)} · {sourceLabel[r.source_type]} · This
            entire workspace is hidden from client users.
          </p>
        </div>
        <Badge tone={r.severity === "high" ? "bad" : "warn"}>
          {titleCase(r.status)}
        </Badge>
      </div>

      <div className="grid grid--2">
        <Card>
          <div className="card__meta">
            <span className="stars">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </span>
            <Badge tone={r.severity === "high" ? "bad" : "neutral"}>
              {r.severity}
            </Badge>
          </div>
          <p className="review-copy">“{r.review_text}”</p>
          <p className="muted" style={{ marginTop: "1.5rem" }}>
            Category: {r.category ?? "Not classified"}
          </p>
          <form action={escalateReviewAction} style={{ marginTop: "1.5rem" }}>
            <input type="hidden" name="reviewId" value={r.id} />
            <PendingButton variant="danger" pendingLabel="Escalating review…">
              Escalate separately
            </PendingButton>
          </form>
        </Card>

        <Card>
          <p className="eyebrow">Workflow</p>
          <div className="list" style={{ marginTop: "1rem" }}>
            {[
              "Needs reply",
              "Draft",
              "Awaiting approval",
              "Approved",
              "Mock published",
            ].map((step, index) => (
              <div className="row" key={step}>
                <span>
                  {String(index + 1).padStart(2, "0")} · {step}
                </span>
                {titleCase(r.status) === step ? (
                  <Badge tone="accent">Current</Badge>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Section
        number="01"
        title="Draft with evidence in view"
        intro="Language matching and structured classification come from OpenAI; deterministic safety rules run again before approval."
      >
        {!reply ? (
          <Card className="empty">
            <p className="eyebrow">No draft yet</p>
            <h3>Start a careful response.</h3>
            <div style={{ marginTop: "1.5rem" }}>
              <ReviewAIGenerator reviewId={r.id} />
            </div>
          </Card>
        ) : (
          <div className="grid grid--2">
            <Card>
              <form action={submitReplyAction} className="stack">
                <input type="hidden" name="reviewId" value={r.id} />
                <label className="label">
                  Public reply
                  <Textarea
                    name="reply"
                    defaultValue={reply.final_text ?? reply.draft_text ?? ""}
                  />
                </label>
                {facts.length > 0 ? (
                  <div className="alert">
                    <strong>Facts to verify</strong>
                    <ul>
                      {facts.map((fact, index) => (
                        <li key={index}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {warnings.length > 0 ? (
                  <label className="alert">
                    <input
                      type="checkbox"
                      name="acknowledgeWarnings"
                      defaultChecked={Boolean(reply.warnings_acknowledged_at)}
                    />{" "}
                    I reviewed the safety warnings: {warnings.join(", ")}
                  </label>
                ) : null}
                <PendingButton
                  disabled={reply.status !== "draft"}
                  pendingLabel="Sending for approval…"
                >
                  Send for approval
                </PendingButton>
              </form>
            </Card>

            <Card className="stack">
              <div>
                <p className="eyebrow">AI provenance</p>
                <p>
                  {reply.model_name ?? "No model"} ·{" "}
                  {reply.prompt_version ?? "No prompt"}
                </p>
                <p className="muted">
                  Generated {reply.generated_at ? formatDate(reply.generated_at) : "—"}
                </p>
              </div>
              {reply.status === "draft" ? (
                <ReviewAIGenerator reviewId={r.id} regenerate />
              ) : null}
              <div>
                <p className="eyebrow">Human decisions</p>
                <p>
                  Approved: {reply.approved_at ? formatDate(reply.approved_at) : "Not yet"}
                </p>
                <p>
                  Mock published:{" "}
                  {reply.mock_published_at
                    ? formatDate(reply.mock_published_at)
                    : "Not yet"}
                </p>
              </div>
              {reply.status === "awaiting_approval" ? (
                <form action={approveReplyAction}>
                  <input type="hidden" name="reviewId" value={r.id} />
                  <PendingButton
                    variant="secondary"
                    pendingLabel="Approving reply…"
                  >
                    Approve reply
                  </PendingButton>
                </form>
              ) : null}
              {reply.status === "approved" ? (
                <form action={mockPublishReplyAction}>
                  <input type="hidden" name="reviewId" value={r.id} />
                  <PendingButton pendingLabel="Mock publishing…">
                    Confirm mock publish
                  </PendingButton>
                </form>
              ) : null}
            </Card>
          </div>
        )}
      </Section>

      <Section
        number="02"
        title="Internal notes"
        intro="These notes, the review, and all AI metadata are never selected for client users."
      >
        <div className="grid grid--2">
          <Card>
            <form action={addReviewNoteAction} className="stack">
              <input type="hidden" name="reviewId" value={r.id} />
              <label className="label">
                New note
                <Textarea
                  name="note"
                  required
                  placeholder="Record branch context or a verification request…"
                />
              </label>
              <PendingButton variant="secondary" pendingLabel="Saving note…">
                Add private note
              </PendingButton>
            </form>
          </Card>
          <Card>
            {notes.length ? (
              notes.map((note) => (
                <div className="list-row" key={note.id}>
                  <span className="list-row__index">•</span>
                  <span>
                    {note.note}
                    <br />
                    <small className="muted">
                      {note.profiles?.full_name} · {formatDate(note.created_at)}
                    </small>
                  </span>
                </div>
              ))
            ) : (
              <p className="muted">No internal notes yet.</p>
            )}
          </Card>
        </div>
      </Section>
    </>
  );
}
