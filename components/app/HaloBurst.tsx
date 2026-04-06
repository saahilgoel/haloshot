"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
  brightness: number;
}

interface HaloBurstProps {
  /** Trigger the burst when this becomes true */
  active: boolean;
  /** Score determines intensity: higher = more particles + bigger ring */
  score: number;
}

export function HaloBurst({ active, score }: HaloBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const cx = w / 2;
    const cy = h * 0.35; // centered on where the score ring will be

    const particles: Particle[] = [];
    let ringRadius = 0;
    let ringOpacity = 1;
    let frame = 0;

    // Intensity scales with score
    const intensity = Math.max(0.5, score / 100);
    const particleCount = Math.round(40 * intensity);
    const maxRingRadius = 120 * intensity;

    // Create initial burst particles
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 2.5 * intensity;
      const life = 60 + Math.random() * 80;

      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // bias upward
        life,
        maxLife: life,
        size: 2 + Math.random() * 3,
        hue: 30 + Math.random() * 20, // amber range: 30-50
        brightness: 70 + Math.random() * 30,
      });
    }

    // Add slow-rising embers
    for (let i = 0; i < particleCount * 0.6; i++) {
      const life = 100 + Math.random() * 120;
      particles.push({
        x: cx + (Math.random() - 0.5) * 100,
        y: cy + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 1.2,
        life,
        maxLife: life,
        size: 1 + Math.random() * 2.5,
        hue: 35 + Math.random() * 15,
        brightness: 80 + Math.random() * 20,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      frame++;

      // Expanding ring of light
      if (ringRadius < maxRingRadius) {
        ringRadius += 3;
        ringOpacity = Math.max(0, 1 - ringRadius / maxRingRadius);

        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(38, 90%, 65%, ${ringOpacity * 0.6})`;
        ctx.lineWidth = 3 + (1 - ringRadius / maxRingRadius) * 8;
        ctx.stroke();

        // Inner glow
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, ringRadius * 0.8);
        gradient.addColorStop(0, `hsla(38, 90%, 60%, ${ringOpacity * 0.15})`);
        gradient.addColorStop(1, `hsla(38, 90%, 60%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Update and draw particles
      let alive = 0;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive++;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01; // very slight gravity
        p.vx *= 0.995; // air resistance
        p.life--;

        const progress = 1 - p.life / p.maxLife;
        const alpha = progress < 0.1
          ? progress / 0.1 // fade in
          : p.life < 20
          ? p.life / 20 // fade out
          : 1;

        const size = p.size * (1 - progress * 0.3);

        // Glowing ember
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);

        // Outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
        glow.addColorStop(0, `hsla(${p.hue}, 90%, ${p.brightness}%, ${alpha * 0.4})`);
        glow.addColorStop(1, `hsla(${p.hue}, 90%, ${p.brightness}%, 0)`);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, ${p.brightness + 10}%, ${alpha})`;
        ctx.fill();
      }

      if (alive > 0 || ringRadius < maxRingRadius) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [active, score]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
