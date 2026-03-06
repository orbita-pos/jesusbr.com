"use client";

import { useRef, useEffect, useCallback } from "react";

interface DataPulse {
  x: number;
  speed: number;
  waveIndex: number;
  opacity: number;
  size: number;
}

export function DataWaveBackground() {
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

    const waveCount = 5;
    const waveConfigs = Array.from({ length: waveCount }, (_, i) => ({
      yOffset: 0.2 + (i / waveCount) * 0.6,
      amplitude: 8 + Math.random() * 12,
      frequency: 0.003 + Math.random() * 0.004,
      speed: 0.005 + Math.random() * 0.008,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.04 + Math.random() * 0.04,
    }));

    const pulses: DataPulse[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * 100,
      speed: 0.08 + Math.random() * 0.15,
      waveIndex: Math.floor(Math.random() * waveCount),
      opacity: 0.25 + Math.random() * 0.35,
      size: 2 + Math.random() * 2,
    }));

    let time = 0;

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
      time += 1;

      // Draw waves
      for (let wi = 0; wi < waveCount; wi++) {
        const wc = waveConfigs[wi];
        const baseY = wc.yOffset * h;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y =
            baseY +
            Math.sin(x * wc.frequency + time * wc.speed + wc.phase) * wc.amplitude +
            Math.sin(x * wc.frequency * 0.5 + time * wc.speed * 0.7) * wc.amplitude * 0.5;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = `rgba(94, 234, 180, ${wc.opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw data pulses traveling along waves
      for (const pulse of pulses) {
        pulse.x += pulse.speed;
        if (pulse.x > 105) {
          pulse.x = -5;
          pulse.waveIndex = Math.floor(Math.random() * waveCount);
          pulse.speed = 0.08 + Math.random() * 0.15;
        }

        const wc = waveConfigs[pulse.waveIndex];
        const px = (pulse.x / 100) * w;
        const py =
          wc.yOffset * h +
          Math.sin(px * wc.frequency + time * wc.speed + wc.phase) * wc.amplitude +
          Math.sin(px * wc.frequency * 0.5 + time * wc.speed * 0.7) * wc.amplitude * 0.5;

        // Glow around pulse
        const grad = ctx.createRadialGradient(px, py, 0, px, py, pulse.size * 8);
        grad.addColorStop(0, `rgba(94, 234, 180, ${pulse.opacity * 0.4})`);
        grad.addColorStop(1, "rgba(94, 234, 180, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(px - pulse.size * 8, py - pulse.size * 8, pulse.size * 16, pulse.size * 16);

        // Core
        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 234, 180, ${pulse.opacity})`;
        ctx.fill();
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
      style={{ opacity: 0.6 }}
    />
  );
}
