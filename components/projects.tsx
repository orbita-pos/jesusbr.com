export function Projects() {
  return (
    <section id="proyectos" className="relative border-t border-border py-32">
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Proyectos
          </span>
        </div>
        <h2 className="mb-16 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Lo que estoy construyendo
        </h2>

        {/* Featured project: Orbita POS */}
        <div className="border border-border">
          <div>
            <div className="p-8 md:p-12">
              <span className="mb-4 font-mono text-[10px] uppercase tracking-widest text-primary">
                Proyecto principal
              </span>
              <div className="flex items-center gap-4">
                <img
                  src="/orbita-logo.png"
                  alt="Orbita POS logo"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                <h3 className="text-2xl font-bold text-foreground md:text-3xl">
                  Orbita POS
                </h3>
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Sistema de punto de venta para tienditas y PyMEs en Mexico.
                Vision AI para reconocer productos con la camara, modo offline
                real, facturacion electronica CFDI, kiosko de autoservicio,
                app movil, y multi-sucursal. Todo construido por una sola persona.
              </p>

              {/* Key numbers */}
              <div className="mt-8 flex flex-wrap gap-6">
                {[
                  { value: "717+", label: "tests" },
                  { value: "6", label: "sub-productos" },
                  { value: "10", label: "beta testers" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="font-mono text-xl font-bold text-primary">
                      {stat.value}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Links */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/orbita"
                  className="group inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
                >
                  Ver mas
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
                <a
                  href="https://orbitapos.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary"
                >
                  orbitapos.com
                  <svg
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
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

          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 border-t border-border px-8 py-5 md:px-12">
            {[
              "Next.js 15",
              "TypeScript",
              "PostgreSQL",
              "Drizzle",
              "Electron",
              "Expo",
              "Stripe",
              "GPT-4o-mini Vision",
              "MobileCLIP",
              "Tailwind",
            ].map((tech) => (
              <span
                key={tech}
                className="border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Upcoming projects */}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="border border-dashed border-border/50 p-8">
            <span className="mb-3 inline-block border border-primary/30 bg-primary/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
              Proximamente
            </span>
            <h3 className="text-lg font-bold text-foreground">cfdi-cli</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              CLI open source para parsear, validar y convertir facturas
              electronicas del SAT (CFDI) a JSON, CSV y mas. Para contadores,
              devs y negocios en Mexico.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Rust", "SAT/CFDI", "Open Source"].map((tech) => (
                <span
                  key={tech}
                  className="border border-border/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center border border-dashed border-border/50 p-12">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/40">
              Proximo proyecto — pronto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
