import Link from "next/link";

import { createClientAction } from "@/app/actions/clients";
import { PendingButton } from "@/components/pending-button";
import { Section } from "@/components/section";
import { Badge, Card, EmptyState, Input, Label } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getClients } from "@/lib/data";
import { titleCase } from "@/lib/format";

export default async function ClientsPage() {
  const [clients, actor] = await Promise.all([
    getClients(),
    requireActor(["agency_owner", "seo_employee"]),
  ]);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Clients</h1>
          <p>Owners see every agency client. Specialists see assigned clients.</p>
        </div>
      </div>

      {clients.length ? (
        <div className="grid grid--3">
          {clients.map((client) => (
            <Link href={`/agency/clients/${client.id}`} key={client.id}>
              <Card>
                <div className="card__meta">
                  <Badge tone={client.status === "active" ? "good" : "warn"}>
                    {titleCase(client.status)}
                  </Badge>
                  <span className="muted">
                    {client.locations.length} location
                    {client.locations.length === 1 ? "" : "s"}
                  </span>
                </div>
                <h3>{client.business_name}</h3>
                <p className="muted">{client.industry}</p>
                <p style={{ marginTop: "1.5rem" }} className="eyebrow">
                  {client.client_assignments.length ? "Assigned" : "Unassigned"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No clients are visible">
          Create a client or assign one to a specialist to populate this directory.
        </EmptyState>
      )}

      {actor.role === "agency_owner" ? (
        <Section title="Add client" intro="This creates a client record without an Auth account.">
          <Card>
            <form action={createClientAction} className="form-grid">
              <Label>
                Business name
                <Input name="businessName" required />
              </Label>
              <Label>
                Industry
                <Input name="industry" required />
              </Label>
              <Label>
                Contact name
                <Input name="contactName" />
              </Label>
              <Label>
                Contact email
                <Input name="contactEmail" type="email" />
              </Label>
              <Label className="full">
                Website
                <Input name="website" type="url" />
              </Label>
              <div className="full">
                <PendingButton pendingLabel="Creating client…">
                  Create draft client
                </PendingButton>
              </div>
            </form>
          </Card>
        </Section>
      ) : null}
    </>
  );
}
