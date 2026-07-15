import { WorkspaceShell } from "@/components/workspace-shell";
import { requireActor } from "@/lib/auth";
export default async function ClientLayout({children}:{children:React.ReactNode}) { const actor=await requireActor(["client_owner"]); return <WorkspaceShell actor={actor} area="client">{children}</WorkspaceShell>; }
