"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ScannerPulseBackground } from "@/components/backgrounds/scanner-pulse";

/* ─── Mock catalog (realistic restaurant/taquería products) ───── */
const PRODUCTS = [
  { id: "TAC-001", name: "Taco al pastor", price: 25.0 },
  { id: "TAC-002", name: "Taco de suadero", price: 28.0 },
  { id: "GRI-001", name: "Gringa de pastor", price: 55.0 },
  { id: "ALA-001", name: "Alambre mixto", price: 120.0 },
  { id: "AF-HOR", name: "Agua fresca horchata", price: 30.0 },
  { id: "AF-JAM", name: "Agua fresca jamaica", price: 30.0 },
  { id: "EMB-600", name: "Agua embotellada 600ml", price: 18.0 },
  { id: "TOR-001", name: "Torta de milanesa", price: 65.0 },
];

const TAX_RATE = 0.16;

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

/* ─── Animated number display ──────────────────────────────────── */
function AnimatedTotal({ value, prefix = "$" }: { value: number; prefix?: string }) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 120, damping: 20, mass: 0.5 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toFixed(2)}`;
      }
    });
    return unsubscribe;
  }, [spring, prefix]);

  return <span ref={ref}>{prefix}{value.toFixed(2)}</span>;
}

/* ─── Barcode animation ────────────────────────────────────────── */
function ScanAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm"
    >
      <motion.div className="flex flex-col items-center gap-3">
        <div className="flex items-end gap-[2px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-primary"
              style={{ width: i % 3 === 0 ? 3 : 1.5 }}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 24 + Math.random() * 20,
                opacity: 1,
              }}
              transition={{ delay: i * 0.015, duration: 0.15 }}
            />
          ))}
        </div>
        <motion.div
          className="h-[2px] w-20 bg-primary"
          initial={{ opacity: 0.8, scaleX: 0 }}
          animate={{ opacity: [0.8, 1, 0.8], scaleX: [0, 1, 0] }}
          transition={{ duration: 0.5 }}
          style={{ boxShadow: "0 0 12px oklch(0.78 0.12 165 / 0.6)" }}
        />
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Escaneando...
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Payment success overlay ──────────────────────────────────── */
function PaymentSuccess({ method, onComplete }: { method: string; onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1800);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          className="flex h-16 w-16 items-center justify-center border-2 border-primary"
          initial={{ borderColor: "transparent" }}
          animate={{ borderColor: "oklch(0.78 0.12 165)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.svg
            className="h-8 w-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />
          </motion.svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-lg font-semibold text-foreground">Pago aprobado</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {method}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main POS Demo ────────────────────────────────────────────── */
export function POSDemo() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scanning, setScanning] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const lastProductIndex = useRef(0);
  const cartContainerRef = useRef<HTMLDivElement>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const scanProduct = useCallback(() => {
    if (scanning || paymentSuccess) return;

    let idx = Math.floor(Math.random() * PRODUCTS.length);
    if (idx === lastProductIndex.current) {
      idx = (idx + 1) % PRODUCTS.length;
    }
    lastProductIndex.current = idx;
    const product = PRODUCTS[idx];

    setScanning(true);
    setPendingProduct(product);
  }, [scanning, paymentSuccess]);

  const onScanComplete = useCallback(() => {
    if (!pendingProduct) return;
    setScanning(false);
    setCart((prev) => {
      const existing = prev.find((item) => item.id === pendingProduct.id);
      if (existing) {
        return prev.map((item) =>
          item.id === pendingProduct.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...pendingProduct, qty: 1 }];
    });
    setPendingProduct(null);
    setTimeout(() => {
      const el = cartContainerRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 50);
  }, [pendingProduct]);

  const pay = useCallback(
    (method: string) => {
      if (cart.length === 0 || paymentSuccess) return;
      setPaymentSuccess(method);
    },
    [cart, paymentSuccess]
  );

  const onPaymentComplete = useCallback(() => {
    setPaymentSuccess(null);
    setCart([]);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      if (e.code === "Space") {
        e.preventDefault();
        scanProduct();
      }
      if (e.code === "Enter" && cart.length > 0) {
        e.preventDefault();
        pay("Efectivo");
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      if (e.code === "Space") {
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [scanProduct, pay, cart.length]);

  return (
    <section id="demo" className="relative overflow-hidden border-t border-border py-32">
      <ScannerPulseBackground />
      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-primary" />
          <span className="font-mono text-xs uppercase tracking-widest text-primary">
            Live Demo
          </span>
        </div>
        <h2 className="mb-4 max-w-lg text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Prueba el checkout
        </h2>
        <p className="mb-16 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
          Escanea productos, observa el carrito en tiempo real, y completa un
          pago. Asi se siente la velocidad en caja.
        </p>

        {/* POS terminal */}
        <div className="relative mx-auto max-w-3xl">
          {/* Terminal frame */}
          <div className="relative overflow-hidden border border-border bg-card">
            {/* Terminal header bar */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-primary" />
                <span className="font-mono text-xs font-medium uppercase tracking-widest text-foreground">
                  Orbita POS
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Caja 01
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {new Date().toLocaleTimeString("es-MX", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex flex-col md:flex-row">
              {/* Left: Cart area */}
              <div className="flex min-h-[420px] flex-1 flex-col">
                {/* Cart header */}
                <div className="flex items-center justify-between border-b border-border px-5 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Venta actual
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {itemCount} {itemCount === 1 ? "producto" : "productos"}
                  </span>
                </div>

                {/* Cart items */}
                <div ref={cartContainerRef} className="flex-1 overflow-y-auto px-5 py-3" style={{ maxHeight: 300 }}>
                  <AnimatePresence mode="popLayout">
                    {cart.length === 0 && !scanning ? (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3"
                      >
                        <svg
                          className="h-8 w-8 text-muted-foreground/40"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1}
                          strokeLinecap="round"
                        >
                          <path d="M2 4h2v16H2M6 4h1v16H6M10 4h1v16h-1M14 4h2v16h-2M19 4h1v16h-1M22 4h0v16" />
                        </svg>
                        <p className="font-mono text-xs text-muted-foreground/50">
                          Escanea un producto para comenzar
                        </p>
                      </motion.div>
                    ) : (
                      cart.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="flex items-center justify-between border-b border-border/50 py-3"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              {item.name}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {item.id} &middot; ${item.price.toFixed(2)} c/u
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-mono text-xs text-muted-foreground">
                              x{item.qty}
                            </span>
                            <span className="font-mono text-sm font-semibold text-foreground">
                              ${(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Scan button */}
                <div className="border-t border-border p-5">
                  <button
                    onClick={scanProduct}
                    disabled={scanning || !!paymentSuccess}
                    className="group flex w-full items-center justify-center gap-3 border border-border bg-secondary/50 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-all hover:border-primary hover:bg-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <svg
                      className="h-4 w-4 transition-colors group-hover:text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    >
                      <path d="M2 4h2v16H2M6 4h1v16H6M10 4h1v16h-1M14 4h2v16h-2M19 4h1v16h-1M22 4h0v16" />
                    </svg>
                    Escanear producto
                    <kbd className="ml-2 hidden border border-border/80 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground md:inline-block">
                      Space
                    </kbd>
                  </button>
                </div>
              </div>

              {/* Right: Totals + Payment */}
              <div className="flex flex-col border-t border-border md:w-64 md:border-l md:border-t-0">
                {/* Totals */}
                <div className="flex flex-1 flex-col justify-end p-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Subtotal
                      </span>
                      <span className="font-mono text-sm text-muted-foreground">
                        <AnimatedTotal value={subtotal} />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        IVA 16%
                      </span>
                      <span className="font-mono text-sm text-muted-foreground">
                        <AnimatedTotal value={tax} />
                      </span>
                    </div>
                    <div className="my-2 h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-medium uppercase tracking-widest text-foreground">
                        Total
                      </span>
                      <span className="font-mono text-2xl font-bold text-primary">
                        <AnimatedTotal value={total} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment buttons */}
                <div className="flex flex-col gap-2 border-t border-border p-5">
                  <button
                    onClick={() => pay("Tarjeta")}
                    disabled={cart.length === 0 || !!paymentSuccess}
                    className="flex items-center justify-center gap-2 bg-primary px-4 py-3 font-mono text-xs font-medium uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" />
                      <path d="M1 10h22" />
                    </svg>
                    Pagar con tarjeta
                  </button>
                  <button
                    onClick={() => pay("Efectivo")}
                    disabled={cart.length === 0 || !!paymentSuccess}
                    className="flex items-center justify-center gap-2 border border-border px-4 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 8v8M9 12h6" />
                    </svg>
                    Pagar con efectivo
                    <kbd className="ml-1 hidden border border-border/80 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground md:inline-block">
                      Enter
                    </kbd>
                  </button>
                </div>
              </div>
            </div>

            {/* Scan animation overlay */}
            <AnimatePresence>
              {scanning && <ScanAnimation onComplete={onScanComplete} />}
            </AnimatePresence>

            {/* Payment success overlay */}
            <AnimatePresence>
              {paymentSuccess && (
                <PaymentSuccess method={paymentSuccess} onComplete={onPaymentComplete} />
              )}
            </AnimatePresence>
          </div>

          {/* Reflection / glow under terminal */}
          <div
            className="pointer-events-none mx-auto h-24 w-4/5 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at center top, oklch(0.78 0.12 165 / 0.15) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Keyboard hint */}
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
          Space para escanear &middot; Enter para pagar con efectivo
        </p>
      </div>
    </section>
  );
}
