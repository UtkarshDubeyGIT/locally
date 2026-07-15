import Link from "next/link";

import { Badge, EmptyState } from "@/components/ui";
import { getReviews } from "@/lib/data";
import { formatDate, sourceLabel, titleCase } from "@/lib/format";

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Reviews</h1>
          <p>Draft, verify, approve, and mock publish replies.</p>
        </div>
      </div>

      {reviews.length ? (
        <div className="table-wrap">
          <table aria-label="Review queue">
            <thead>
              <tr>
                <th>Review</th>
                <th>Business</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>
                    <Link href={`/agency/reviews/${review.id}`}>
                      <strong>
                        {review.reviewer_name} · {review.rating}★
                      </strong>
                      <br />
                      <span className="muted">
                        {review.review_text.slice(0, 72)}
                        {review.review_text.length > 72 ? "…" : ""}
                      </span>
                    </Link>
                  </td>
                  <td>
                    {review.locations.clients.business_name}
                    <br />
                    <small className="muted">
                      {review.locations.name} · {formatDate(review.review_date)}
                    </small>
                  </td>
                  <td>
                    <Badge
                      tone={
                        review.severity === "high"
                          ? "bad"
                          : review.severity === "medium"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {review.severity}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      tone={
                        review.status === "mock_published"
                          ? "good"
                          : review.status === "awaiting_approval"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {titleCase(review.status)}
                    </Badge>
                  </td>
                  <td>{sourceLabel[review.source_type]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No reviews are in the queue">
          New reviews will appear here when they need an agency response.
        </EmptyState>
      )}
    </>
  );
}
