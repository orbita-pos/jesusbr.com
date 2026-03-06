"use client";

import { motion } from "framer-motion";
import { TransactionFlowBackground } from "@/components/backgrounds/transaction-flow";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="grid-pattern absolute inset-0 opacity-40" />
      <TransactionFlowBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-32">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Jesus Bernal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Solo founder. Construyo software para negocios fisicos en Mexico.
            Ahora mismo estoy haciendo{" "}
            <a
              href="/orbita"
              className="text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary"
            >
              Orbita POS
            </a>
            .
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            {[
              { label: "GitHub", href: "https://github.com/orbita-pos" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/jesus-bernal-2b1a1b228" },
              { label: "X / Twitter", href: "https://x.com/OrbitaPOS" },
              { label: "info@orbitapos.com", href: "mailto:info@orbitapos.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto") ? undefined : "_blank"}
                rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
