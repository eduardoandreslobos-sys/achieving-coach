'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'text' | 'card';
  animation?: 'pulse' | 'shimmer' | 'none';
  style?: React.CSSProperties;
}

export function Skeleton({
  className,
  variant = 'default',
  animation = 'shimmer',
  style
}: SkeletonProps) {
  const baseClasses = 'bg-[var(--bg-tertiary)]';

  const variantClasses = {
    default: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4 w-full',
    card: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'skeleton-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

// Pre-built skeleton compositions
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]', className)}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton variant="circular" className="h-10 w-10" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div className={cn('p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]', className)}>
      <Skeleton className="h-5 w-40 mb-2" />
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="flex items-end gap-2 h-48">
        {/* Use deterministic heights based on index to avoid hydration mismatch */}
        {[65, 40, 80, 55, 90, 35, 70, 45, 85, 50].map((height, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]', className)}>
      <Skeleton className="h-5 w-40 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonBentoGrid() {
  return (
    <div className="grid grid-cols-12 gap-4 lg:gap-6">
      {/* Row 1: 4 stat cards */}
      <SkeletonCard className="col-span-12 sm:col-span-6 lg:col-span-3" />
      <SkeletonCard className="col-span-12 sm:col-span-6 lg:col-span-3" />
      <SkeletonCard className="col-span-12 sm:col-span-6 lg:col-span-3" />
      <SkeletonCard className="col-span-12 sm:col-span-6 lg:col-span-3" />

      {/* Row 2: Chart + List */}
      <SkeletonChart className="col-span-12 lg:col-span-8" />
      <SkeletonList className="col-span-12 lg:col-span-4" rows={5} />

      {/* Row 3: Full width */}
      <div className="col-span-12 p-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <Skeleton className="h-5 w-48 mb-6" />
        <div className="flex items-center justify-center gap-12">
          <Skeleton variant="circular" className="w-48 h-48" />
          <div className="flex gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-4 w-16 mx-auto" />
                <Skeleton className="h-8 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
