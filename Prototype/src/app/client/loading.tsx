import { Skeleton } from "@/components/ui";

export default function ClientLoading() {
  return (
    <div className="stack" role="status" aria-live="polite">
      <span className="sr-only">Loading client workspace…</span>
      <Skeleton className="h-20" />
      <Skeleton className="h-48" />
      <div className="grid grid--2">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}
