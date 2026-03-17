import type { CSSProperties } from 'react'

interface SkeletonProps { className?: string; style?: CSSProperties }

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div className={`animate-shimmer rounded-lg ${className}`} style={style} />
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 py-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3" style={{ animationDelay: `${i * 80}ms` }}>
          <Skeleton className="h-3 w-6" />
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <div className="flex flex-1 items-center gap-2">
            <Skeleton className="h-1.5 w-16 rounded-full" />
            <Skeleton className="h-3 w-5" />
          </div>
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-6 w-14 rounded" />
        </div>
      ))}
    </div>
  )
}
