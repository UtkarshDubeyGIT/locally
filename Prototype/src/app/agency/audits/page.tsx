import { runAuditAction } from "@/app/actions/operations";
import { PendingButton } from "@/components/pending-button";
import { Section } from "@/components/section";
import { Badge, Card, EmptyState, Label, Select } from "@/components/ui";
import { getAgencyTable, getClients } from "@/lib/data";
import { formatDate, sourceLabel } from "@/lib/format";

export default async function AuditsPage() {
  const [audits, clients] = await Promise.all([
    getAgencyTable("website_audits"),
    getClients(),
  ]);
  const locations = clients.flatMap((client) =>
    client.locations.map((location) => ({
      ...location,
      business: client.business_name,
    })),
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Site audits</h1>
          <p>PageSpeed scores and local SEO checks for registered branch pages.</p>
        </div>
      </div>

      {audits.length ? (
        <div className="grid grid--2">
          {audits.map((audit) => (
            <Card key={audit.id}>
              <div className="card__meta">
                <Badge tone={audit.source_type === "live_api" ? "good" : "accent"}>
                  {sourceLabel[audit.source_type]}
                </Badge>
                <span className="muted">{formatDate(audit.created_at)}</span>
              </div>
              <h3>
                {audit.locations.clients?.business_name} · {audit.locations.name}
              </h3>
              <p className="muted">{audit.strategy} strategy</p>
              <div className="grid grid--4" style={{ marginTop: "1.7rem" }}>
                <AuditScore label="Performance" value={audit.performance_score} />
                <AuditScore label="Accessibility" value={audit.accessibility_score} />
                <AuditScore label="SEO" value={audit.seo_score} />
                <AuditScore label="Best practices" value={audit.best_practices_score} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No site audits have been run">
          Select a registered branch page below to record the first PageSpeed result.
        </EmptyState>
      )}

      <Section
        title="Run site audit"
        intro="Failed provider requests are not presented as live results and can be retried."
      >
        <Card>
          <form action={runAuditAction} className="form-grid">
            <Label>
              Registered branch page
              <Select name="locationId">
                {locations
                  .filter((location) => location.website_url)
                  .map((location) => (
                    <option value={location.id} key={location.id}>
                      {location.business} · {location.name}
                    </option>
                  ))}
              </Select>
            </Label>
            <Label>
              Strategy
              <Select name="strategy">
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
              </Select>
            </Label>
            <div className="full">
              <PendingButton pendingLabel="Running PageSpeed…">
                Run PageSpeed
              </PendingButton>
            </div>
          </form>
        </Card>
      </Section>
    </>
  );
}

function AuditScore({ label, value }: { label: string; value: number | null }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="card__value" aria-label={value === null ? `${label} not available` : undefined}>
        {value ?? "N/A"}
      </p>
    </div>
  );
}
