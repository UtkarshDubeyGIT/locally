import { resetDemoAction } from "@/app/actions/clients";
import { toggleSpecialistAction } from "@/app/actions/operations";
import { PendingButton } from "@/components/pending-button";
import { Badge, Card, EmptyState } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getProfiles } from "@/lib/data";
import { titleCase } from "@/lib/format";

export default async function TeamPage() {
  const actor = await requireActor(["agency_owner", "seo_employee"]);
  const people = await getProfiles();

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Team and access</h1>
          <p>Review roles and manage specialist access.</p>
        </div>
      </div>

      {people.length ? (
        <div className="grid grid--3">
          {people.map((person) => (
            <Card key={person.id}>
              <div className="card__meta">
                <Badge tone={person.active ? "good" : "bad"}>
                  {person.active ? "Active" : "Inactive"}
                </Badge>
                <span className="muted">{titleCase(person.role)}</span>
              </div>
              <h3>{person.full_name}</h3>
              {actor.role === "agency_owner" && person.role === "seo_employee" ? (
                <form action={toggleSpecialistAction} style={{ marginTop: "1.5rem" }}>
                  <input type="hidden" name="id" value={person.id} />
                  <input type="hidden" name="active" value={String(person.active)} />
                  <PendingButton
                    variant="quiet"
                    pendingLabel={person.active ? "Deactivating…" : "Activating…"}
                  >
                    {person.active ? "Deactivate" : "Activate"} specialist
                  </PendingButton>
                </form>
              ) : null}
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No team profiles are available">
          Agency users will appear here after their profile is created.
        </EmptyState>
      )}

      {actor.role === "agency_owner" ? (
        <section className="section">
          <Card>
            <p className="eyebrow">Demo data control</p>
            <h3 style={{ margin: ".5rem 0" }}>Reset Madhur Sweets demo records</h3>
            <p className="muted">
              This changes only fixed seeded demo records. Other client records are not
              affected.
            </p>
            <form action={resetDemoAction} style={{ marginTop: "1rem" }}>
              <PendingButton variant="danger" pendingLabel="Resetting demo records…">
                Reset demo records
              </PendingButton>
            </form>
          </Card>
        </section>
      ) : null}
    </>
  );
}
