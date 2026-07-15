import Link from "next/link";
import { Badge, Card, Seal } from "@/components/ui";
import { Section } from "@/components/section";
import { getAgencyOverview } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";

export default async function AgencyHome() {
  const data = await getAgencyOverview();
  const needsReply = data.reviews.filter(r => r.status === "needs_reply" || r.status === "awaiting_approval");
  const due = data.actions.filter(a => a.status !== "done").slice(0,4);
  const active = data.clients.filter(c => c.status === "active").length;
  return <>
    <div className="page-head"><div><p className="eyebrow">Agency operations · {formatDate(new Date(),{weekday:"long",day:"numeric",month:"long"})}</p><h1>Good morning. Here’s what deserves attention.</h1><p>Across your assigned local businesses, a few clear moves will make the day count.</p></div><Seal>{needsReply.length}<br/>replies waiting</Seal></div>
    <div className="grid grid--4">
      <Card><p className="eyebrow">Visible clients</p><p className="card__value">{data.clients.length}</p><p className="muted">{active} active clients</p></Card>
      <Card><p className="eyebrow">Reply queue</p><p className="card__value">{needsReply.length}</p><p className="muted">{data.reviews.filter(r=>r.severity==="high").length} high-severity</p></Card>
      <Card><p className="eyebrow">Open actions</p><p className="card__value">{data.actions.filter(a=>a.status!=="done").length}</p><p className="muted">Prioritized, not overbuilt</p></Card>
      <Card><p className="eyebrow">Reports</p><p className="card__value">{data.reports.length}</p><p className="muted">{data.reports.filter(r=>r.status==="awaiting_owner_approval").length} awaiting approval</p></Card>
    </div>
    <Section number="01" title="Priority work" intro="Review due actions and pending reply decisions.">
      <div className="grid grid--2">
        <Card>{due.map((a,i)=><Link className="list-row" href="/agency/actions" key={a.id}><span className="list-row__index">0{i+1}</span><span><strong>{a.title}</strong><br/><small className="muted">Due {a.due_date ? formatDate(a.due_date) : "when ready"}</small></span><Badge tone={a.priority==="high"?"bad":"neutral"}>{a.priority}</Badge></Link>)}</Card>
        <Card>{needsReply.slice(0,4).map((r,i)=><Link className="list-row" href={`/agency/reviews/${r.id}`} key={r.id}><span className="list-row__index">0{i+1}</span><span><strong>{r.rating}★ review</strong><br/><small className="muted">{formatDate(r.review_date)}</small></span><Badge tone={r.severity==="high"?"bad":"warn"}>{titleCase(r.status)}</Badge></Link>)}</Card>
      </div>
    </Section>
    <Section number="02" title="Your client book" action={<Link className="button button--quiet" href="/agency/clients">See all clients</Link>}>
      <div className="grid grid--3">{data.clients.slice(0,6).map(c=><Link href={`/agency/clients/${c.id}`} key={c.id}><Card><div className="card__meta"><Badge tone={c.is_demo?"accent":"neutral"}>{c.is_demo?"Demo data":"Client"}</Badge><span className="muted">→</span></div><h3>{c.business_name}</h3><p className="muted">{c.industry}</p></Card></Link>)}</div>
    </Section>
  </>;
}
