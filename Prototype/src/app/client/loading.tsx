import { RouteLoading } from "@/components/route-loading";
import { Skeleton } from "@/components/ui";

export default function ClientLoading() {
  return (
    <RouteLoading>
      <Skeleton className="h-20" />
      <Skeleton className="h-48" />
      <div className="grid grid--2">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </RouteLoading>
  );
}
