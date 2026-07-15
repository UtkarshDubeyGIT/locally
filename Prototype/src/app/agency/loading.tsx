import { Skeleton } from "@/components/ui";

export default function AgencyLoading() {
  return (
    <div className="stack" role="status" aria-live="polite">
      <span className="sr-only">Loading agency workspace…</span>
      <Skeleton className="h-20" />
      <div className="grid grid--4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div className="grid grid--2">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
