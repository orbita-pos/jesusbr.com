"use client";

import { useRef, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
}

export function SignalRippleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(true);
  const mouseRef = useRef({ x: -1, y: -1 });
  const ripplesRef = useRef<Ripple[]>([]);
  const lastRippleTime = useRef(0);
  const { resolvedTheme } = useTheme();

  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    return { ctx, w, h };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Track mouse position relative to canvas
    const section = canvas.parentElement;
    const handleMouseMove = (e: MouseEvent) => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    section?.addEventListener("mousemove", handleMouseMove);

    // Ambient ripples that spawn periodically
    const ambientTimer = setInterval(() => {
      if (!visibleRef.current) return;
      const result = setup();
      if (!result) return;
      ripplesRef.current.push({
        x: Math.random() * result.w,
        y: Math.random() * result.h,
        radius: 0,
        opacity: 0.08 + Math.random() * 0.06,
        speed: 0.4 + Math.random() * 0.3,
      });
    }, 2000 + Math.random() * 1500);

    function animate() {
      if (!visibleRef.current) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const result = setup();
      if (!result) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const { ctx, w, h } = result;
      ctx.clearRect(0, 0, w, h);

      const now = Date.now();
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Spawn cursor ripples at intervals
      if (mx > 0 && my > 0 && now - lastRippleTime.current > 400) {
        ripplesRef.current.push({
          x: mx,
          y: my,
          radius: 0,
          opacity: 0.12,
          speed: 0.6,
        });
        lastRippleTime.current = now;
      }

      const dark = document.documentElement.classList.contains("dark");
      const c = dark ? "94, 234, 180" : "16, 120, 90";

      // Draw static radial grid from center
      const centerX = w / 2;
      const centerY = h / 2;
      for (let r = 50; r < Math.max(w, h); r += 80) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${c}, 0.015)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Update and draw ripples
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += rp.speed;
        rp.opacity *= 0.993;

        if (rp.opacity < 0.003 || rp.radius > 300) {
          ripples.splice(i, 1);
          continue;
        }

        for (let ring = 0; ring < 3; ring++) {
          const ringRadius = rp.radius - ring * 12;
          if (ringRadius <= 0) continue;

          ctx.beginPath();
          ctx.arc(rp.x, rp.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c}, ${rp.opacity * (1 - ring * 0.3)})`;
          ctx.lineWidth = 0.8 - ring * 0.2;
          ctx.stroke();
        }
      }

      if (mx > 0 && my > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        grad.addColorStop(0, `rgba(${c}, 0.04)`);
        grad.addColorStop(1, `rgba(${c}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(mx - 80, my - 80, 160, 160);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      section?.removeEventListener("mousemove", handleMouseMove);
      clearInterval(ambientTimer);
    };
  }, [setup, resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.7 }}
    />
  );
}
