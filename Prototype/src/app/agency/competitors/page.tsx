import {
  addManualCompetitorAction,
  findCompetitorsAction,
} from "@/app/actions/operations";
import { PendingButton } from "@/components/pending-button";
import { Section } from "@/components/section";
import {
  Badge,
  Card,
  EmptyState,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui";
import { getAgencyTable, getClients } from "@/lib/data";
import { formatDate, sourceLabel } from "@/lib/format";

export default async function CompetitorsPage() {
  const [competitors, clients] = await Promise.all([
    getAgencyTable("competitors"),
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
          <h1>Competitors</h1>
          <p>Nearby businesses, ratings, distance, source, and capture date.</p>
        </div>
      </div>

      {competitors.length ? (
        <div className="grid grid--3">
          {competitors.map((competitor) => (
            <Card key={competitor.id}>
              <div className="card__meta">
                <Badge
                  tone={competitor.source_type === "live_api" ? "good" : "accent"}
                >
                  {sourceLabel[competitor.source_type]}
                </Badge>
                <span>
                  {competitor.rating ? `${competitor.rating}★` : "Not available"}
                </span>
              </div>
              <h3>{competitor.name}</h3>
              <p className="muted">{competitor.address}</p>
              <p style={{ marginTop: "1rem" }}>
                {competitor.distance_km
                  ? `${competitor.distance_km} km from branch`
                  : "Distance unavailable"}
              </p>
              {competitor.google_maps_uri ? (
                <a href={competitor.google_maps_uri} target="_blank" rel="noreferrer">
                  View on Google Maps ↗
                </a>
              ) : null}
              <p className="eyebrow" style={{ marginTop: "1.2rem" }}>
                Captured {formatDate(competitor.captured_at)}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="No competitors have been recorded">
          Search Google Places or add a manual competitor below.
        </EmptyState>
      )}

      <p className="muted" style={{ marginTop: "1rem" }}>
        Live place data and Maps links are attributed to Google. Demo and manual
        entries are labelled separately.
      </p>

      <Section title="Add competitor data">
        <div className="grid grid--2">
          <Card>
            <form action={findCompetitorsAction} className="stack">
              <Label>
                Branch
                <Select name="locationId">
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.business} · {location.name}
                    </option>
                  ))}
                </Select>
              </Label>
              <Label>
                Places query
                <Input
                  name="query"
                  required
                  placeholder="sweet shops near Sector 18 Noida"
                />
              </Label>
              <PendingButton pendingLabel="Searching nearby places…">
                Search Places and save
              </PendingButton>
            </form>
          </Card>

          <Card>
            <form action={addManualCompetitorAction} className="stack">
              <Label>
                Branch
                <Select name="locationId">
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.business} · {location.name}
                    </option>
                  ))}
                </Select>
              </Label>
              <Label>
                Name
                <Input name="name" required />
              </Label>
              <Label>
                Address
                <Input name="address" />
              </Label>
              <Label>
                Analyst note
                <Textarea name="note" />
              </Label>
              <PendingButton variant="secondary" pendingLabel="Saving competitor…">
                Add manual competitor
              </PendingButton>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
