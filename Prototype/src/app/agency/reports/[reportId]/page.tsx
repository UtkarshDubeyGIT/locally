import {
  approveAndSendReportAction,
  saveReportSummaryAction,
} from "@/app/actions/reports";
import { PendingButton } from "@/components/pending-button";
import { ReportView } from "@/components/report-view";
import { Section } from "@/components/section";
import { Badge, Card, Textarea } from "@/components/ui";
import { getReport } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export default async function AgencyReport({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  const data = await getReport(reportId);
  const report = data.report;

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">
            {formatDate(report.month, { month: "long", year: "numeric" })}
          </p>
          <h1>{report.clients.business_name} report</h1>
          <p>The metric snapshot is fixed. Edit the agency summary before approval.</p>
        </div>
        <Badge tone={report.status === "sent" ? "good" : "accent"}>
          {titleCase(report.status)}
        </Badge>
      </div>

      <ReportView metrics={report.metrics_json} summary={report.agency_summary} />

      <Section title="Agency summary and next steps">
        <Card>
          <form action={saveReportSummaryAction} className="stack">
            <input type="hidden" name="reportId" value={report.id} />
            <Textarea
              aria-label="Agency summary and next steps"
              name="summary"
              defaultValue={report.agency_summary ?? ""}
              required
            />
            <div className="row form-actions">
              <PendingButton
                variant="quiet"
                name="submit"
                value="no"
                pendingLabel="Saving draft…"
              >
                Save draft
              </PendingButton>
              <PendingButton
                name="submit"
                value="yes"
                pendingLabel="Sending for approval…"
              >
                Send to owner approval
              </PendingButton>
            </div>
          </form>
        </Card>
      </Section>

      <Section
        title="Approve and send"
        intro="Approval remains recorded if delivery fails. The report is marked sent only after Resend accepts it."
      >
        <div className="grid grid--2">
          <Card>
            <form action={approveAndSendReportAction}>
              <input type="hidden" name="reportId" value={report.id} />
              <PendingButton
                variant="secondary"
                disabled={report.status === "sent"}
                pendingLabel="Approving and sending…"
              >
                {report.status === "approved" ? "Retry delivery" : "Approve and send"}
              </PendingButton>
            </form>
          </Card>
          <Card>
            {data.deliveries.length ? (
              data.deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  style={{ padding: ".75rem 0", borderBottom: "1px solid var(--divider)" }}
                >
                  <p>
                    <strong>{titleCase(delivery.status)}</strong>
                    <br />
                    <small className="muted">
                      {formatDate(delivery.attempted_at)} ·{" "}
                      {delivery.error_message ?? delivery.provider_message_id}
                    </small>
                  </p>
                </div>
              ))
            ) : (
              <p className="muted">No delivery attempts have been recorded.</p>
            )}
          </Card>
        </div>
      </Section>
    </>
  );
}
