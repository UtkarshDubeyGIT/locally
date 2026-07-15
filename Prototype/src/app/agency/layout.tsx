import { WorkspaceShell } from "@/components/workspace-shell";
import { requireActor } from "@/lib/auth";
export default async function AgencyLayout({children}:{children:React.ReactNode}) { const actor=await requireActor(["agency_owner","seo_employee"]); return <WorkspaceShell actor={actor} area="agency">{children}</WorkspaceShell>; }
