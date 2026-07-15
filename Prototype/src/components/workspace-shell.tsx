import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { Brand } from "@/components/brand";
import { PendingButton } from "@/components/pending-button";
import { Badge } from "@/components/ui";
import type { Profile } from "@/lib/auth";

export function WorkspaceShell({ actor, area, children }: { actor: Profile; area: "agency" | "client"; children: React.ReactNode }) {
  const agency = [
    ["Overview", "/agency"], ["Clients", "/agency/clients"], ["Reviews", "/agency/reviews"],
    ["Audits", "/agency/audits"], ["Competitors", "/agency/competitors"], ["Actions", "/agency/actions"],
    ["Reports", "/agency/reports"], ["Team", "/agency/team"],
  ];
  const client = [["Overview","/client"],["Onboarding","/client/onboarding"],["Locations","/client/locations"],["Actions","/client/actions"],["Reports","/client/reports"]];
  return <div className="shell">
    <header className="topbar"><Link href={`/${area}`} className="brand" aria-label="Locally home"><Brand /></Link><div className="topnav"><Badge tone="accent">Demo</Badge><span className="desktop-only">{actor.full_name}</span><form action={logoutAction}><PendingButton variant="quiet" type="submit" pendingLabel="Signing out…">Sign out</PendingButton></form></div></header>
    <div className="workspace"><aside className="sidebar"><nav aria-label={`${area} navigation`}>{(area === "agency" ? agency : client).map(([label,href]) => <Link key={href} href={href}>{label}</Link>)}</nav></aside><main className="main">{children}</main></div>
  </div>;
}
