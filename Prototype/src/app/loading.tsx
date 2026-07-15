import { RouteLoading } from "@/components/route-loading";
import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <RouteLoading asMain>
      <Skeleton className="h-20" />
      <Skeleton className="h-48" />
      <Skeleton className="h-48" />
    </RouteLoading>
  );
}
