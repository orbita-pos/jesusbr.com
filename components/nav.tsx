"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useDictionary } from "@/lib/dictionary-provider";
import { useLocale } from "@/lib/locale-provider";

export function Nav() {
  const dict = useDictionary();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const links = [
    { label: dict.nav.projects, href: "#projects" },
    { label: dict.nav.stack, href: "#stack" },
    { label: dict.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherLocale = locale === "en" ? "es" : "en";

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href={`/${locale}`}
          className="font-mono text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          jesus bernal
        </a>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hidden font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground md:inline-block"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://orbitapos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:text-foreground md:inline-block"
          >
            orbitapos.com
          </a>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-7 w-7 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Toggle theme"
            >
              {mounted ? (
                theme === "dark" ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )
              ) : (
                <div className="h-3.5 w-3.5" />
              )}
            </button>
            <a
              href={`/${otherLocale}`}
              className="flex h-7 items-center border border-border px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {otherLocale.toUpperCase()}
            </a>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
