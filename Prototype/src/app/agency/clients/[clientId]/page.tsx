import Link from "next/link";

import {
  addLocationAction,
  assignSpecialistAction,
  sendOnboardingInviteAction,
  updateClientStatusAction,
} from "@/app/actions/clients";
import { activateClientAction } from "@/app/actions/onboarding";
import { PendingButton } from "@/components/pending-button";
import { Section } from "@/components/section";
import { Badge, Card, EmptyState, Input, Label } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getClient, getClients, getProfiles } from "@/lib/data";
import { formatDate, sourceLabel, titleCase } from "@/lib/format";

export default async function ClientDetail({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const [data, actor, clients, profiles] = await Promise.all([
    getClient(clientId),
    requireActor(["agency_owner", "seo_employee"]),
    getClients(),
    getProfiles(),
  ]);
  const directoryClient = clients.find((client) => client.id === clientId);
  const specialist = profiles.find((profile) => profile.role === "seo_employee");
  const assigned = Boolean(
    specialist &&
      directoryClient?.client_assignments.some(
        (assignment) => assignment.user_id === specialist.id,
      ),
  );
  const goals = Array.isArray(data.client.goals)
    ? data.client.goals.join(", ")
    : "Local-search activity and client access.";

  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">{data.client.industry}</p>
          <h1>{data.client.business_name}</h1>
          <p>{goals}</p>
        </div>
        <Badge tone={data.client.status === "active" ? "good" : "warn"}>
          {titleCase(data.client.status)}
        </Badge>
      </div>

      <div className="tabs" aria-label="Client workspace">
        <Link href={`/agency/clients/${clientId}`}>Overview</Link>
        <Link href={`/agency/reviews?client=${clientId}`}>Reviews</Link>
        <Link href="/agency/audits">Audits</Link>
        <Link href="/agency/competitors">Competitors</Link>
        <Link href="/agency/actions">Actions</Link>
        <Link href="/agency/reports">Reports</Link>
      </div>

      <Section title="Locations">
        {data.locations.length ? (
          <div className="grid grid--2">
            {data.locations.map((location) => {
              const performance = data.performance.find(
                (snapshot) => snapshot.location_id === location.id,
              );
              return (
                <Card key={location.id}>
                  <div className="card__meta">
                    <Badge tone="accent">Demo data</Badge>
                    <span className="muted">{location.city}</span>
                  </div>
                  <h3>{location.name}</h3>
                  <p className="muted">{location.address}</p>
                  <div className="grid grid--2" style={{ marginTop: "1.7rem" }}>
                    <div>
                      <p className="eyebrow">Rating</p>
                      <p className="card__value">
                        {performance?.average_rating ?? "Not available"}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow">Reviews</p>
                      <p className="card__value">
                        {performance?.review_count ?? "Not available"}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No locations have been added">
            Add the first branch below to start tracking local performance.
          </EmptyState>
        )}
      </Section>

      <Section title="Open work">
        {data.actions.length ? (
          <Card>
            {data.actions.map((action) => (
              <div
                className="list-row list-row--split"
                key={action.id}
              >
                <span>
                  <strong>{action.title}</strong>
                  <br />
                  <small className="muted">
                    {sourceLabel[action.source_type] ?? titleCase(action.source_type)}
                    {action.due_date ? `, due ${formatDate(action.due_date)}` : ", no due date"}
                  </small>
                </span>
                <Badge
                  tone={
                    action.status === "done"
                      ? "good"
                      : action.priority === "high"
                        ? "bad"
                        : "neutral"
                  }
                >
                  {titleCase(action.status)}
                </Badge>
              </div>
            ))}
          </Card>
        ) : (
          <EmptyState title="No actions are assigned">
            Review, audit, and competitor findings will appear here as actions.
          </EmptyState>
        )}
      </Section>

      <Section
        title="Onboarding and access"
        intro="Agency controls are separate from the client-visible profile."
      >
        <div className="grid grid--2">
          <Card className="stack">
            <p>
              <strong>Survey:</strong>{" "}
              {titleCase(data.onboarding?.status ?? "not_started")}
            </p>
            <p>
              <strong>Current step:</strong>{" "}
              {data.onboarding?.current_step ?? "Not started"} / 4
            </p>
            <form action={sendOnboardingInviteAction}>
              <input type="hidden" name="clientId" value={clientId} />
              <PendingButton pendingLabel="Sending onboarding email…">
                Send onboarding email
              </PendingButton>
            </form>
            {actor.role === "agency_owner" ? (
              <form action={activateClientAction}>
                <input type="hidden" name="clientId" value={clientId} />
                <PendingButton variant="secondary" pendingLabel="Activating client…">
                  Confirm branches and activate
                </PendingButton>
              </form>
            ) : null}
          </Card>

          {actor.role === "agency_owner" ? (
            <Card className="stack">
              {specialist ? (
                <form action={assignSpecialistAction}>
                  <input type="hidden" name="clientId" value={clientId} />
                  <input type="hidden" name="userId" value={specialist.id} />
                  <input type="hidden" name="assigned" value={String(assigned)} />
                  <p>
                    {specialist.full_name}: {assigned ? "assigned" : "not assigned"}
                  </p>
                  <PendingButton variant="quiet" pendingLabel="Updating assignment…">
                    {assigned ? "Remove assignment" : "Assign specialist"}
                  </PendingButton>
                </form>
              ) : null}
              <form action={updateClientStatusAction}>
                <input type="hidden" name="clientId" value={clientId} />
                <input type="hidden" name="status" value="archived" />
                <PendingButton variant="danger" pendingLabel="Archiving client…">
                  Archive client
                </PendingButton>
              </form>
            </Card>
          ) : null}
        </div>
      </Section>

      <Section title="Add location">
        <Card>
          <form action={addLocationAction} className="form-grid">
            <input type="hidden" name="clientId" value={clientId} />
            <Label>
              Branch name
              <Input name="name" required />
            </Label>
            <Label>
              Category
              <Input name="category" />
            </Label>
            <Label>
              Address
              <Input name="address" required />
            </Label>
            <Label>
              City
              <Input name="city" required />
            </Label>
            <Label>
              Phone
              <Input name="phone" />
            </Label>
            <Label>
              Page URL
              <Input name="websiteUrl" />
            </Label>
            <div className="full">
              <PendingButton pendingLabel="Adding location…">
                Add location
              </PendingButton>
            </div>
          </form>
        </Card>
      </Section>
    </>
  );
}
