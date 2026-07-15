"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Brand } from "@/components/brand";
import { PendingButton } from "@/components/pending-button";
import { Badge } from "@/components/ui";
import type { Profile } from "@/lib/auth";

export function WorkspaceShell({ actor, area, children }: { actor: Profile; area: "agency" | "client"; children: React.ReactNode }) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const navigationToggleRef = useRef<HTMLButtonElement>(null);
  const firstNavigationLinkRef = useRef<HTMLAnchorElement>(null);
  const wasNavigationOpen = useRef(false);
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
    if (!navigationOpen) {
      if (wasNavigationOpen.current) navigationToggleRef.current?.focus();
      wasNavigationOpen.current = false;
      return;
    }

    wasNavigationOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstNavigationLinkRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNavigationOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [navigationOpen]);

  return <div className="shell" data-area={area}>
    <header className="topbar">
      <div className="topbar__identity">
        <button
          type="button"
          ref={navigationToggleRef}
          className="nav-toggle"
          aria-controls="workspace-navigation"
          aria-expanded={navigationOpen}
          aria-label={navigationOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setNavigationOpen((open) => !open)}
        >
          {navigationOpen ? <X aria-hidden /> : <Menu aria-hidden />}
        </button>
        <Link href={`/${area}`} className="brand" aria-label="Locally home"><Brand /></Link>
        <span className="topbar__divider" aria-hidden />
        <div className="topbar__context"><span>Workspace</span><strong>{area === "agency" ? "Agency" : "Madhur Sweets"}</strong></div>
      </div>
      <div className="topnav">
        {isNavigating ? <span className="navigation-status" role="status" aria-live="polite"><span aria-hidden className="loading-indicator__dot" />Loading...</span> : null}
        <Badge>Fictional demo</Badge>
        <form action={logoutAction}><PendingButton variant="quiet" type="submit" pendingLabel="Signing out…">Sign out</PendingButton></form>
      </div>
    </header>
    <div className="workspace">
      <aside className="sidebar" id="workspace-navigation" data-open={navigationOpen}>
        <nav aria-label={`${area} navigation`}>
          {links.map(([label,href], index) => {
            const active = pathname === href || (href !== `/${area}` && pathname.startsWith(`${href}/`));
            return <Link
              key={href}
              ref={index === 0 ? firstNavigationLinkRef : undefined}
              href={href}
              aria-current={active ? "page" : undefined}
              onClick={() => {
                setPendingHref(href === pathname ? null : href);
                setNavigationOpen(false);
              }}
            ><span>{label}</span>{pendingHref === href && isNavigating ? <span className="nav-link__pending" aria-hidden>Opening</span> : null}</Link>;
          })}
        </nav>
        <div className="sidebar__footer"><strong>{actor.full_name}</strong><span>{roleLabel}</span><span>Fictional demo</span></div>
      </aside>
      {navigationOpen ? <button type="button" className="nav-scrim" aria-label="Dismiss navigation" onClick={() => setNavigationOpen(false)} /> : null}
      <main className="main">{children}</main>
    </div>
  </div>;
}
