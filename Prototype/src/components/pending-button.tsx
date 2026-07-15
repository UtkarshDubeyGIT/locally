"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui";

type PendingButtonProps = ComponentProps<typeof Button> & {
  pendingLabel: ReactNode;
};

export function PendingButton({
  children,
  disabled,
  name,
  pendingLabel,
  value,
  ...props
}: PendingButtonProps) {
  const { data, pending } = useFormStatus();
  const isActiveSubmitter =
    pending &&
    (!name || data?.get(name) === String(value ?? ""));

  return (
    <Button
      {...props}
      aria-busy={isActiveSubmitter || undefined}
      disabled={disabled || pending}
      name={name}
      value={value}
    >
      {isActiveSubmitter ? <span aria-hidden className="button__spinner" /> : null}
      <span aria-live="polite">
        {isActiveSubmitter ? pendingLabel : children}
      </span>
    </Button>
  );
}
