import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { actorHome, getActor } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const actor = await getActor();
  if (actor) redirect(actorHome(actor.role));

  const { next } = await searchParams;
  const password = process.env.DEMO_PASSWORD ?? "Ask the project owner";

  return (
    <main className="login">
      <section className="login__panel" aria-labelledby="login-title">
        <Link href="/" className="brand" aria-label="Locally home">
          <Brand />
        </Link>
        <div className="login__intro">
          <h1 id="login-title">Sign in to Locally</h1>
          <p className="muted">
            Manage reviews, listings, audits, actions and approved reports in
            one workspace.
          </p>
        </div>
        <div className="login__form">
          <LoginForm next={next} />
        </div>

        <details className="credentials">
          <summary>Demo accounts</summary>
          <dl className="credentials__list">
            <div className="credentials__item">
              <dt>Agency owner</dt>
              <dd>
                <code>owner@locally.demo</code>
              </dd>
            </div>
            <div className="credentials__item">
              <dt>SEO specialist</dt>
              <dd>
                <code>specialist@locally.demo</code>
              </dd>
            </div>
            <div className="credentials__item">
              <dt>Client owner</dt>
              <dd>
                <code>client@madhursweets.demo</code>
              </dd>
            </div>
            <div className="credentials__item">
              <dt>Password</dt>
              <dd>
                <code>{password}</code>
              </dd>
            </div>
          </dl>
        </details>
      </section>

      <div className="login__visual">
        <div className="hero login__art">
          <Image
            className="login__image"
            src="/images/sweet-shop-hero.webp"
            alt="A sweet-shop worker arranging mithai in a display"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 44vw"
          />
          <span className="login__shade" aria-hidden="true" />
          <p className="login__caption">
            Reviews, actions and reports for every location.
          </p>
        </div>
      </div>
    </main>
  );
}
