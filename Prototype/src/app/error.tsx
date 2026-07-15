"use client";

import { Button } from "@/components/ui";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="main">
      <div className="empty" role="alert">
        <h1>We could not load this page</h1>
        <p className="muted">Your saved work is unchanged. Try loading the page again.</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
