"use client";

import { useRef, useEffect, useCallback } from "react";

interface Line {
  y: number;
  speed: number;
  opacity: number;
  pulses: Pulse[];
}

interface Pulse {
  x: number;
  speed: number;
  size: number;
  opacity: number;
}

export function TransactionFlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(true);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    // Intersection Observer to pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const lineCount = 8;
    const lines: Line[] = Array.from({ length: lineCount }, (_, i) => ({
      y: (i / lineCount) * 100,
      speed: 0.002 + Math.random() * 0.003,
      opacity: 0.04 + Math.random() * 0.06,
      pulses: Array.from(
        { length: 2 + Math.floor(Math.random() * 3) },
        () => ({
          x: Math.random() * 100,
          speed: 0.15 + Math.random() * 0.25,
          size: 2 + Math.random() * 3,
          opacity: 0.3 + Math.random() * 0.4,
        })
      ),
    }));

    let time = 0;

    function animate() {
      if (!visibleRef.current) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const result = draw();
      if (!result) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const { ctx, w, h } = result;

      ctx.clearRect(0, 0, w, h);
      time += 1;

      for (const line of lines) {
        const yPos = (line.y / 100) * h;

        // Draw the horizontal line
        ctx.beginPath();
        ctx.moveTo(0, yPos);
        ctx.lineTo(w, yPos);
        ctx.strokeStyle = `rgba(94, 234, 180, ${line.opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Draw pulses traveling along the line
        for (const pulse of line.pulses) {
          pulse.x += pulse.speed;
          if (pulse.x > 110) {
            pulse.x = -10;
            pulse.speed = 0.15 + Math.random() * 0.25;
          }

          const px = (pulse.x / 100) * w;

          // Glow
          const grad = ctx.createRadialGradient(px, yPos, 0, px, yPos, pulse.size * 8);
          grad.addColorStop(0, `rgba(94, 234, 180, ${pulse.opacity * 0.5})`);
          grad.addColorStop(1, "rgba(94, 234, 180, 0)");
          ctx.fillStyle = grad;
          ctx.fillRect(px - pulse.size * 8, yPos - pulse.size * 8, pulse.size * 16, pulse.size * 16);

          // Core dot
          ctx.beginPath();
          ctx.arc(px, yPos, pulse.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(94, 234, 180, ${pulse.opacity})`;
          ctx.fill();

          // Trail
          ctx.beginPath();
          ctx.moveTo(px, yPos);
          ctx.lineTo(px - 30, yPos);
          const trailGrad = ctx.createLinearGradient(px - 30, yPos, px, yPos);
          trailGrad.addColorStop(0, "rgba(94, 234, 180, 0)");
          trailGrad.addColorStop(1, `rgba(94, 234, 180, ${pulse.opacity * 0.3})`);
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = pulse.size * 0.8;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ opacity: 0.6 }}
    />
  );
}
