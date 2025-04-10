import { Skeleton } from "@/components/ui/skeleton"

export function MessageSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="mt-2 space-y-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  )
}
