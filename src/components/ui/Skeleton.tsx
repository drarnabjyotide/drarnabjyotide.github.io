import { cn } from '../../lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded-xl', className)} />
  );
}

export function MemoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function ChatSkeletonMessage() {
  return (
    <div className="flex gap-3 animate-pulse">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2 max-w-lg">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}
