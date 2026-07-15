import Link from "next/link";

import { Badge, Card, EmptyState } from "@/components/ui";
import { getAgencyTable } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export default async function ReportsPage() {
  const reports = await getAgencyTable("monthly_updates");

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Reports</h1>
          <p>Monthly metric snapshots, approval status, and client delivery.</p>
        </div>
      </div>

      {reports.length ? (
        <div className="grid grid--2">
          {reports.map((report) => (
            <Link href={`/agency/reports/${report.id}`} key={report.id}>
              <Card>
                <div className="card__meta">
                  <Badge
                    tone={
                      report.status === "sent"
                        ? "good"
                        : report.status === "approved"
                          ? "accent"
                          : "warn"
                    }
                  >
                    {titleCase(report.status)}
                  </Badge>
                  <span className="muted">
                    {formatDate(report.month, { month: "long", year: "numeric" })}
                  </span>
                </div>
                <h3>{report.clients?.business_name}</h3>
                <p className="muted">
                  {report.agency_summary ?? "Summary not written yet."}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No monthly reports are available">
          Generated reports will appear here for drafting, approval, and delivery.
        </EmptyState>
      )}
    </>
  );
}
