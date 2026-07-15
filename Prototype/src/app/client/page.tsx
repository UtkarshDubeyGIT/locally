import Link from "next/link";

import { Section } from "@/components/section";
import { Badge, Card, EmptyState } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getClientWorkspace } from "@/lib/data";
import { sourceLabel, titleCase } from "@/lib/format";

export default async function ClientHome() {
  const actor = await requireActor(["client_owner"]);
  if (!actor.client_id) return null;

  const data = await getClientWorkspace(actor.client_id);
  const latestPerformance = data.performance.slice(0, 4);
  const totalReviews = latestPerformance.reduce(
    (sum, snapshot) => sum + snapshot.review_count,
    0,
  );
  const averageRating = latestPerformance.length
    ? latestPerformance.reduce(
        (sum, snapshot) => sum + (snapshot.average_rating ?? 0),
        0,
      ) / latestPerformance.length
    : 0;
  const openActions = data.actions.filter((action) => action.status !== "done");

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">Fictional demo business</p>
          <h1>Madhur Sweets overview</h1>
          <p>Current branch performance, client-visible actions, and approved reports.</p>
        </div>
      </div>

      <section className="client-metrics" aria-label="Branch metrics">
        <div className="client-metric">
          <p className="eyebrow">Average rating</p>
          <p className="card__value">{averageRating.toFixed(1)}★</p>
          <p className="muted">{sourceLabel.mock_gbp}</p>
        </div>
        <div className="client-metric">
          <p className="eyebrow">Reviews</p>
          <p className="card__value">{totalReviews.toLocaleString("en-IN")}</p>
          <p className="muted">Across four demo branches</p>
        </div>
        <div className="client-metric">
          <p className="eyebrow">Open actions</p>
          <p className="card__value">{openActions.length}</p>
          <p className="muted">Client-visible work</p>
        </div>
      </section>

      <Section title="Current actions">
        {data.actions.length ? (
          <Card>
            {data.actions.slice(0, 5).map((action) => (
              <div
                className="list-row list-row--split"
                key={action.id}
              >
                <span>
                  <strong>{action.title}</strong>
                  <br />
                  <small className="muted">{titleCase(action.priority)} priority</small>
                </span>
                <Badge tone={action.status === "done" ? "good" : "neutral"}>
                  {titleCase(action.status)}
                </Badge>
              </div>
            ))}
          </Card>
        ) : (
          <EmptyState title="No actions are available">
            Client-visible actions will appear here when the agency creates them.
          </EmptyState>
        )}
      </Section>

      <Section
        title="Latest report"
        action={
          <Link className="button button--quiet" href="/client/reports">
            All reports
          </Link>
        }
      >
        {data.reports[0] ? (
          <Link href={`/client/reports/${data.reports[0].id}`}>
            <Card>
              <Badge tone="accent">Approved report</Badge>
              <p className="review-copy" style={{ marginTop: "1.2rem" }}>
                {data.reports[0].agency_summary}
              </p>
            </Card>
          </Link>
        ) : (
          <EmptyState title="No approved reports yet">
            Your first approved monthly report will appear here.
          </EmptyState>
        )}
      </Section>
    </>
  );
}
