"use client";

import { DataWaveBackground } from "@/components/backgrounds/data-wave";

const metrics = [
  { value: "717+", label: "Tests automatizados", detail: "Vitest, integration tests reales (no mocks superficiales)" },
  { value: "10", label: "Beta testers", detail: "Closed beta, 3 meses gratis via Stripe coupons" },
  { value: "6", label: "Sub-productos", detail: "POS, Kiosko, Station, App movil, Shop, Marketing site" },
  { value: "5", label: "Subdominios en produccion", detail: "pos., kiosk., station., app., shop." },
  { value: "4", label: "Plataformas", detail: "Web, Desktop (Electron), Mobile (Expo), Kiosko" },
  { value: "1", label: "Developer", detail: "Codigo, diseno, infra, negocio, soporte" },
];

const pricing = [
  { tier: "Free", price: "Gratis", detail: "Funcionalidades basicas" },
  { tier: "Start", price: "$149 MXN/mes", detail: "Business Insights, VPR" },
  { tier: "Pro", price: "$299 MXN/mes", detail: "Features avanzadas" },
  { tier: "Multi", price: "$499 MXN/mes", detail: "Multi-sucursal" },
];

export function BuildingInPublic() {
  return (
    <section
      id="metricas"
      className="relative overflow-hidden border-t border-border py-32"
    >
      <DataWaveBackground />
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Build in Public
          </span>
        </div>
        <h2 className="mb-6 max-w-lg text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Numeros reales, no vanity metrics
        </h2>
        <p className="mb-20 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Construir un SaaS completo como solo founder significa tomar cada
          decision — arquitectura, diseno, pricing, soporte — tu solo. Estos
          son los numeros reales del proyecto.
        </p>

        {/* Metrics grid */}
        <div className="mb-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col bg-background p-8"
            >
              <span className="font-mono text-3xl font-bold text-primary">
                {metric.value}
              </span>
              <span className="mt-2 text-base font-semibold text-foreground">
                {metric.label}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                {metric.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <p className="mb-8 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Pricing
        </p>
        <div className="grid gap-px bg-border md:grid-cols-4">
          {pricing.map((plan) => (
            <div
              key={plan.tier}
              className="flex flex-col bg-background p-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {plan.tier}
              </span>
              <span className="mt-2 text-lg font-semibold text-foreground">
                {plan.price}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                {plan.detail}
              </span>
            </div>
          ))}
        </div>

        {/* Build in public statement */}
        <div className="mt-16 max-w-2xl border-l-2 border-primary pl-6">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Cada feature viene de una conversacion real con un dueno de tienda.
            Me siento detras del mostrador, veo como el staff interactua con el
            sistema, y escucho que rompe su flujo. Construir para negocios fisicos
            significa estar ahi — no es remote-first, es counter-first.
          </p>
        </div>
      </div>
    </section>
  );
}
