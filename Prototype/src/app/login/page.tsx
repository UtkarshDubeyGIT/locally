import { redirect } from "next/navigation";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { getActor, actorHome } from "@/lib/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const actor = await getActor();
  if (actor) redirect(actorHome(actor.role));
  const { next } = await searchParams;
  const password = process.env.DEMO_PASSWORD ?? "Ask the project owner";
  return <main className="login">
    <div className="login__visual"><div className="hero"><div><p className="eyebrow" style={{color:"inherit"}}>Your local-search workspace</p><h1>Local work, clearly managed.</h1></div></div></div>
    <section className="login__panel">
      <Link href="/" className="brand" aria-label="Locally home"><Brand /></Link>
      <h2>Welcome back.</h2>
      <p className="muted">One calm place for the reviews, listings, audits, actions and reports that move a local business forward.</p>
      <div style={{marginTop:"2rem"}}><LoginForm next={next}/></div>
      <details className="credentials">
        <summary>Demo accounts</summary>
        <div className="credentials__item"><strong>Agency owner</strong><br/>owner@locally.demo</div>
        <div className="credentials__item"><strong>SEO specialist</strong><br/>specialist@locally.demo</div>
        <div className="credentials__item"><strong>Client owner</strong><br/>client@madhursweets.demo</div>
        <div className="credentials__item"><strong>Password</strong><br/><code>{password}</code></div>
      </details>
    </section>
  </main>;
}
