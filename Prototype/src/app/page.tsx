import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Brand } from "@/components/brand";
import { actorHome, getActor } from "@/lib/auth";

import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "Local search, managed",
  description:
    "Manage reviews, listings, audits, actions and approved client reports across every business location.",
};

const workflow = [
  {
    title: "See what changed",
    copy: "Check new reviews, listing health and branch performance with the source and capture time attached.",
  },
  {
    title: "Assign the next action",
    copy: "Turn a useful finding into owned work with a priority, assignee and due date.",
  },
  {
    title: "Check every reply",
    copy: "Use AI for a first draft, then verify the facts, tone and risk before approval.",
  },
  {
    title: "Report approved progress",
    copy: "Give clients clear metrics, completed work and next steps without exposing internal notes.",
  },
] as const;

export default async function Home() {
  const actor = await getActor();
  if (actor) redirect(actorHome(actor.role));

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <header className={styles.header}>
        <Link href="/" className="brand" aria-label="Locally home">
          <Brand />
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <a className={styles.navText} href="#workflow">
            How it works
          </a>
        </nav>
      </header>

      <main id="main-content">
        <section className={styles.heroSection} aria-labelledby="landing-title">
          <div className={styles.heroMedia}>
            <Image
              className={styles.heroImage}
              src="/images/sweet-shop-hero.webp"
              alt="A sweet-shop worker arranging mithai in a display"
              fill
              priority
              sizes="(max-width: 720px) 100vw, 94vw"
            />
            <span className={styles.heroShade} aria-hidden="true" />

            <div className={styles.heroCopy}>
              <h1 id="landing-title" className={styles.heroTitle}>
                <span>Local search,</span> <em>managed.</em>
              </h1>
              <p className={styles.heroText}>
                Manage reviews, listings, audits, actions and monthly updates
                across every location, with people approving what gets published.
              </p>
              <Link className={styles.heroAction} href="/login">
                Sign in <span aria-hidden="true">&#8599;</span>
              </Link>
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className={styles.workflowSection}
          aria-labelledby="workflow-title"
        >
          <div className={styles.workflowIntro}>
            <h2 id="workflow-title" className={styles.sectionTitle}>
              See what changed. Decide what happens next.
            </h2>
            <p className={styles.sectionCopy}>
              Locally keeps routine work moving while your team owns every
              decision that reaches a customer or client.
            </p>
          </div>

          <ul className={styles.workflowList}>
            {workflow.map((step) => (
              <li className={styles.workflowItem} key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <h2 id="closing-title" className={styles.closingTitle}>
            AI drafts. Your team approves.
          </h2>
          <p className={styles.closingCopy}>
            Owner, specialist and client views keep private work private and
            approved progress easy to understand.
          </p>
        </section>
      </main>

      <footer className={styles.footer}>
        <span className="brand">
          <Brand />
        </span>
        <p>Madhur Sweets and all demo business data are fictional.</p>
      </footer>
    </div>
  );
}
