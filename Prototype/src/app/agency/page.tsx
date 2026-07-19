import Link from "next/link";

import { Badge, EmptyState } from "@/components/ui";
import { getAgencyOverview } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export default async function AgencyHome() {
  const data = await getAgencyOverview();
  const needsReply = data.reviews.filter(
    (review) =>
      review.status === "needs_reply" ||
      review.status === "awaiting_approval",
  );
  const openActions = data.actions.filter((action) => action.status !== "done");
  const activeClients = data.clients.filter((client) => client.status === "active");
  const activeLocations = data.locations.filter(
    (location) => location.status === "active",
  );
  const reportsAwaitingApproval = data.reports.filter(
    (report) => report.status === "awaiting_owner_approval",
  );
  const today = new Date().toISOString().slice(0, 10);
  const overdueActions = openActions.filter(
    (action) => action.due_date && action.due_date < today,
  );
  const locationById = new Map(
    data.locations.map((location) => [location.id, location]),
  );
  const clientById = new Map(
    data.clients.map((client) => [client.id, client]),
  );

  const attention = [
    ...needsReply.map((review) => {
      const location = locationById.get(review.location_id);
      const client = location ? clientById.get(location.client_id) : null;
      return {
        id: review.id,
        href: `/agency/reviews/${review.id}`,
        title: `${review.rating}★ review needs a decision`,
        meta: `${client?.business_name ?? "Client"} · ${location?.name ?? "Location"} · ${formatDate(review.review_date)}`,
        label: titleCase(review.status),
        tone: review.severity === "high" ? "bad" as const : "warn" as const,
        rank: review.severity === "high" ? 0 : 2,
      };
    }),
    ...openActions.map((action) => ({
      id: action.id,
      href: "/agency/actions",
      title: action.title,
      meta: `${clientById.get(action.client_id)?.business_name ?? "Client"} · ${action.due_date ? `Due ${formatDate(action.due_date)}` : "No due date"}`,
      label: action.due_date && action.due_date < today ? "Overdue" : `${titleCase(action.priority)} priority`,
      tone: action.due_date && action.due_date < today ? "bad" as const : action.priority === "high" ? "bad" as const : "neutral" as const,
      rank: action.due_date && action.due_date < today ? 1 : action.priority === "high" ? 2 : 3,
    })),
  ].sort((left, right) => left.rank - right.rank).slice(0, 6);

  const portfolio = data.clients.map((client) => {
    const locations = data.locations.filter(
      (location) => location.client_id === client.id,
    );
    const locationIds = new Set(locations.map((location) => location.id));
    const replyQueue = data.reviews.filter(
      (review) =>
        locationIds.has(review.location_id) &&
        (review.status === "needs_reply" ||
          review.status === "awaiting_approval"),
    ).length;
    const actions = openActions.filter(
      (action) => action.client_id === client.id,
    ).length;
    const report = data.reports.find(
      (candidate) => candidate.client_id === client.id,
    );
    return { client, locations, replyQueue, actions, report };
  });

  return <>
    <div className="page-head page-head--crm">
      <div>
        <h1>Agency overview</h1>
        <p>{formatDate(new Date(), { weekday: "long", day: "numeric", month: "long" })}. Review current queues, decisions, and client workload.</p>
      </div>
    </div>

    <section className="crm-metrics" aria-label="Portfolio metrics">
      <div className="crm-metric"><span>Visible clients</span><strong>{data.clients.length}</strong><small>{activeClients.length} active</small></div>
      <div className="crm-metric"><span>Active locations</span><strong>{activeLocations.length}</strong><small>{data.locations.length} total</small></div>
      <div className="crm-metric crm-metric--warning"><span>Reply queue</span><strong>{needsReply.length}</strong><small>{needsReply.filter((review) => review.severity === "high").length} high severity</small></div>
      <div className="crm-metric crm-metric--warning"><span>Overdue actions</span><strong>{overdueActions.length}</strong><small>{openActions.length} open total</small></div>
      <div className="crm-metric"><span>Report approvals</span><strong>{reportsAwaitingApproval.length}</strong><small>{data.reports.length} updates tracked</small></div>
    </section>

    <div className="crm-dashboard-grid">
      <section className="crm-panel">
        <div className="crm-panel__head"><div><p className="eyebrow">Triage queue</p><h2>Needs attention</h2><p>Ordered by consequence, not recency alone.</p></div><Badge tone={attention.length ? "bad" : "good"}>{attention.length} finding{attention.length === 1 ? "" : "s"}</Badge></div>
        <div className="attention-list">
          {attention.length ? attention.map((item) => <Link className="attention-row" href={item.href} key={`${item.href}-${item.id}`}>
            <span className={`attention-signal attention-signal--${item.tone}`} aria-hidden />
            <span><strong>{item.title}</strong><small>{item.meta}</small></span>
            <Badge tone={item.tone}>{item.label}</Badge>
          </Link>) : <div className="crm-empty"><strong>No urgent findings</strong><span>All current work is within its expected queue.</span></div>}
        </div>
      </section>

      <aside className="crm-panel crm-pipeline" aria-labelledby="pipeline-heading">
        <div className="crm-panel__head"><div><p className="eyebrow">Today’s flow</p><h2 id="pipeline-heading">Pipeline</h2></div></div>
        <Link className="pipeline-row" href="/agency/reviews"><span><strong>Review replies</strong><small>Needs reply or approval</small></span><b>{needsReply.length}</b></Link>
        <Link className="pipeline-row" href="/agency/actions"><span><strong>Open actions</strong><small>Across visible clients</small></span><b>{openActions.length}</b></Link>
        <Link className="pipeline-row" href="/agency/reports"><span><strong>Report approvals</strong><small>Owner decision required</small></span><b>{reportsAwaitingApproval.length}</b></Link>
        <Link className="pipeline-link" href="/agency/clients">Open client directory <span aria-hidden>→</span></Link>
      </aside>
    </div>

    <section className="section crm-portfolio">
      <div className="section__head"><div><h2>Client portfolio</h2><p>Current status and operational workload for visible clients.</p></div><Link className="button button--quiet" href="/agency/clients">Manage clients</Link></div>
      {portfolio.length ? <div className="crm-table-wrap">
        <table className="crm-table" aria-label="Client portfolio">
          <thead><tr><th>Client</th><th>Status</th><th className="numeric">Branches</th><th className="numeric">Open actions</th><th className="numeric">Reply queue</th><th>Latest report</th></tr></thead>
          <tbody>{portfolio.map(({ client, locations, actions, replyQueue, report }) => <tr key={client.id}>
            <td data-label="Client"><Link className="client-cell" href={`/agency/clients/${client.id}`}><strong>{client.business_name}</strong><small>{client.industry}</small></Link></td>
            <td data-label="Status"><Badge tone={client.status === "active" ? "good" : "warn"}>{titleCase(client.status)}</Badge></td>
            <td className="numeric" data-label="Branches">{locations.length}</td>
            <td className="numeric" data-label="Open actions">{actions}</td>
            <td className="numeric" data-label="Reply queue">{replyQueue}</td>
            <td data-label="Latest report">{report ? <span className="report-state"><strong>{formatDate(report.month, { month: "short", year: "numeric" })}</strong><small>{titleCase(report.status)}</small></span> : <span className="muted">Not created</span>}</td>
          </tr>)}</tbody>
        </table>
      </div> : <EmptyState title="No clients are visible">Clients will appear here when they are created or assigned to you.</EmptyState>}
    </section>
  </>;
}
