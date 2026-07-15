"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { PendingButton } from "@/components/pending-button";
import { Alert, Input, Label } from "@/components/ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(loginAction, {});
  return <form action={action} className="stack">
    {state.error && <Alert tone="error">{state.error}</Alert>}
    <input type="hidden" name="next" value={next ?? ""}/>
    <Label>Email address<Input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></Label>
    <Label>Password<Input name="password" type="password" autoComplete="current-password" required /></Label>
    <PendingButton pendingLabel="Signing you in…">Sign in</PendingButton>
  </form>;
}
