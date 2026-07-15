import type { PropsWithChildren, ReactNode } from "react";

export function Section({ title, intro, action, children }: PropsWithChildren<{ title: string; intro?: string; action?: ReactNode }>) {
  return <section className="section">
    <div className="section__head">
      <div><h2>{title}</h2>{intro && <p>{intro}</p>}</div>
      {action}
    </div>
    {children}
  </section>;
}
