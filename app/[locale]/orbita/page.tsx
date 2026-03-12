import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Product } from "@/components/product";
import { POSDemo } from "@/components/pos-demo";
import { BuildingInPublic } from "@/components/building-in-public";
import { Contact } from "@/components/contact";

export const metadata: Metadata = {
  title: "Orbita POS — Sistema de punto de venta para Mexico | Jesus Bernal",
  description:
    "Vision AI, modo offline, facturacion CFDI, kiosko de autoservicio, app movil y multi-sucursal. El POS mas completo para tienditas y PyMEs en Mexico.",
  openGraph: {
    title: "Orbita POS — Sistema de punto de venta para Mexico",
    description:
      "Vision AI, modo offline, facturacion CFDI, kiosko de autoservicio. Construido por un solo developer.",
    type: "website",
    url: "https://jesusbr.com/orbita",
  },
};

export default function OrbitaPage() {
  return (
    <main>
      <Nav />
      {/* Hero for Orbita page */}
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
            Orbita POS
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            Un sistema de punto de venta completo para tienditas y PyMEs en Mexico.
            Lo que nos diferencia de Clip, iZettle y Square no son features genericas,
            son decisiones tecnicas que ningun otro POS ha tomado.
          </p>
          <div className="mt-8">
            <a
              href="https://orbitapos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Ir a orbitapos.com
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
      <Product />
      <POSDemo />
      <BuildingInPublic />
      <Contact />
    </main>
  );
}
