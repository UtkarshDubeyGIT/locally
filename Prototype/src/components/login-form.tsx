"use client";

import { useActionState } from "react";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { PendingButton } from "@/components/pending-button";
import { Input, Label } from "@/components/ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(loginAction, {});
  const hasError = Boolean(state.error);

  return (
    <form action={action} className="stack">
      {state.error ? (
        <div id="login-error" role="alert" className="alert alert--error">
          {state.error}
        </div>
      ) : null}
      <input type="hidden" name="next" value={next ?? ""} />
      <Label>
        Email address
        <Input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? "login-error" : undefined}
        />
      </Label>
      <Label>
        Password
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? "login-error" : undefined}
        />
      </Label>
      <PendingButton pendingLabel="Signing in...">Sign in</PendingButton>
    </form>
  );
}
