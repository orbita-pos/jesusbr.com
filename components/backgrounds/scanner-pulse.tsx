"use client";

import { useRef, useEffect, useCallback } from "react";

interface ScanBeam {
  x: number;
  targetX: number;
  y: number;
  height: number;
  opacity: number;
  active: boolean;
  timer: number;
}

interface RipplePulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

export function ScannerPulseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(true);

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

    // Scan beams - vertical lines that sweep horizontally
    const beams: ScanBeam[] = Array.from({ length: 3 }, () => ({
      x: Math.random() * 100,
      targetX: Math.random() * 100,
      y: 20 + Math.random() * 60,
      height: 15 + Math.random() * 25,
      opacity: 0,
      active: false,
      timer: Math.random() * 300,
    }));

    const ripples: RipplePulse[] = [];
    let frameCount = 0;

    // Subtle product grid
    const gridCols = 12;
    const gridRows = 6;

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
      frameCount++;

      // Draw subtle product grid (small rectangles representing products)
      const cellW = w / gridCols;
      const cellH = h / gridRows;
      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const cx = c * cellW + cellW / 2;
          const cy = r * cellH + cellH / 2;
          const pw = cellW * 0.3;
          const ph = cellH * 0.2;
          ctx.fillStyle = "rgba(94, 234, 180, 0.015)";
          ctx.fillRect(cx - pw / 2, cy - ph / 2, pw, ph);
        }
      }

      // Update and draw scan beams
      for (const beam of beams) {
        beam.timer--;
        if (beam.timer <= 0 && !beam.active) {
          beam.active = true;
          beam.opacity = 0;
          beam.x = Math.random() * 100;
          beam.targetX = beam.x + (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40);
          beam.y = 15 + Math.random() * 70;
          beam.height = 10 + Math.random() * 20;
        }

        if (beam.active) {
          // Fade in then out
          const dx = beam.targetX - beam.x;
          const progress = 1 - Math.abs(dx) / (20 + Math.random() * 0.01 + 40);
          beam.opacity = Math.sin(progress * Math.PI) * 0.12;

          beam.x += (beam.targetX > beam.x ? 0.3 : -0.3);

          if (Math.abs(beam.x - beam.targetX) < 1) {
            beam.active = false;
            beam.timer = 120 + Math.random() * 240;

            // Spawn a ripple at the end position
            ripples.push({
              x: (beam.x / 100) * w,
              y: (beam.y / 100) * h,
              radius: 0,
              maxRadius: 60 + Math.random() * 40,
              opacity: 0.15,
            });
          }

          // Draw beam
          const bx = (beam.x / 100) * w;
          const by = (beam.y / 100) * h;
          const bh = (beam.height / 100) * h;

          // Vertical scan line
          ctx.beginPath();
          ctx.moveTo(bx, by - bh / 2);
          ctx.lineTo(bx, by + bh / 2);
          ctx.strokeStyle = `rgba(94, 234, 180, ${beam.opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Glow
          const grad = ctx.createLinearGradient(bx - 30, by, bx + 30, by);
          grad.addColorStop(0, "rgba(94, 234, 180, 0)");
          grad.addColorStop(0.5, `rgba(94, 234, 180, ${beam.opacity * 0.4})`);
          grad.addColorStop(1, "rgba(94, 234, 180, 0)");
          ctx.fillStyle = grad;
          ctx.fillRect(bx - 30, by - bh / 2, 60, bh);
        }
      }

      // Update and draw ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += 0.8;
        rp.opacity *= 0.985;

        if (rp.opacity < 0.005 || rp.radius > rp.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(94, 234, 180, ${rp.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [setup]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.7 }}
    />
  );
}
