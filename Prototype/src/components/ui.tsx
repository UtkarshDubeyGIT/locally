import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, PropsWithChildren, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" | "danger" }) {
  return <button className={`button button--${variant} ${className}`} {...props} />;
}
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input className={`field ${props.className ?? ""}`} {...props} />; }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`field field--textarea ${props.className ?? ""}`} {...props} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`field ${props.className ?? ""}`} {...props} />; }
export function Label({ children, ...props }: HTMLAttributes<HTMLLabelElement>) { return <label className="label" {...props}>{children}</label>; }
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={`card ${className}`} {...props} />; }
export function Badge({ tone = "neutral", children }: PropsWithChildren<{ tone?: "neutral" | "accent" | "good" | "warn" | "bad" }>) { return <span className={`badge badge--${tone}`}>{children}</span>; }
export function Alert({ tone = "info", children }: PropsWithChildren<{ tone?: "info" | "error" | "success" }>) { return <div role="status" className={`alert alert--${tone}`}>{children}</div>; }
export function EmptyState({ title, children }: PropsWithChildren<{ title: string }>) { return <Card className="empty"><p className="eyebrow">Nothing here yet</p><h3>{title}</h3><div className="muted">{children}</div></Card>; }
export function Skeleton({ className = "" }: { className?: string }) { return <span aria-hidden className={`skeleton ${className}`} />; }
export function Seal({ children }: PropsWithChildren) { return <span className="seal">{children}</span>; }
