import Link from "next/link";

import { Badge, EmptyState } from "@/components/ui";
import { getReportGrowth } from "@/domain/report-metrics";
import { requireActor } from "@/lib/auth";
import { getClientWorkspace } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export default async function ClientReports() {
  const actor = await requireActor(["client_owner"]);
  if (!actor.client_id) return null;

  const data = await getClientWorkspace(actor.client_id);
  const [latest, ...archive] = data.reports;

  return (
    <>
      <div className="page-head reports-page-head">
        <div>
          <p className="eyebrow">Approved monthly updates</p>
          <h1>Growth, month by month.</h1>
          <p>See what improved, what moved, and where the next month’s work is focused.</p>
        </div>
      </div>

      {latest ? (
        <LatestGrowthReport report={latest} />
      ) : (
        <EmptyState title="Your first growth report is being prepared">
          Approved monthly progress will appear here with ratings, response coverage, actions, and next steps.
        </EmptyState>
      )}

      {archive.length ? (
        <section className="report-archive" aria-labelledby="report-archive-heading">
          <div className="section__head">
            <div>
              <p className="eyebrow">Report archive</p>
              <h2 id="report-archive-heading">Earlier progress.</h2>
            </div>
          </div>
          <div className="report-archive__grid">
            {archive.map((report) => {
              const growth = getReportGrowth(report.metrics_json);
              const month = formatDate(report.month, { month: "long", year: "numeric" });
              return (
                <Link className="report-archive-card" href={`/client/reports/${report.id}`} key={report.id}>
                  <div className="report-archive-card__meta">
                    <span>{month}</span>
                    <Badge tone={report.status === "sent" ? "good" : "accent"}>{titleCase(report.status)}</Badge>
                  </div>
                  <div className="report-archive-card__rating">
                    <strong>{growth.metrics.averageRating.toFixed(1)}</strong>
                    <span>{growth.metrics.ratingChange > 0 ? "+" : ""}{growth.metrics.ratingChange.toFixed(1)} rating</span>
                  </div>
                  <p>{report.agency_summary ?? "Monthly progress summary"}</p>
                  <span className="report-archive-card__link">Read report <span aria-hidden>→</span></span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );
}

function LatestGrowthReport({ report }: { report: Awaited<ReturnType<typeof getClientWorkspace>>["reports"][number] }) {
  const growth = getReportGrowth(report.metrics_json);
  const month = formatDate(report.month, { month: "long", year: "numeric" });
  const monthName = formatDate(report.month, { month: "long" });
  const change = growth.metrics.ratingChange;
  const headline =
    change > 0
      ? `A ${change.toFixed(1)}-point step in the right direction.`
      : change < 0
        ? "A clear plan for rating recovery."
        : "A steady month with room to build.";
  const previousY = 62 - growth.previousRating * 9;
  const currentY = 62 - growth.metrics.averageRating * 9;

  return (
    <section className="report-latest" aria-label="Latest growth report">
      <div className="report-latest__copy">
        <div className="report-latest__meta">
          <Badge tone={report.status === "sent" ? "good" : "accent"}>{titleCase(report.status)}</Badge>
          <span>{month}</span>
        </div>
        <p className="eyebrow">Latest progress story</p>
        <h2>{headline}</h2>
        <p>{report.agency_summary ?? "Your agency summary and next steps will appear here."}</p>
        <Link
          className="button button--primary"
          href={`/client/reports/${report.id}`}
          aria-label={`View ${monthName} growth report`}
        >
          View growth report <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="report-latest__visual">
        <div className="report-latest__rating">
          <span>Average rating</span>
          <strong>{growth.metrics.averageRating.toFixed(1)}</strong>
          <small>{change > 0 ? "+" : ""}{change.toFixed(1)} this month</small>
        </div>
        <svg aria-hidden="true" viewBox="0 0 300 92" focusable="false">
          <line x1="24" y1="68" x2="276" y2="68" />
          <path d={`M 34 ${previousY} L 266 ${currentY}`} />
          <circle cx="34" cy={previousY} r="5" />
          <circle className="current" cx="266" cy={currentY} r="7" />
          <text x="34" y="86" textAnchor="middle">Previous</text>
          <text x="266" y="86" textAnchor="middle">Now</text>
        </svg>
        <div className="report-latest__measures">
          <span><strong>{growth.responseCoverage}%</strong> response coverage</span>
          <span><strong>{growth.actionCompletion}%</strong> actions complete</span>
          <span><strong>{Math.round(growth.metrics.websiteAuditScore)}</strong> website audit</span>
        </div>
      </div>
    </section>
  );
}
