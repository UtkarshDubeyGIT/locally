import { Badge, Card } from "@/components/ui";
import { requireActor } from "@/lib/auth";
import { getClientWorkspace } from "@/lib/data";
import { titleCase } from "@/lib/format";
export default async function ClientActions(){const actor=await requireActor(["client_owner"]);if(!actor.client_id)return null;const d=await getClientWorkspace(actor.client_id);return <><div className="page-head"><div><p className="eyebrow">Visible work only</p><h1>The small moves behind better local discovery.</h1><p>Internal notes and agency-only actions stay private.</p></div></div><Card>{d.actions.map((a,i)=><div className="list-row" key={a.id}><span className="list-row__index">{String(i+1).padStart(2,"0")}</span><span><strong>{a.title}</strong><br/><small className="muted">{titleCase(a.priority)} priority</small></span><Badge tone={a.status==="done"?"good":"neutral"}>{titleCase(a.status)}</Badge></div>)}</Card></>}
