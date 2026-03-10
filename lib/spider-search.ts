import { turso } from "./turso";

// ── Simple in-memory cache (avoid repeated Turso round-trips) ──
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 60_000; // 1 minute

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T;
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
  // Prevent unbounded growth
  if (cache.size > 200) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

// ── Featured projects (same as featured.json in Go engine) ──
const FEATURED = [
  {
    name: "Orbita POS",
    url: "https://orbitapos.com",
    internal_url: "/orbita",
    description:
      "Sistema de punto de venta para tienditas y PyMEs en Mexico",
    keywords: [
      "pos", "punto de venta", "tienda", "pyme", "ventas", "inventario",
      "facturacion", "cfdi", "negocio", "caja", "cobrar", "producto",
    ],
  },
  {
    name: "Shadow",
    url: "https://github.com/jesusbr/shadow",
    description:
      "Comunicacion P2P encriptada end-to-end con protocolo Signal",
    keywords: [
      "chat", "cifrado", "encriptado", "privacidad", "p2p", "mensajes",
      "seguro", "signal", "comunicacion",
    ],
  },
  {
    name: "cfdi-cli",
    url: "https://github.com/orbita-pos/cfdi-cli",
    internal_url: "/cfdi",
    description:
      "CLI y web app para parsear facturas electronicas del SAT (CFDI 4.0)",
    keywords: [
      "cfdi", "factura", "sat", "xml", "fiscal", "rfc", "impuestos",
      "contabilidad",
    ],
  },
  {
    name: "Spider",
    url: "https://jesusbr.com/spider",
    description: "Motor de busqueda construido desde cero en Go",
    keywords: [
      "buscador", "buscar", "search", "google", "web", "spider", "crawler",
    ],
  },
];

// ── BM25 parameters (match Go engine) ──
const K1 = 1.5;
const B = 0.75;

// ── Scoring weights (match Go engine) ──
const W_BM25 = 0.60;
const W_PAGERANK = 0.25;
const W_FRESHNESS = 0.10;
const W_TITLE = 0.05;

const PER_PAGE = 20;

// Simple tokenizer: lowercase, split on non-alphanumeric
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9áéíóúüñ]+/)
    .filter((t) => t.length > 1);
}

// Levenshtein distance
function editDistance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// BM25 IDF
function idf(n: number, N: number): number {
  return Math.log((N - n + 0.5) / (n + 0.5) + 1);
}

// Featured matching
function matchFeatured(queryTokens: string[]) {
  const results: {
    url: string;
    title: string;
    snippet: string;
    score: number;
    page_rank: number;
    featured: boolean;
    fetched_at: string;
  }[] = [];

  for (const f of FEATURED) {
    let matched = false;
    for (const qt of queryTokens) {
      for (const kw of f.keywords) {
        if (kw.includes(qt) || qt.includes(kw)) {
          matched = true;
          break;
        }
      }
      if (matched) break;
    }
    if (matched) {
      results.push({
        url: f.internal_url ?? f.url,
        title: f.name,
        snippet: f.description,
        score: 0.95,
        page_rank: 0,
        featured: true,
        fetched_at: "",
      });
    }
  }
  return results;
}

// Snippet extraction
function extractSnippet(body: string, queryTokens: string[]): string {
  const lower = body.toLowerCase();
  let bestPos = -1;

  for (const t of queryTokens) {
    const idx = lower.indexOf(t);
    if (idx !== -1) {
      bestPos = idx;
      break;
    }
  }

  if (bestPos === -1) {
    return body.slice(0, 160).trim();
  }

  const start = Math.max(0, bestPos - 60);
  const end = Math.min(body.length, bestPos + 100);
  let snippet = body.slice(start, end).trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < body.length) snippet = snippet + "...";
  return snippet;
}

export async function search(query: string, page: number = 1) {
  const cacheKey = `search:${query.toLowerCase().trim()}:${page}`;
  const cached = getCached<ReturnType<typeof search>>(cacheKey);
  if (cached) return cached;

  const start = performance.now();
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return {
      query,
      results: [],
      featured: [],
      total: 0,
      time_ms: 0,
      page: 1,
      per_page: PER_PAGE,
    };
  }

  // Run stats + term lookup in parallel
  const placeholders = queryTokens.map(() => "?").join(",");
  const [statsRow, termRows] = await Promise.all([
    turso.execute("SELECT COUNT(*) as cnt FROM pages"),
    turso.execute({
      sql: `SELECT t.id, t.term, COUNT(p.page_id) as df
            FROM terms t
            JOIN postings p ON p.term_id = t.id
            WHERE t.term IN (${placeholders})
            GROUP BY t.id`,
      args: queryTokens,
    }),
  ]);
  const N = Number(statsRow.rows[0].cnt);

  const termMap = new Map<string, { id: number; df: number }>();
  for (const row of termRows.rows) {
    termMap.set(row.term as string, {
      id: Number(row.id),
      df: Number(row.df),
    });
  }

  // Spell correction for missing terms
  let corrected: string | undefined;
  const missingTokens = queryTokens.filter((t) => !termMap.has(t));
  if (missingTokens.length > 0) {
    const corrections: string[] = [];
    for (const missing of missingTokens) {
      // Find closest term by edit distance
      const candidates = await turso.execute({
        sql: `SELECT term FROM terms
              WHERE term >= ? AND term < ?
              AND LENGTH(term) BETWEEN ? AND ?
              LIMIT 100`,
        args: [missing[0], missing[0] + "\uffff", missing.length - 1, missing.length + 1],
      });

      let bestTerm = missing;
      let bestDist = 3;
      for (const c of candidates.rows) {
        const d = editDistance(missing, c.term as string);
        if (d < bestDist) {
          bestDist = d;
          bestTerm = c.term as string;
        }
      }
      corrections.push(bestTerm);

      if (bestTerm !== missing && !termMap.has(bestTerm)) {
        const fixRow = await turso.execute({
          sql: `SELECT t.id, COUNT(p.page_id) as df
                FROM terms t
                JOIN postings p ON p.term_id = t.id
                WHERE t.term = ?
                GROUP BY t.id`,
          args: [bestTerm],
        });
        if (fixRow.rows.length > 0) {
          termMap.set(bestTerm, {
            id: Number(fixRow.rows[0].id),
            df: Number(fixRow.rows[0].df),
          });
        }
      }
    }
    const correctedTokens = queryTokens.map((t) => {
      const idx = missingTokens.indexOf(t);
      return idx >= 0 ? corrections[idx] : t;
    });
    const correctedStr = correctedTokens.join(" ");
    if (correctedStr !== queryTokens.join(" ")) {
      corrected = correctedStr;
    }
  }

  // Get postings for all found terms
  const termIds = Array.from(termMap.values()).map((t) => t.id);
  if (termIds.length === 0) {
    return {
      query,
      corrected,
      results: [],
      featured: matchFeatured(queryTokens),
      total: 0,
      time_ms: performance.now() - start,
      page,
      per_page: PER_PAGE,
    };
  }

  // Step 1: Get BM25 scores from postings only (lightweight — no body/description)
  const tidPlaceholders = termIds.map(() => "?").join(",");
  const postingRows = await turso.execute({
    sql: `SELECT po.term_id, po.page_id, po.frequency
          FROM postings po
          WHERE po.term_id IN (${tidPlaceholders})`,
    args: termIds,
  });

  // Score documents by BM25
  const docBm25 = new Map<number, number>();

  for (const row of postingRows.rows) {
    const pageId = Number(row.page_id);
    const termId = Number(row.term_id);
    const tf = Number(row.frequency);

    let df = 1;
    for (const [, v] of termMap) {
      if (v.id === termId) {
        df = v.df;
        break;
      }
    }

    const idfVal = idf(df, N);
    // Simplified BM25 without doc length (we don't have it yet)
    const tfNorm = (tf * (K1 + 1)) / (tf + K1);
    const bm25 = idfVal * tfNorm;

    docBm25.set(pageId, (docBm25.get(pageId) || 0) + bm25);
  }

  // Step 2: Sort by BM25, take top candidates (more than a page to allow for re-ranking)
  const topN = PER_PAGE * 3;
  const sortedPageIds = [...docBm25.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  const total = docBm25.size;

  if (sortedPageIds.length === 0) {
    return {
      query,
      corrected,
      results: [],
      featured: matchFeatured(queryTokens),
      total: 0,
      time_ms: performance.now() - start,
      page,
      per_page: PER_PAGE,
    };
  }

  // Step 3: Fetch page details only for top candidates
  const pageIds = sortedPageIds.map(([id]) => id);
  const pidPlaceholders = pageIds.map(() => "?").join(",");
  const pageRows = await turso.execute({
    sql: `SELECT id, url, title, description, body, page_rank, fetched_at
          FROM pages WHERE id IN (${pidPlaceholders})`,
    args: pageIds,
  });

  const pageMap = new Map<number, typeof pageRows.rows[0]>();
  for (const row of pageRows.rows) {
    pageMap.set(Number(row.id), row);
  }

  // Step 4: Combined scoring with page details
  const scored: {
    url: string;
    title: string;
    snippet: string;
    score: number;
    page_rank: number;
    featured: boolean;
    fetched_at: string;
  }[] = [];

  const queryLower = query.toLowerCase();
  const allTokens = corrected ? tokenize(corrected) : queryTokens;

  for (const [pageId, bm25Score] of sortedPageIds) {
    const pg = pageMap.get(pageId);
    if (!pg) continue;

    const titleMatch = (pg.title as string || "").toLowerCase().includes(queryLower) ? 1.0 : 0.0;

    let freshness = 0.5;
    if (pg.fetched_at) {
      const days = (Date.now() - new Date(pg.fetched_at as string).getTime()) / 86400000;
      freshness = Math.exp(-days / 30);
    }

    const combined =
      W_BM25 * bm25Score +
      W_PAGERANK * Number(pg.page_rank) +
      W_FRESHNESS * freshness +
      W_TITLE * titleMatch;

    const snippet =
      (pg.description as string) || extractSnippet(pg.body as string || "", allTokens);

    scored.push({
      url: pg.url as string,
      title: (pg.title as string) || (pg.url as string),
      snippet: snippet.slice(0, 160),
      score: Math.round(combined * 1000) / 1000,
      page_rank: Math.round(Number(pg.page_rank) * 1000) / 1000,
      featured: false,
      fetched_at: (pg.fetched_at as string) || "",
    });
  }

  scored.sort((a, b) => b.score - a.score);

  const offset = (page - 1) * PER_PAGE;
  const paged = scored.slice(offset, offset + PER_PAGE);

  const result = {
    query,
    corrected,
    featured: matchFeatured(queryTokens),
    results: paged,
    total,
    time_ms: Math.round((performance.now() - start) * 10) / 10,
    page,
    per_page: PER_PAGE,
  };

  setCache(cacheKey, result);
  return result;
}

export async function suggest(prefix: string): Promise<string[]> {
  if (!prefix || prefix.length < 1) return [];
  const lower = prefix.toLowerCase();

  const rows = await turso.execute({
    sql: `SELECT t.term, COUNT(p.page_id) as df
          FROM terms t
          JOIN postings p ON p.term_id = t.id
          WHERE t.term >= ? AND t.term < ?
          GROUP BY t.id
          ORDER BY df DESC
          LIMIT 8`,
    args: [lower, lower + "\uffff"],
  });

  return rows.rows.map((r) => r.term as string);
}

export async function getStats() {
  const cached = getCached<ReturnType<typeof getStats>>("stats");
  if (cached) return cached;

  const [pagesRow, termsRow, rankRow, crawlRow] = await Promise.all([
    turso.execute("SELECT COUNT(*) as cnt FROM pages"),
    turso.execute("SELECT COUNT(*) as cnt FROM terms"),
    turso.execute("SELECT AVG(page_rank) as avg FROM pages"),
    turso.execute(
      "SELECT fetched_at FROM pages ORDER BY fetched_at DESC LIMIT 1"
    ),
  ]);

  const result = {
    pages_indexed: Number(pagesRow.rows[0].cnt),
    terms: Number(termsRow.rows[0].cnt),
    avg_page_rank:
      Math.round(Number(rankRow.rows[0].avg || 0) * 1000) / 1000,
    last_crawl: (crawlRow.rows[0]?.fetched_at as string) || "",
  };

  setCache("stats", result);
  return result;
}
