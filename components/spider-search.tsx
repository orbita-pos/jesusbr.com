"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──

interface SearchResult {
  url: string;
  title: string;
  snippet: string;
  score: number;
  featured: boolean;
  fetched_at: string;
}

interface SearchResponse {
  query: string;
  corrected?: string;
  featured: SearchResult[];
  results: SearchResult[];
  total: number;
  time_ms: number;
  page: number;
  per_page: number;
}

interface StatsResponse {
  pages_indexed: number;
  terms: number;
  avg_page_rank: number;
  last_crawl: string;
}

// ── Config ──

const API_BASE = "";

// ── Component ──

export function SpiderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  // ── Check API health ──

  useEffect(() => {
    fetch(`/api/spider/stats`, { signal: AbortSignal.timeout(15000) })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setStats(data);
        setApiOnline(true);
      })
      .catch(() => setApiOnline(false));
  }, []);

  // ── Search ──

  const search = useCallback(
    async (q: string, p: number = 1) => {
      if (!q.trim()) return;
      setLoading(true);
      setShowSuggestions(false);
      try {
        const res = await fetch(
          `/api/spider/search?q=${encodeURIComponent(q)}&page=${p}`
        );
        if (res.ok) {
          const data: SearchResponse = await res.json();
          setResults(data);
          setPage(p);
        }
      } catch {
        // API offline
      }
      setLoading(false);
    },
    []
  );

  // ── Autocomplete ──

  const fetchSuggestions = useCallback((q: string) => {
    if (suggestTimeout.current) clearTimeout(suggestTimeout.current);
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    suggestTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/spider/suggest?q=${encodeURIComponent(q)}`
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data || []);
          setShowSuggestions(true);
        }
      } catch {
        setSuggestions([]);
      }
    }, 150);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    fetchSuggestions(val);
  };

  // ── Domain extraction ──

  function extractDomain(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  }

  // ── Render ──

  const hasResults = results !== null;
  const isHome = !hasResults;

  return (
    <div className={`relative min-h-screen ${isHome ? "flex flex-col" : ""}`}>
      {/* ── Home state: centered search ── */}
      {isHome && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-32 pt-20">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <svg
              className="h-10 w-10 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
              <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            <h1 className="font-mono text-4xl font-bold tracking-tight text-foreground">
              spider
            </h1>
          </div>

          <p className="mb-8 max-w-md text-center text-sm text-muted-foreground">
            Motor de busqueda construido desde cero en Go. Crawler propio,
            inverted index, BM25 + PageRank. Sin APIs externas.
          </p>

          {/* Search box */}
          <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Buscar..."
                className="w-full border border-border bg-card px-5 py-4 pr-14 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground transition-colors hover:text-primary"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 border border-t-0 border-border bg-card">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={() => {
                      setQuery(s);
                      setShowSuggestions(false);
                      search(s);
                    }}
                    className="flex w-full items-center gap-3 px-5 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-primary/5"
                  >
                    <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Status */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  apiOnline === true
                    ? "bg-green-500"
                    : apiOnline === false
                      ? "bg-red-500"
                      : "bg-yellow-500 animate-pulse"
                }`}
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {apiOnline === true
                  ? "Online"
                  : apiOnline === false
                    ? "Offline"
                    : "Checking..."}
              </span>
            </div>
            {stats && (
              <>
                <div className="h-3 w-px bg-border" />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {stats.pages_indexed.toLocaleString()} pages indexed
                </span>
                <div className="h-3 w-px bg-border" />
                <span className="font-mono text-[10px] text-muted-foreground">
                  {stats.terms.toLocaleString()} terms
                </span>
              </>
            )}
          </div>

          {/* Back link */}
          <a
            href="/"
            className="mt-12 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Jesus Bernal
          </a>
        </div>
      )}

      {/* ── Results state ── */}
      {hasResults && (
        <div className="mx-auto max-w-3xl px-6 pt-24">
          {/* Top bar with search */}
          <div className="mb-8 flex items-center gap-4">
            <a
              href="/spider"
              onClick={(e) => {
                e.preventDefault();
                setResults(null);
                setQuery("");
                setPage(1);
              }}
              className="flex items-center gap-2 font-mono text-lg font-bold text-primary transition-colors hover:text-foreground"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                <path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              spider
            </a>
            <form onSubmit={handleSubmit} className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full border border-border bg-card px-4 py-2.5 pr-10 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary"
                placeholder="Buscar..."
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-primary"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 border border-t-0 border-border bg-card">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => {
                        setQuery(s);
                        setShowSuggestions(false);
                        search(s);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-primary/5"
                    >
                      <svg className="h-3 w-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Search metadata */}
          <div className="mb-6 flex items-center gap-4">
            <span className="font-mono text-[10px] text-muted-foreground">
              {results.total} results in {results.time_ms.toFixed(1)}ms
            </span>
            {results.corrected && (
              <>
                <div className="h-3 w-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  Showing results for{" "}
                  <button
                    onClick={() => {
                      setQuery(results.corrected!);
                      search(results.corrected!);
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    {results.corrected}
                  </button>
                </span>
              </>
            )}
          </div>

          {loading && (
            <div className="flex items-center gap-3 py-8">
              <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
              <span className="font-mono text-xs text-muted-foreground">Searching...</span>
            </div>
          )}

          {/* Featured results */}
          {results.featured?.length > 0 && (
            <div className="mb-6 space-y-3">
              {results.featured.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target={r.url.startsWith("/") ? undefined : "_blank"}
                  rel={r.url.startsWith("/") ? undefined : "noopener noreferrer"}
                  className="block border border-primary/20 bg-primary/[0.03] p-4 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-primary">
                      Featured
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-medium text-foreground">
                    {r.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: r.snippet }}
                  />
                  <span className="mt-2 block font-mono text-[11px] text-primary">
                    {r.url}
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Organic results */}
          <div className="space-y-6">
            {results.results?.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <span className="font-mono text-[11px] text-muted-foreground">
                  {extractDomain(r.url)}
                </span>
                <h3 className="mt-0.5 text-base font-medium text-foreground group-hover:text-primary transition-colors">
                  {r.title || r.url}
                </h3>
                <p
                  className="mt-1 text-sm leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: r.snippet }}
                />
              </a>
            ))}
          </div>

          {/* No results */}
          {!loading && results.results?.length === 0 && results.featured?.length === 0 && (
            <div className="py-12 text-center">
              <p className="font-mono text-sm text-muted-foreground">
                No results found for &ldquo;{results.query}&rdquo;
              </p>
            </div>
          )}

          {/* Pagination */}
          {results.total > results.per_page && (
            <div className="flex items-center justify-center gap-2 py-8">
              {page > 1 && (
                <button
                  onClick={() => search(query, page - 1)}
                  className="border border-border px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Previous
                </button>
              )}
              <span className="font-mono text-[10px] text-muted-foreground">
                Page {page} of {Math.ceil(results.total / results.per_page)}
              </span>
              {page < Math.ceil(results.total / results.per_page) && (
                <button
                  onClick={() => search(query, page + 1)}
                  className="border border-border px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Next
                </button>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-border py-6">
            <div className="flex items-center justify-between">
              <a
                href="/"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Jesus Bernal
              </a>
              <span className="font-mono text-[9px] text-muted-foreground/50">
                Powered by Spider Engine · Go · BM25 + PageRank
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
