"use client";

import { SignalRippleBackground } from "@/components/backgrounds/signal-ripple";

const links = [
  {
    label: "Orbita POS",
    href: "https://orbitapos.com",
    description: "El producto en produccion",
  },
  {
    label: "GitHub",
    href: "https://github.com/orbita-pos",
    description: "Codigo y contribuciones",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jesus-bernal-2b1a1b228",
    description: "Perfil profesional",
  },
  {
    label: "X / Twitter",
    href: "https://x.com/OrbitaPOS",
    description: "Build in public updates",
  },
  {
    label: "info@orbitapos.com",
    href: "mailto:info@orbitapos.com",
    description: "Para negocios, hiring, o colaboracion",
  },
];

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden border-t border-border py-32"
    >
      <SignalRippleBackground />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-16 md:grid-cols-12">
          {/* Left */}
          <div className="md:col-span-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                Contacto
              </span>
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Hablemos
            </h2>
            <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              Si tienes un negocio fisico en Mexico, si estas contratando,
              o si simplemente quieres hablar sobre producto y tecnologia
              — escribeme.
            </p>
          </div>

          {/* Right — Links */}
          <div className="md:col-span-7">
            <div className="flex flex-col gap-0">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={
                    link.href.startsWith("mailto")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="group flex items-center justify-between border-t border-border py-5 transition-colors hover:bg-secondary/30"
                >
                  <div className="flex flex-col">
                    <span className="text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                      {link.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {link.description}
                    </span>
                  </div>
                  <svg
                    className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary"
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
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto mt-32 max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <span className="font-mono text-xs text-muted-foreground">
            Jesus Bernal / {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-6">
            {[
              { label: "GitHub", href: "https://github.com/orbita-pos" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/jesus-bernal-2b1a1b228" },
              { label: "X", href: "https://x.com/OrbitaPOS" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
