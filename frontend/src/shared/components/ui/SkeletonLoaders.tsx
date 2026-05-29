import { Skeleton } from "./skeleton";

export const KpiSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="glass-card rounded-xl p-5 border-l-4 border-muted/50">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="w-9 h-9 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-4 w-28" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-6 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <div className="bg-muted/40 p-3 flex justify-between border-b border-border/50">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/12" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 flex justify-between items-center border-b border-border/20 last:border-0">
          <div className="flex items-center gap-3 w-1/4">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export const ProblemListSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="glass-card rounded-xl p-4 border border-border/30">
        <div className="flex items-start gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/30">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-12 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);
