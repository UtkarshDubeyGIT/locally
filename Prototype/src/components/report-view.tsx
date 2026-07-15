import { Badge } from "@/components/ui";
import { getReportGrowth } from "@/domain/report-metrics";

const ratingText = (value: number) => value.toFixed(1);

function RatingMovement({ current, previous }: { current: number; previous: number }) {
  const change = Number((current - previous).toFixed(1));
  const minimum = Math.max(
    0,
    Math.floor((Math.min(previous, current) - 0.4) * 2) / 2,
  );
  const maximum = Math.min(
    5,
    Math.max(
      minimum + 0.5,
      Math.ceil((Math.max(previous, current) + 0.2) * 2) / 2,
    ),
  );
  const plotY = (value: number) =>
    172 - ((value - minimum) / (maximum - minimum)) * 116;
  const previousY = plotY(previous);
  const currentY = plotY(current);
  const direction =
    change > 0 ? "improved" : change < 0 ? "declined" : "held steady";
  const accessibleLabel =
    change === 0
      ? `Average rating held steady at ${ratingText(current)} stars this month`
      : `Average rating ${direction} from ${ratingText(previous)} to ${ratingText(current)} stars this month`;
  const headline =
    change > 0
      ? "Average rating increased"
      : change < 0
        ? "Average rating decreased"
        : "Average rating held steady";
  const delta = `${change > 0 ? "+" : ""}${change.toFixed(1)}`;

  return (
    <figure className="report-rating-chart">
      <div className="report-rating-chart__head">
        <div>
          <p className="report-label">Rating change</p>
          <h2>{headline}</h2>
        </div>
        <strong className="report-rating-chart__delta">{delta}</strong>
      </div>
      <svg role="img" aria-label={accessibleLabel} viewBox="0 0 600 220" focusable="false">
        <line className="report-rating-chart__grid" x1="54" y1="56" x2="546" y2="56" />
        <line className="report-rating-chart__grid" x1="54" y1="114" x2="546" y2="114" />
        <line className="report-rating-chart__grid" x1="54" y1="172" x2="546" y2="172" />
        <path
          className="report-rating-chart__line"
          d={`M 78 ${previousY} L 522 ${currentY}`}
        />
        <circle className="report-rating-chart__point report-rating-chart__point--past" cx="78" cy={previousY} r="8" />
        <circle className="report-rating-chart__point report-rating-chart__point--current" cx="522" cy={currentY} r="10" />
        <text className="report-rating-chart__label" x="78" y="205" textAnchor="middle">Previous</text>
        <text className="report-rating-chart__label" x="522" y="205" textAnchor="middle">This month</text>
        <text className="report-rating-chart__value" x="78" y={Math.max(30, previousY - 18)} textAnchor="middle">{ratingText(previous)}</text>
        <text className="report-rating-chart__value report-rating-chart__value--current" x="522" y={Math.max(30, currentY - 20)} textAnchor="middle">{ratingText(current)}</text>
      </svg>
      <figcaption>Stored monthly rating snapshot, Mock GBP</figcaption>
    </figure>
  );
}

function ProgressMeasure({
  label,
  value,
  detail,
  accessibleLabel,
}: {
  label: string;
  value: number;
  detail: string;
  accessibleLabel: string;
}) {
  return (
    <div className="report-progress" role="img" aria-label={accessibleLabel}>
      <div className="report-progress__head">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <svg aria-hidden="true" viewBox="0 0 100 8" preserveAspectRatio="none" focusable="false">
        <rect className="report-progress__track" x="0" y="0" width="100" height="8" rx="4" />
        <rect className="report-progress__fill" x="0" y="0" width={value} height="8" rx="4" />
      </svg>
      <small>{detail}</small>
    </div>
  );
}

export function ReportView({ metrics: raw, summary }: { metrics: unknown; summary: string | null }) {
  const { metrics, previousRating, responseCoverage, actionCompletion } =
    getReportGrowth(raw);

  return (
    <div className="report-visual">
      <section className="report-growth-section" aria-labelledby="report-growth-heading">
        <div className="report-section-title">
          <h2 id="report-growth-heading">Monthly performance</h2>
        </div>
        <div className="report-growth-board">
          <RatingMovement current={metrics.averageRating} previous={previousRating} />
          <div className="report-progress-ledger">
            <div className="report-progress-ledger__head">
              <h3>Supporting measures</h3>
            </div>
            <ProgressMeasure
              label="Reply coverage"
              value={responseCoverage}
              detail={`${metrics.reviewsReplied} of ${metrics.reviewsReceived} reviews replied to`}
              accessibleLabel={`${responseCoverage}% of reviews received a reply`}
            />
            <ProgressMeasure
              label="Actions completed"
              value={actionCompletion}
              detail={`${metrics.completedActions} done, ${metrics.openActions} open`}
              accessibleLabel={`${actionCompletion}% of actions are complete`}
            />
            <ProgressMeasure
              label="Website audit"
              value={Math.round(metrics.websiteAuditScore)}
              detail="Stored website audit score"
              accessibleLabel={`Website audit score is ${Math.round(metrics.websiteAuditScore)} out of 100`}
            />
          </div>
        </div>
      </section>

      <section className="report-narrative" aria-labelledby="report-narrative-heading">
        <div className="report-section-title">
          <h2 id="report-narrative-heading">Agency summary</h2>
        </div>
        <p>{summary ?? "A concise summary is being prepared."}</p>
      </section>

      <section className="report-branch-section" aria-label="Branch rating comparison">
        <div className="report-section-title">
          <h2>Branch ratings</h2>
          <Badge>Mock GBP</Badge>
        </div>
        <div className="report-branch-chart">
          {metrics.branchComparison.length ? (
            metrics.branchComparison.map((branch) => (
              <div className="report-branch-row" key={branch.location}>
                <span>{branch.location}</span>
                <svg aria-hidden="true" viewBox="0 0 100 10" preserveAspectRatio="none" focusable="false">
                  <rect className="report-branch-row__track" x="0" y="1" width="100" height="8" rx="4" />
                  <rect className="report-branch-row__fill" x="0" y="1" width={branch.averageRating * 20} height="8" rx="4" />
                </svg>
                <strong>{ratingText(branch.averageRating)}</strong>
              </div>
            ))
          ) : (
            <div className="report-branch-empty">
              <strong>Branch comparison wasn’t included in this snapshot.</strong>
              <p>The rating and progress measures above remain the approved record for this month.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
