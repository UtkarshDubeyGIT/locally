import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { getAgencyTable } from "@/lib/data";
import { formatDate, titleCase } from "@/lib/format";
export default async function ReportsPage(){const reports=await getAgencyTable("monthly_updates");return <><div className="page-head"><div><p className="eyebrow">Monthly updates</p><h1>Useful proof, not a wall of metrics.</h1><p>One immutable metric snapshot per client and month, with one editable agency narrative.</p></div></div><div className="grid grid--2">{reports.map(r=><Link href={`/agency/reports/${r.id}`} key={r.id}><Card><div className="card__meta"><Badge tone={r.status==="sent"?"good":r.status==="approved"?"accent":"warn"}>{titleCase(r.status)}</Badge><span className="muted">{formatDate(r.month,{month:"long",year:"numeric"})}</span></div><h3>{r.clients?.business_name}</h3><p className="muted">{r.agency_summary??"Summary not written yet."}</p></Card></Link>)}</div></>}
