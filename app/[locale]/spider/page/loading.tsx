export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav skeleton */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        <div className="flex gap-4">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Page viewer skeleton */}
      <div className="mx-auto max-w-4xl px-6 pt-16">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="mb-8 h-8 w-96 animate-pulse rounded bg-muted" />
        <div className="space-y-3">
          <div className="h-5 w-full animate-pulse rounded bg-muted" />
          <div className="h-5 w-full animate-pulse rounded bg-muted" />
          <div className="h-5 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
          <div className="h-5 w-full animate-pulse rounded bg-muted" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
