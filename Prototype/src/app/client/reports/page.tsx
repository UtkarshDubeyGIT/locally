import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getClientWorkspace } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";
export default async function ClientReports(){const actor=await requireActor(["client_owner"]);if(!actor.client_id)return null;const d=await getClientWorkspace(actor.client_id);return <><div className="page-head"><div><p className="eyebrow">Approved updates</p><h1>The progress story, month by month.</h1><p>Draft reports are blocked by row-level security and never reach this page.</p></div></div><div className="grid grid--2">{d.reports.map(r=><Link href={`/client/reports/${r.id}`} key={r.id}><Card><div className="card__meta"><Badge tone={r.status==="sent"?"good":"accent"}>{titleCase(r.status)}</Badge><span className="muted">{formatDate(r.month,{month:"long",year:"numeric"})}</span></div><p className="review-copy">“{r.agency_summary}”</p></Card></Link>)}</div></>}
