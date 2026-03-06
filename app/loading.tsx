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
        <div className="max-w-2xl space-y-6">
          <div className="h-14 w-72 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            <div className="h-5 w-full animate-pulse rounded bg-muted" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex gap-6 pt-2">
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>

      {/* Section skeleton */}
      <div className="mx-auto max-w-6xl px-6 pt-32">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-48 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
