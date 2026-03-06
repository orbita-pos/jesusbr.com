import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { CfdiTool } from "@/components/cfdi-tool";

export const metadata: Metadata = {
  title: "CFDI Parser — Parsea facturas del SAT en tu navegador | Jesus Bernal",
  description:
    "Herramienta gratuita para parsear, validar y convertir facturas electronicas CFDI 4.0 a JSON y CSV. Todo corre en tu navegador, tus datos nunca salen de tu maquina.",
  openGraph: {
    title: "CFDI Parser — Parsea facturas del SAT en tu navegador",
    description:
      "Arrastra tus XMLs del SAT y obten JSON o CSV al instante. Zero backend, zero uploads. Powered by Rust + WebAssembly.",
    type: "website",
    url: "https://jesusbr.com/cfdi",
  },
};

export default function CfdiPage() {
  return (
    <main>
      <Nav />
      <section className="relative pt-32 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <a
            href="/"
            className="mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Jesus Bernal
          </a>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            CFDI Parser
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Parsea, valida y convierte facturas electronicas del SAT (CFDI 4.0)
            directo en tu navegador. Tus archivos nunca salen de tu maquina.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {["Rust + WASM", "Zero backend", "100% local", "Open source"].map(
              (tag) => (
                <span
                  key={tag}
                  className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </section>
      <CfdiTool />
      <section className="border-t border-border py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            Tambien disponible como CLI
          </h2>
          <p className="mb-4 text-muted-foreground">
            Para devs que prefieren la terminal o necesitan automatizar:
          </p>
          <div className="overflow-x-auto rounded border border-border bg-muted/30 p-4">
            <pre className="font-mono text-sm text-foreground">
              <code>{`# Instalar
cargo install cfdi-cli

# Parsear una factura
cfdi-cli parse factura.xml

# Validar
cfdi-cli validate factura.xml

# Procesar carpeta entera a CSV
cfdi-cli bulk ./facturas/ -o reporte.csv`}</code>
            </pre>
          </div>
          <a
            href="https://github.com/orbita-pos/cfdi-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-primary transition-colors hover:underline"
          >
            Ver en GitHub
            <svg
              className="h-3.5 w-3.5"
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
      </section>
    </main>
  );
}
