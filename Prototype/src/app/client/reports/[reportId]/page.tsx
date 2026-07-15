import { saveFeedbackAction } from "@/app/actions/reports";
import { PendingButton } from "@/components/pending-button";
import { PrintReportButton } from "@/components/print-report-button";
import { ReportView } from "@/components/report-view";
import { Section } from "@/components/section";
import { Badge, Card, Label, Select, Textarea } from "@/components/ui";
import { getReport } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export default async function ClientReport({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const data = await getReport(reportId);
  const report = data.report;
  const feedback = data.feedback[0];

  return (
    <>
      <div className="page-head report-page-head">
        <div>
          <p className="eyebrow">{formatDate(report.month, { month: "long", year: "numeric" })}</p>
          <h1>{report.clients.business_name}, this was your month.</h1>
          <p>A clear view of what grew, what needs attention, and where the work goes next.</p>
        </div>
        <div className="report-page-head__actions">
          <Badge tone={report.status === "sent" ? "good" : "accent"}>{titleCase(report.status)}</Badge>
          <PrintReportButton />
        </div>
      </div>

      <article className="report-sheet" aria-label={`${report.clients.business_name} monthly growth report`}>
        <ReportView metrics={report.metrics_json} summary={report.agency_summary} />
      </article>

      <div className="report-feedback">
        <Section
          number="04"
          title="Was this useful?"
          intro="You can return and update one feedback response for this report."
        >
          <Card>
            <form action={saveFeedbackAction} className="stack">
              <input type="hidden" name="reportId" value={report.id} />
              <Label>
                Usefulness
                <Select name="usefulness" defaultValue={feedback?.usefulness ?? "useful"}>
                  <option value="very_useful">Very useful</option>
                  <option value="useful">Useful</option>
                  <option value="not_useful">Not useful yet</option>
                </Select>
              </Label>
              <Label>
                What would help next month?
                <Textarea
                  name="categories"
                  defaultValue={
                    Array.isArray(feedback?.categories_json)
                      ? feedback.categories_json.join(", ")
                      : "clearer next steps"
                  }
                />
              </Label>
              <Label>
                Comment
                <Textarea name="comment" defaultValue={feedback?.comment ?? ""} />
              </Label>
              <PendingButton pendingLabel="Saving feedback...">Save feedback</PendingButton>
            </form>
          </Card>
        </Section>
      </div>
    </>
  );
}
