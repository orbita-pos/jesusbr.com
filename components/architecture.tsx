"use client";

import { ArchitectureGraphBackground } from "@/components/backgrounds/architecture-graph";

const stack = [
  { name: "Rust", role: "Systems", detail: "WASM, crypto, SFU, CLI tools" },
  { name: "Go", role: "Backend", detail: "Crawlers, search engines" },
  { name: "TypeScript", role: "Full-stack", detail: "Next.js, React, Node" },
  { name: "Next.js", role: "Framework", detail: "App Router, RSC, API routes" },
  { name: "PostgreSQL", role: "Database", detail: "Transactions, migrations" },
  { name: "SQLite", role: "Embedded DB", detail: "Turso Cloud, local-first" },
  { name: "Electron", role: "Desktop", detail: "Offline, hardware access" },
  { name: "Expo", role: "Mobile", detail: "React Native, offline queue" },
];

const capabilities = [
  "WebRTC & P2P (signaling, SFU, data channels)",
  "Cryptography (X3DH, Double Ratchet, E2E encryption)",
  "WASM (Rust compiled to browser)",
  "Vision AI (YOLOS, MobileCLIP, GPT-4o-mini)",
  "Search engines (BM25, PageRank, inverted index)",
  "Billing & subscriptions (Stripe)",
  "Electronic invoicing (CFDI 4.0)",
  "Testing (Vitest, 717+ integration tests)",
];

export function Architecture() {
  return (
    <section
      id="stack"
      className="relative overflow-hidden border-t border-border py-32"
    >
      <ArchitectureGraphBackground />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Stack
          </span>
        </div>
        <h2 className="mb-6 max-w-lg text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          What I build with
        </h2>
        <p className="mb-20 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Systems programming, full-stack web, desktop, mobile, cryptography, and
          search engines. From Rust and Go to Next.js and React Native.
        </p>

        {/* Tech stack grid */}
        <div className="mb-16 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {stack.map((tech) => (
            <div key={tech.name} className="flex flex-col bg-background p-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {tech.role}
              </span>
              <span className="mt-2 text-lg font-semibold text-foreground">
                {tech.name}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                {tech.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Capabilities list */}
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          I also work with
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {capabilities.map((cap) => (
            <div
              key={cap}
              className="flex items-center gap-3 border border-border px-5 py-3"
            >
              <div className="h-1.5 w-1.5 shrink-0 bg-primary" />
              <span className="text-sm text-muted-foreground">{cap}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
