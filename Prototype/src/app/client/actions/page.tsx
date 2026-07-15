import { Badge, Card, EmptyState } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getClientWorkspace } from "@/lib/data";
import { titleCase } from "@/lib/format";

export default async function ClientActions() {
  const actor = await requireActor(["client_owner"]);
  if (!actor.client_id) return null;

  const data = await getClientWorkspace(actor.client_id);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Your actions</h1>
          <p>Current client-visible work and completion status.</p>
        </div>
      </div>

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
          Client-visible work will appear here when it is assigned.
        </EmptyState>
      )}
    </>
  );
}
