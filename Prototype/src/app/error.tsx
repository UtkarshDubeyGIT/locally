"use client";
import { Button } from "@/components/ui";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="main"><div className="card empty"><p className="eyebrow">Something went wrong</p><h3>That workspace view could not load.</h3><p className="muted">Your saved work is unchanged. It is safe to retry.</p><Button onClick={reset}>Try again</Button></div></main>; }
