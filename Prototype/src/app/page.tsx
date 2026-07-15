import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";

import { actorHome, getActor } from "@/lib/auth";
import { redirect } from "next/navigation";

import styles from "./landing.module.css";

export const metadata: Metadata = {
  title: "Local search, looked after",
  description:
    "Locally keeps reviews, listings, audits, actions and client updates moving in one calm workspace.",
};

const workflow = [
  {
    title: "See what changed",
    copy: "Reviews, listing health and branch performance arrive with their source and freshness intact.",
  },
  {
    title: "Turn signals into owned work",
    copy: "Useful findings become clear actions with a person, a priority and a next date.",
  },
  {
    title: "Review before publishing",
    copy: "AI can prepare a thoughtful reply. Your team checks the facts, tone and risk before anything moves.",
  },
  {
    title: "Share the right story",
    copy: "Clients see safe progress and approved monthly updates—not the internal work behind them.",
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
          <Link className={styles.navAction} href="/login">
            Sign in
          </Link>
        </nav>
      </header>

      <main id="main-content">
        <section className={styles.heroSection} aria-labelledby="landing-title">
          <div className={styles.heroFrame}>
            <span
              className={`${styles.heroSpine} ${styles.heroSpineLeft}`}
              aria-hidden="true"
            >
              For local-search teams
            </span>
            <span
              className={`${styles.heroSpine} ${styles.heroSpineRight}`}
              aria-hidden="true"
            >
              Human-reviewed automation
            </span>

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
                <p className={`${styles.heroEyebrow} eyebrow`}>
                  Your local-search workspace
                </p>
                <h1 id="landing-title" className={styles.heroTitle}>
                  <span>Local search,</span>{" "}
                  <em>looked after.</em>
                </h1>
                <p className={styles.heroText}>
                  One calm place for the work that helps every location show up,
                  respond well and keep improving.
                </p>
              </div>

              <div className={styles.heroAction}>
                <Link
                  className={`seal ${styles.heroSeal}`}
                  href="/login"
                  aria-label="Enter the workspace"
                >
                  Enter
                  <span>the workspace</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>

            <p className={styles.heroCaption}>
              Reviews, listings, audits, actions and monthly updates—held
              together without losing the human judgement behind the work.
            </p>
          </div>
        </section>

        <section
          id="workflow"
          className={styles.workflowSection}
          aria-labelledby="workflow-title"
        >
          <div className={styles.workflowIntro}>
            <p className="eyebrow">From signal to story</p>
            <div>
              <h2 id="workflow-title" className={styles.sectionTitle}>
                The work stays human. The repetition doesn&apos;t.
              </h2>
              <p className={styles.sectionCopy}>
                Locally keeps the routine moving while every consequential
                decision stays with the people who know the business.
              </p>
            </div>
          </div>

          <ol className={styles.workflowList}>
            {workflow.map((step, index) => (
              <li className={styles.workflowItem} key={step.title}>
                <span className={styles.workflowIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.closing} aria-labelledby="closing-title">
          <div>
            <p className="eyebrow">A quieter operating rhythm</p>
            <h2 id="closing-title" className={styles.closingTitle}>
              Automation prepares. People decide.
            </h2>
            <p className={styles.closingCopy}>
              Explore Locally through the owner, specialist and client views.
              Every demo record is clearly labelled and safe to try.
            </p>
          </div>

          <div className={styles.closingAction}>
            <span className={styles.sweetTray} aria-hidden="true">
              <span
                className={`${styles.sweet} ${styles.sweetRound}`}
                data-sweet-motion
                aria-hidden="true"
              />
              <span
                className={`${styles.sweet} ${styles.sweetDiamond}`}
                data-sweet-motion
                aria-hidden="true"
              />
              <span
                className={`${styles.sweet} ${styles.sweetSquare}`}
                data-sweet-motion
                aria-hidden="true"
              />
            </span>
            <Link className="button button--primary" href="/login">
              Open Locally <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span className="brand"><Brand /></span>
        <p>A calm operating system for local-search work.</p>
        <p>Fictional businesses. Real workflows.</p>
      </footer>
    </div>
  );
}
