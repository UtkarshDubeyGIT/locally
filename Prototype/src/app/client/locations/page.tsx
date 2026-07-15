import { Badge, Card, EmptyState } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getClientWorkspace } from "@/lib/data";
import { sourceLabel } from "@/lib/format";

export default async function ClientLocations() {
  const actor = await requireActor(["client_owner"]);
  if (!actor.client_id) return null;

  const data = await getClientWorkspace(actor.client_id);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Locations</h1>
          <p>Branch contact details and current rating snapshots.</p>
        </div>
      </div>

      {data.locations.length ? (
        <div className="grid grid--2">
          {data.locations.map((location) => {
            const performance = data.performance.find(
              (snapshot) => snapshot.location_id === location.id,
            );
            return (
              <Card key={location.id}>
                {location.image_path ? (
                  <div
                    className="branch-image"
                    role="img"
                    aria-label={`${location.name} sweet-shop vignette`}
                    style={{ backgroundImage: `url(${location.image_path})` }}
                  />
                ) : null}
                <div className="card__meta">
                  <Badge tone="accent">{sourceLabel.demo_data}</Badge>
                  <span>
                    {performance?.average_rating ?? "Not available"}
                    {performance?.average_rating === null ||
                    performance?.average_rating === undefined
                      ? ""
                      : "★"}
                  </span>
                </div>
                <h3>{location.name}</h3>
                <p className="muted">
                  {location.address}, {location.city}
                </p>
                <p style={{ marginTop: "1rem" }}>{location.phone}</p>
                {location.website_url ? (
                  <a href={location.website_url}>Visit fictional branch page →</a>
                ) : null}
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No locations are available">
          Confirmed branch details will appear here.
        </EmptyState>
      )}
    </>
  );
}
