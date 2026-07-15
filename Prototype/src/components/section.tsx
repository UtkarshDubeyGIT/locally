import type { PropsWithChildren, ReactNode } from "react";

export function Section({ number, title, intro, action, children }: PropsWithChildren<{ number?: string; title: string; intro?: string; action?: ReactNode }>) {
  return <section className="section">
    <div className="section__head">
      <div>{number && <span className="section__number">{number}</span>}<h2>{title}</h2>{intro && <p>{intro}</p>}</div>
      {action}
    </div>
    {children}
  </section>;
}
