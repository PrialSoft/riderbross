'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import styles from '@/app/page.module.css';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function wave(timeSec: number, periodSec: number, phase = 0) {
  return (Math.sin((timeSec * Math.PI * 2) / periodSec + phase) + 1) / 2;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function HeroLogo() {
  const stageRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLSpanElement>(null);
  const redRef = useRef<HTMLSpanElement>(null);
  const softRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Cursor normalizado respecto al centro del logo (-1..1)
    const pointer = { x: 0, y: 0 };
    const white = { x: 0, y: 0, scale: 1, opacity: 0.55 };
    const red = { x: 0, y: 0, scale: 1, opacity: 0.5 };
    const soft = { x: 0, y: 0, scale: 1, opacity: 0.4 };

    const updatePointer = (clientX: number, clientY: number) => {
      const stage = stageRef.current;
      const rect = stage?.getBoundingClientRect();
      const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 3;
      const halfW = rect ? Math.max(rect.width / 2, 1) : Math.max(window.innerWidth / 2, 1);
      const halfH = rect ? Math.max(rect.height / 2, 1) : Math.max(window.innerHeight / 2, 1);

      pointer.x = clamp((clientX - cx) / halfW, -1.5, 1.5);
      pointer.y = clamp((clientY - cy) / halfH, -1.5, 1.5);
    };

    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const idleAmount = reduceMotion ? 0 : 1;

      const idleA = wave(t, 11, 0) * idleAmount;
      const idleB = wave(t, 13, 1.4) * idleAmount;
      const idleC = wave(t, 12, 2.2) * idleAmount;
      const idleS = wave(t, 10, 0.8) * idleAmount;

      const px = pointer.x;
      const py = pointer.y;

      // Movimiento en % del propio orbe — amplificado para que se note
      const whiteTargetX = lerp(-8, 8, idleA || 0.5) + px * 42;
      const whiteTargetY = lerp(-6, 6, idleA || 0.5) + py * 34;
      const whiteTargetScale = 1 + Math.abs(px) * 0.08 + idleA * 0.05;
      const whiteTargetOpacity = 0.5 + Math.abs(px) * 0.12 + idleA * 0.12;

      const redTargetX = lerp(8, -8, idleB || 0.5) + px * -34;
      const redTargetY = lerp(-6, 8, idleB || 0.5) + py * -28;
      const redTargetScale = 1 + Math.abs(py) * 0.09 + idleB * 0.05;
      const redTargetOpacity = 0.45 + Math.abs(py) * 0.12 + idleB * 0.12;

      const softTargetX = lerp(-6, 6, idleC || 0.5) + px * 26;
      const softTargetY = lerp(6, -6, idleC || 0.5) + py * 22;
      const softTargetScale = 1 + Math.hypot(px, py) * 0.05 + idleC * 0.04;
      const softTargetOpacity = 0.35 + Math.hypot(px, py) * 0.08 + idleC * 0.1;

      const ease = 0.16;

      white.x = lerp(white.x, whiteTargetX, ease);
      white.y = lerp(white.y, whiteTargetY, ease);
      white.scale = lerp(white.scale, whiteTargetScale, ease);
      white.opacity = lerp(white.opacity, whiteTargetOpacity, ease);

      red.x = lerp(red.x, redTargetX, ease * 0.75);
      red.y = lerp(red.y, redTargetY, ease * 0.75);
      red.scale = lerp(red.scale, redTargetScale, ease * 0.75);
      red.opacity = lerp(red.opacity, redTargetOpacity, ease * 0.75);

      soft.x = lerp(soft.x, softTargetX, ease * 0.9);
      soft.y = lerp(soft.y, softTargetY, ease * 0.9);
      soft.scale = lerp(soft.scale, softTargetScale, ease * 0.9);
      soft.opacity = lerp(soft.opacity, softTargetOpacity, ease * 0.9);

      if (whiteRef.current) {
        whiteRef.current.style.transform = `translate3d(${white.x}%, ${white.y}%, 0) scale(${white.scale})`;
        whiteRef.current.style.opacity = String(clamp(white.opacity, 0.25, 0.85));
      }

      if (redRef.current) {
        redRef.current.style.transform = `translate3d(${red.x}%, ${red.y}%, 0) scale(${red.scale})`;
        redRef.current.style.opacity = String(clamp(red.opacity, 0.25, 0.8));
      }

      if (softRef.current) {
        softRef.current.style.transform = `translate3d(${soft.x}%, ${soft.y}%, 0) scale(${soft.scale})`;
        softRef.current.style.opacity = String(clamp(soft.opacity, 0.2, 0.7));
      }

      if (logoRef.current) {
        const wx = lerp(5, -6, idleS || 0.5) + px * 7;
        const wy = lerp(3, 5, idleS || 0.5) + py * 5;
        const rx = lerp(-5, 6, idleS || 0.5) + px * -5;
        const ry = lerp(4, 6, idleS || 0.5) + py * -4;
        logoRef.current.style.filter = [
          'drop-shadow(0 4px 4px rgba(0, 0, 0, 0.8))',
          `drop-shadow(${wx}px ${wy}px 12px rgba(250, 250, 250, 0.4))`,
          `drop-shadow(${rx}px ${ry}px 16px rgba(139, 26, 26, 0.42))`,
        ].join(' ');
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return (
    <Box className={styles.heroLogoContainer}>
      <div ref={stageRef} className={styles.heroLogoStage}>
        <span ref={whiteRef} className={`${styles.heroGlow} ${styles.heroGlowWhite}`} aria-hidden />
        <span ref={redRef} className={`${styles.heroGlow} ${styles.heroGlowRed}`} aria-hidden />
        <span ref={softRef} className={`${styles.heroGlow} ${styles.heroGlowSoft}`} aria-hidden />
        <Image
          ref={logoRef}
          src="/images/LogoRiderBross.png"
          alt="RiderBross Logo"
          width={900}
          height={900}
          priority
          className={styles.heroLogo}
        />
      </div>
    </Box>
  );
}
