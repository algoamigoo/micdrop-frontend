import { Skeleton } from "@/components/ui/Skeleton";

export function ResponseSkeleton() {
  return (
    <div className="border-border bg-card rounded-lg border p-4">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="h-4 w-6" />
          <Skeleton className="size-8 rounded-md" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
