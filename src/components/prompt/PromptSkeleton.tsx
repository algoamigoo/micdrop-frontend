import { Skeleton } from "@/components/ui/Skeleton";

export function PromptSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
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
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}