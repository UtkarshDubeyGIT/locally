"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/actions/auth";
import { Brand } from "@/components/brand";
import { PendingButton } from "@/components/pending-button";
import { Badge } from "@/components/ui";
import type { Profile } from "@/lib/auth";

export function WorkspaceShell({ actor, area, children }: { actor: Profile; area: "agency" | "client"; children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const agency = [
    ["Overview", "/agency"], ["Clients", "/agency/clients"], ["Reviews", "/agency/reviews"],
    ["Audits", "/agency/audits"], ["Competitors", "/agency/competitors"], ["Actions", "/agency/actions"],
    ["Reports", "/agency/reports"], ["Team", "/agency/team"],
  ];
  const client = [["Overview","/client"],["Onboarding","/client/onboarding"],["Locations","/client/locations"],["Actions","/client/actions"],["Reports","/client/reports"]];
  const links = area === "agency" ? agency : client;
  const isNavigating = pendingHref !== null && pendingHref !== pathname;
  const roleLabel = actor.role.replaceAll("_", " ");

  useEffect(() => {
    if (!navigationOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavigationOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [navigationOpen]);

  return <div className="shell" data-area={area}>
    <header className="topbar">
      <div className="topbar__identity">
        <button
          type="button"
          className="nav-toggle"
          aria-controls="workspace-navigation"
          aria-expanded={navigationOpen}
          aria-label={navigationOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setNavigationOpen((open) => !open)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
            {navigationOpen
              ? <path d="m6 6 12 12M18 6 6 18" />
              : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        <Link href={`/${area}`} className="brand" aria-label="Locally home"><Brand /></Link>
        <span className="topbar__divider" aria-hidden />
        <div className="topbar__context"><span>{area === "agency" ? "Agency CRM" : "Client portal"}</span><strong>{area === "agency" ? "Operations desk" : "Madhur Sweets"}</strong></div>
      </div>
      <div className="topnav">
        {isNavigating ? <span className="navigation-status" role="status" aria-live="polite"><span aria-hidden className="loading-indicator__dot" />Loading...</span> : null}
        <Badge tone="accent">Demo data</Badge>
        <span className="desktop-only">{actor.full_name}</span>
        <form action={logoutAction}><PendingButton variant="quiet" type="submit" pendingLabel="Signing out…">Sign out</PendingButton></form>
      </div>
    </header>
    <div className="workspace">
      <aside className="sidebar" id="workspace-navigation" data-open={navigationOpen}>
        <div className="workspace-context"><span className="eyebrow">{area} workspace</span><strong>{actor.full_name}</strong><span>{roleLabel}</span></div>
        <nav aria-label={`${area} navigation`}>
          {links.map(([label,href]) => {
            const active = pathname === href || (href !== `/${area}` && pathname.startsWith(`${href}/`));
            return <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                setPendingHref(href === pathname ? null : href);
                setNavigationOpen(false);
              }}
            ><span>{label}</span>{pendingHref === href && isNavigating ? <span className="nav-link__pending" aria-hidden>•••</span> : null}</Link>;
          })}
        </nav>
        <div className="sidebar__footer"><span className="status-dot" aria-hidden /><span>Workspace ready</span></div>
      </aside>
      {navigationOpen ? <button type="button" className="nav-scrim" aria-label="Dismiss navigation" onClick={() => setNavigationOpen(false)} /> : null}
      <main className="main">{children}</main>
    </div>
  </div>;
}
