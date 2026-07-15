import { RouteLoading } from "@/components/route-loading";
import { Skeleton } from "@/components/ui";

export default function AgencyLoading() {
  return (
    <RouteLoading>
      <Skeleton className="h-12" />
      <div className="crm-metrics crm-metrics--loading">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton className="h-20" key={index} />
        ))}
      </div>
      <div className="crm-dashboard-grid">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-48" />
    </RouteLoading>
  );
}
