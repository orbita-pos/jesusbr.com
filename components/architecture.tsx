"use client";

import { ArchitectureGraphBackground } from "@/components/backgrounds/architecture-graph";

const stack = [
  { name: "Next.js", role: "Framework", detail: "App Router, RSC, middleware" },
  { name: "TypeScript", role: "Lenguaje", detail: "End-to-end type safety" },
  { name: "PostgreSQL", role: "Base de datos", detail: "Transacciones, migrations" },
  { name: "Drizzle ORM", role: "ORM", detail: "Type-safe, zero overhead" },
  { name: "Electron", role: "Desktop", detail: "Offline, hardware integration" },
  { name: "Expo", role: "Mobile", detail: "React Native, offline queue" },
  { name: "Tailwind", role: "Styling", detail: "Utility-first CSS" },
  { name: "Vercel", role: "Deploy", detail: "Previews, edge, analytics" },
];

const capabilities = [
  "Vision AI (YOLOS, MobileCLIP, GPT-4o-mini)",
  "Billing y subscriptions (Stripe)",
  "Facturacion electronica (CFDI 4.0)",
  "Observabilidad (Sentry, rate limiting, CSRF)",
  "Testing (Vitest, 717+ integration tests)",
  "Infra (Cloudflare DNS, Vercel, external crons)",
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
          Con que construyo
        </h2>
        <p className="mb-20 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Full-stack: frontend, backend, desktop, mobile, AI, infra, y billing.
          Todo lo que necesita un producto real para funcionar en produccion.
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
          Tambien trabajo con
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
