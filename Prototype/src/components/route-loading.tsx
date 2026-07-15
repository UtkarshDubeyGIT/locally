import type { PropsWithChildren } from "react";

export function RouteLoading({
  asMain = false,
  children,
}: PropsWithChildren<{ asMain?: boolean }>) {
  const Tag = asMain ? "main" : "div";

  return (
    <Tag
      className={`${asMain ? "main " : ""}route-loading stack`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="loading-indicator">
        <span aria-hidden className="loading-indicator__dot" />
        Loading...
      </p>
      {children}
    </Tag>
  );
}
