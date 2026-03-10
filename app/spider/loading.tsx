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

      {/* Search bar skeleton */}
      <div className="mx-auto max-w-3xl px-6 pt-32 text-center">
        <div className="mx-auto mb-6 h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto mb-4 h-12 w-full animate-pulse rounded-lg bg-muted" />
        <div className="mx-auto h-4 w-64 animate-pulse rounded bg-muted" />
      </div>

      {/* Stats skeleton */}
      <div className="mx-auto flex max-w-3xl justify-center gap-8 px-6 pt-12">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
