"use client";

import { useRef, useEffect, useCallback } from "react";

interface ArchNode {
  x: number;
  y: number;
  label: string;
  radius: number;
  opacity: number;
  pulsePhase: number;
}

interface Signal {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  opacity: number;
  active: boolean;
  cooldown: number;
}

export function ArchitectureGraphBackground() {
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

    // Fixed infrastructure nodes in a loose graph layout
    const nodePositions: { x: number; y: number; label: string }[] = [
      { x: 15, y: 25, label: "API" },
      { x: 40, y: 15, label: "Auth" },
      { x: 65, y: 20, label: "CDN" },
      { x: 85, y: 30, label: "Edge" },
      { x: 25, y: 50, label: "DB" },
      { x: 50, y: 45, label: "App" },
      { x: 75, y: 50, label: "Queue" },
      { x: 15, y: 75, label: "Store" },
      { x: 40, y: 70, label: "Cache" },
      { x: 60, y: 75, label: "Log" },
      { x: 85, y: 70, label: "Mon" },
    ];

    const nodes: ArchNode[] = nodePositions.map((p) => ({
      ...p,
      radius: 3,
      opacity: 0.2 + Math.random() * 0.15,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Define edges between nodes
    const edges: [number, number][] = [
      [0, 1], [1, 2], [2, 3],
      [0, 4], [1, 5], [2, 6], [3, 6],
      [4, 5], [5, 6],
      [4, 7], [4, 8], [5, 8], [5, 9],
      [6, 10], [7, 8], [8, 9], [9, 10],
    ];

    // Create signals that travel between connected nodes
    const signals: Signal[] = edges.map(([from, to]) => ({
      fromIndex: from,
      toIndex: to,
      progress: 0,
      speed: 0.003 + Math.random() * 0.005,
      opacity: 0,
      active: false,
      cooldown: 60 + Math.random() * 300,
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
      time += 0.01;

      // Draw edges
      for (const [fi, ti] of edges) {
        const from = nodes[fi];
        const to = nodes[ti];
        const x1 = (from.x / 100) * w;
        const y1 = (from.y / 100) * h;
        const x2 = (to.x / 100) * w;
        const y2 = (to.y / 100) * h;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "rgba(94, 234, 180, 0.04)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Update and draw signals
      for (const sig of signals) {
        if (!sig.active) {
          sig.cooldown--;
          if (sig.cooldown <= 0) {
            sig.active = true;
            sig.progress = 0;
            sig.opacity = 0.4 + Math.random() * 0.3;
            // Randomly reverse direction
            if (Math.random() > 0.5) {
              const tmp = sig.fromIndex;
              sig.fromIndex = sig.toIndex;
              sig.toIndex = tmp;
            }
          }
          continue;
        }

        sig.progress += sig.speed;

        if (sig.progress >= 1) {
          sig.active = false;
          sig.cooldown = 100 + Math.random() * 400;
          continue;
        }

        const from = nodes[sig.fromIndex];
        const to = nodes[sig.toIndex];
        const x1 = (from.x / 100) * w;
        const y1 = (from.y / 100) * h;
        const x2 = (to.x / 100) * w;
        const y2 = (to.y / 100) * h;

        const sx = x1 + (x2 - x1) * sig.progress;
        const sy = y1 + (y2 - y1) * sig.progress;
        const fadeOpacity = sig.opacity * Math.sin(sig.progress * Math.PI);

        // Signal glow
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 15);
        grad.addColorStop(0, `rgba(94, 234, 180, ${fadeOpacity * 0.5})`);
        grad.addColorStop(1, "rgba(94, 234, 180, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(sx - 15, sy - 15, 30, 30);

        // Signal dot
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 234, 180, ${fadeOpacity})`;
        ctx.fill();
      }

      // Draw nodes
      for (const node of nodes) {
        const nx = (node.x / 100) * w;
        const ny = (node.y / 100) * h;
        const pulse = Math.sin(time * 1.5 + node.pulsePhase) * 0.5 + 0.5;
        const op = node.opacity * (0.7 + pulse * 0.3);

        // Outer glow ring
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius * 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(94, 234, 180, ${op * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Core
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(94, 234, 180, ${op})`;
        ctx.fill();

        // Label
        ctx.font = "8px monospace";
        ctx.fillStyle = `rgba(94, 234, 180, ${op * 0.5})`;
        ctx.textAlign = "center";
        ctx.fillText(node.label, nx, ny + node.radius * 3 + 10);
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
