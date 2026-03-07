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

      {/* Hero skeleton */}
      <div className="mx-auto max-w-6xl px-6 pt-32">
        <div className="mb-8 h-4 w-28 animate-pulse rounded bg-muted" />
        <div className="h-14 w-72 animate-pulse rounded bg-muted" />
        <div className="mt-6 max-w-2xl space-y-3">
          <div className="h-5 w-full animate-pulse rounded bg-muted" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-4 flex gap-3">
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Drop zone skeleton */}
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex items-center justify-center border-2 border-dashed border-border p-16">
          <div className="h-5 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
