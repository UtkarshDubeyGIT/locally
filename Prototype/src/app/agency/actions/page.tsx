import {
  createManualAction,
  updateActionStatus,
} from "@/app/actions/operations";
import { PendingButton } from "@/components/pending-button";
import { Section } from "@/components/section";
import { Card, EmptyState, Input, Label, Select } from "@/components/ui";
import { getAgencyTable, getClients } from "@/lib/data";
import { formatDate, sourceLabel, titleCase } from "@/lib/format";

export default async function ActionsPage() {
  const [actions, clients] = await Promise.all([
    getAgencyTable("actions"),
    getClients(),
  ]);
  const locations = clients.flatMap((client) =>
    client.locations.map((location) => ({
      ...location,
      clientId: client.id,
      business: client.business_name,
    })),
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Actions</h1>
          <p>Track source, priority, owner, due date, visibility, and status.</p>
        </div>
      </div>

      {actions.length ? (
        <Card>
          {actions.map((action) => (
            <div
              className="list-row list-row--split"
              key={action.id}
            >
              <span>
                <strong>{action.title}</strong>
                <br />
                <span className="record-meta muted">
                  <small>{action.clients?.business_name}</small>
                  <small>{sourceLabel[action.source_type] ?? titleCase(action.source_type)}</small>
                  <small>{action.due_date ? formatDate(action.due_date) : "No due date"}</small>
                </span>
              </span>
              <form action={updateActionStatus}>
                <input type="hidden" name="id" value={action.id} />
                <Select
                  aria-label={`Status for ${action.title}`}
                  name="status"
                  defaultValue={action.status}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </Select>
                <PendingButton
                  pendingLabel="Saving status…"
                  variant="quiet"
                  style={{ marginTop: ".4rem" }}
                >
                  Save
                </PendingButton>
              </form>
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState title="No actions have been created">
          Create a manual action below or convert a finding into assigned work.
        </EmptyState>
      )}

      <Section title="Add action">
        <Card>
          <form action={createManualAction} className="form-grid">
            <Label>
              Client
              <Select name="clientId" required>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.business_name}
                  </option>
                ))}
              </Select>
            </Label>
            <Label>
              Location
              <Select name="locationId">
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.business} · {location.name}
                  </option>
                ))}
              </Select>
            </Label>
            <Label className="full">
              Action
              <Input
                name="title"
                required
                placeholder="Verify festive weekend hours"
              />
            </Label>
            <Label>
              Priority
              <Select name="priority">
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </Select>
            </Label>
            <Label>
              <span>Visibility</span>
              <span>
                <input type="checkbox" name="clientVisible" defaultChecked /> Client
                can see this action
              </span>
            </Label>
            <div className="full">
              <PendingButton pendingLabel="Creating action…">
                Create action
              </PendingButton>
            </div>
          </form>
        </Card>
      </Section>
    </>
  );
}
