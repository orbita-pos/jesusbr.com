"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_SPIDER_API || "http://localhost:8080";

interface CachedPage {
  url: string;
  title: string;
  description: string;
  body: string;
  language: string;
  page_rank: number;
  fetched_at: string;
}

export function SpiderPageViewer() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [page, setPage] = useState<CachedPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setError("No URL provided");
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/api/page?url=${encodeURIComponent(url)}`)
      .then((r) => {
        if (!r.ok) throw new Error("Page not found in index");
        return r.json();
      })
      .then((data) => {
        setPage(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 pt-32">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
          <span className="font-mono text-xs text-muted-foreground">Loading cached page...</span>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="mx-auto max-w-3xl px-6 pt-32">
        <a
          href="/spider"
          className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Spider
        </a>
        <div className="border border-border p-8 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            {error || "Page not found in index"}
          </p>
        </div>
      </div>
    );
  }

  const fetchedDate = page.fetched_at
    ? new Date(page.fetched_at).toLocaleString()
    : "Unknown";

  let domain = "";
  try {
    domain = new URL(page.url).hostname.replace("www.", "");
  } catch {
    domain = page.url;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-16 pt-28">
      {/* Top bar */}
      <div className="mb-6 flex items-center gap-4">
        <a
          href="/spider"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:text-foreground"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Spider
        </a>
        <div className="h-4 w-px bg-border" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Cached page
        </span>
      </div>

      {/* Info banner */}
      <div className="mb-8 border border-primary/20 bg-primary/[0.03] px-5 py-4">
        <p className="text-xs text-muted-foreground">
          This is a cached version of{" "}
          <span className="font-medium text-foreground">{domain}</span> saved by
          Spider on {fetchedDate}.
        </p>
        <a
          href={page.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-primary transition-colors hover:underline"
        >
          View original
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </a>
      </div>

      {/* Page content */}
      <article>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl">
          {page.title || "Untitled"}
        </h1>

        {page.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {page.description}
          </p>
        )}

        {/* Metadata */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] text-muted-foreground/60">
            {domain}
          </span>
          {page.language && (
            <>
              <div className="h-3 w-px bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                {page.language}
              </span>
            </>
          )}
          <div className="h-3 w-px bg-border" />
          <span className="font-mono text-[10px] text-muted-foreground/60">
            Crawled {fetchedDate}
          </span>
          <div className="h-3 w-px bg-border" />
          <span className="font-mono text-[10px] text-muted-foreground/60">
            PageRank {page.page_rank.toFixed(6)}
          </span>
        </div>

        <div className="my-6 h-px bg-border" />

        {/* Body text */}
        <div className="text-sm leading-7 text-foreground/80 whitespace-pre-line">
          {page.body || "No content available."}
        </div>
      </article>

      {/* Footer */}
      <div className="mt-12 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <a
            href="/spider"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to search
          </a>
          <a
            href={page.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-primary transition-colors hover:underline"
          >
            View original
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
