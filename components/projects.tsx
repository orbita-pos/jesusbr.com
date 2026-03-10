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

        {/* ── Tier 1: Proyecto principal — Orbita POS ── */}
        <div className="relative border-2 border-primary/20 bg-gradient-to-b from-primary/[0.03] to-transparent">
          <div className="absolute -top-3 left-8 bg-background px-3 md:left-12">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Proyecto principal
            </span>
          </div>
          <div className="p-8 pt-10 md:p-12 md:pt-12">
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
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Sistema de punto de venta para tienditas y PyMEs en Mexico.
              Vision AI para reconocer productos con la camara, modo offline
              real, facturacion electronica CFDI, kiosko de autoservicio,
              app movil, y multi-sucursal. Todo construido por una sola persona.
            </p>

            {/* Key numbers */}
            <div className="mt-8 flex flex-wrap gap-8">
              {[
                { value: "717+", label: "tests" },
                { value: "6", label: "sub-productos" },
                { value: "10", label: "beta testers" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-mono text-2xl font-bold text-primary">
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

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 border-t border-primary/10 px-8 py-5 md:px-12">
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

        {/* ── Tier 2: Ingenieria profunda ── */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="border border-border p-6 md:col-span-3 md:grid md:grid-cols-3 md:gap-6 md:p-0">
            {/* Left: info */}
            <div className="md:col-span-2 md:p-8">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-foreground">Shadow</h3>
                <span className="inline-block border border-green-500/30 bg-green-500/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-green-400">
                  Live
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Comunicacion P2P encriptada end-to-end. Implementa X3DH + Double
                Ratchet (protocolo Signal), mesh routing, mensajes efimeros, dead
                drops, grupos con Sender Key, anti-forensics, y plausible deniability.
                Auditado por seguridad. Zero servers, zero trust, zero trace.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Rust", "WASM", "X3DH", "Double Ratchet", "WebRTC", "E2E"].map((tech) => (
                  <span
                    key={tech}
                    className="border border-border/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="https://jesusbr98-shadow.hf.space"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:opacity-90"
                >
                  Abrir app
                  <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <a
                  href="https://github.com/jesusbr/shadow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-primary hover:text-primary"
                >
                  GitHub
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </div>
            </div>
            {/* Right: stats */}
            <div className="mt-6 flex flex-wrap gap-6 md:mt-0 md:flex-col md:justify-center md:gap-4 md:border-l md:border-border md:p-8">
              {[
                { value: "223", label: "tests" },
                { value: "10", label: "features" },
                { value: "1", label: "security audit" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-mono text-lg font-bold text-primary">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tier 2: Spider ── */}
        <div className="mt-6 border border-border">
          <div className="flex flex-col md:flex-row">
            {/* Left: info */}
            <div className="flex-1 p-8 md:w-2/3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">Spider</h3>
                <span className="inline-block border border-green-500/30 bg-green-500/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-green-400">
                  Live
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Motor de busqueda construido desde cero. Crawler concurrente,
                inverted index, BM25 + PageRank, spell correction, autocomplete.
                Sin Elasticsearch, sin APIs externas — todo desde cero en Go.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Go", "SQLite", "BM25", "PageRank", "Crawler", "Full-text search"].map((tech) => (
                  <span
                    key={tech}
                    className="border border-border/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-5">
                <a
                  href="/spider"
                  className="group inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:opacity-90"
                >
                  Buscar
                  <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </a>
              </div>
            </div>
            {/* Right: stats */}
            <div className="mt-6 flex flex-wrap gap-6 md:mt-0 md:flex-col md:justify-center md:gap-4 md:border-l md:border-border md:p-8">
              {[
                { value: "2,000+", label: "pages indexed" },
                { value: "43k", label: "terms" },
                { value: "<50ms", label: "search latency" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-mono text-lg font-bold text-primary">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tier 2: Vertex ── */}
        <div className="mt-6 border border-border">
          <div className="flex flex-col md:flex-row">
            {/* Left: info */}
            <div className="flex-1 p-8 md:w-2/3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-foreground">Vertex</h3>
                <span className="inline-block border border-yellow-500/30 bg-yellow-500/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-yellow-400">
                  In Development
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Plataforma de videollamadas empresarial. SFU (Selective Forwarding
                Unit) construido desde cero en Rust, simulcast con calidad adaptativa,
                screen sharing, chat, waiting room, grabacion, y admin dashboard.
                Competencia directa de Zoom y Teams.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Rust", "WebRTC", "SFU", "Tokio", "Next.js", "Simulcast"].map((tech) => (
                  <span
                    key={tech}
                    className="border border-border/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {/* Right: stats */}
            <div className="mt-6 flex flex-wrap gap-6 md:mt-0 md:flex-col md:justify-center md:gap-4 md:border-l md:border-border md:p-8">
              {[
                { value: "50", label: "max participants" },
                { value: "3", label: "simulcast layers" },
                { value: "<150ms", label: "audio latency" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-mono text-lg font-bold text-primary">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tier 3: Herramientas ── */}
        <div className="mt-6">
          <div className="border border-border/60 p-6">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-foreground">cfdi-cli</h3>
              <span className="inline-block border border-green-500/30 bg-green-500/5 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-green-400">
                Live
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              CLI y web app open source para parsear, validar y convertir
              facturas electronicas del SAT (CFDI 4.0) a JSON y CSV.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["Rust", "WASM", "SAT/CFDI", "Open Source"].map((tech) => (
                <span
                  key={tech}
                  className="border border-border/40 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href="/cfdi"
                className="group inline-flex items-center gap-2 bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:opacity-90"
              >
                Usar web app
                <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="https://github.com/orbita-pos/cfdi-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-primary hover:text-primary"
              >
                GitHub
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
