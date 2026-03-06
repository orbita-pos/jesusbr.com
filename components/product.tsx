"use client";

import { ScannerPulseBackground } from "@/components/backgrounds/scanner-pulse";

const differentiators = [
  {
    tag: "01",
    title: "Orbita Go — Vision AI en el punto de venta",
    description:
      "El cajero apunta la camara al producto y el sistema lo reconoce automaticamente. Zero training. YOLOS-tiny detecta objetos en el frame, MobileCLIP hace match local en ~100ms, y GPT-4o-mini vision actua como fallback inteligente. Despues de una semana de uso, 95% de los productos se reconocen al instante sin llamar a ninguna API. Ningun POS en el mundo tiene esto.",
    detail: "YOLOS (ONNX/WASM client-side) + MobileCLIP-S0 (Transformers.js) + GPT-4o-mini (server)",
  },
  {
    tag: "02",
    title: "Business Insights — Le dice al dueno cuanto dinero esta perdiendo",
    description:
      "Dashboard que muestra merma estimada, inventario muerto, producto estrella vs producto problema, recomendaciones de compra (dejar de comprar / comprar mas), y comparacion semana vs semana. No es un dashboard de vanity metrics — es un dashboard de decision.",
    detail: "Plan-gated al tier Start ($149 MXN/mes)",
  },
  {
    tag: "03",
    title: "Kiosko de autoservicio integrado",
    description:
      "Modo autoservicio para que el cliente haga su propio pedido desde una tablet. Killer feature para cafeterias y restaurantes. Mismo sistema, sin hardware extra, sin software extra.",
    detail: "kiosk.orbitapos.com — multi-host routing via middleware",
  },
  {
    tag: "04",
    title: "Modo offline real",
    description:
      "La app de escritorio (Electron) funciona sin internet. Ventas, inventario, y operacion completa. Cuando regresa la conexion, sincroniza automaticamente. Para una tiendita en un pueblo sin internet estable, esto no es un nice-to-have — es el producto.",
    detail: "Electron + local-first data sync + offline queue",
  },
  {
    tag: "05",
    title: "Facturacion electronica (CFDI) integrada",
    description:
      "CFDI 4.0 compliant con el SAT, integrado directamente en el flujo de venta. No es un addon, no es un tercero — esta dentro del sistema. El dueno emite facturas sin salir del POS.",
    detail: "Timbrado directo, complementos de pago, cancelacion",
  },
  {
    tag: "06",
    title: "Motor de promociones con reglas reales",
    description:
      "4 metodos (percent_off, amount_off, set_price, buy X get Y), 2 scopes (item, sale), stacking rules, condiciones por cliente, ubicacion y horario. No es un campo de descuento — es un motor de reglas.",
    detail: "Pure function, zero side effects, BigInt math",
  },
];

export function Product() {
  return (
    <section id="producto" className="relative overflow-hidden py-32">
      <ScannerPulseBackground />
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-20 max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              El Producto
            </span>
          </div>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Orbita POS
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Un sistema de punto de venta completo para tienditas y PyMEs en Mexico.
            Lo que nos diferencia de Clip, iZettle y Square no son features genericas
            — son decisiones tecnicas que ningun otro POS ha tomado.
          </p>
        </div>

        {/* Differentiators */}
        <div className="flex flex-col gap-0">
          {differentiators.map((item) => (
            <article
              key={item.tag}
              className="group grid gap-6 border-t border-border py-10 md:grid-cols-12 md:gap-12"
            >
              <div className="md:col-span-1">
                <span className="font-mono text-sm text-muted-foreground">
                  {item.tag}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 font-mono text-xs text-primary/70">
                  {item.detail}
                </p>
              </div>
              <div className="md:col-span-7">
                <p className="text-base leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Additional features — compact list */}
        <div className="mt-16 border-t border-border pt-10">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Tambien incluye
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              "Multi-sucursal",
              "Tienda online (shop.orbitapos.com)",
              "App movil (Expo SDK 54)",
              "Escaner de codigo de barras",
              "Impresora termica",
              "Cajon de efectivo",
              "Pagos mixtos",
              "Atajos de teclado",
              "Stripe billing",
              "Multi-host routing",
            ].map((feature) => (
              <span
                key={feature}
                className="border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="https://orbitapos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
          >
            Ver Orbita POS en produccion
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
