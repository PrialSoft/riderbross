'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import styles from '@/app/page.module.css';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Oscilación suave 0→1→0 */
function wave(timeSec: number, periodSec: number, phase = 0) {
  return (Math.sin((timeSec * Math.PI * 2) / periodSec + phase) + 1) / 2;
}

export default function HeroLogo() {
  const whiteRef = useRef<HTMLSpanElement>(null);
  const redRef = useRef<HTMLSpanElement>(null);
  const softRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let rafId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      // Un poco más rápido y visible que el ajuste ultra-sutil
      const a = wave(t, 11, 0);
      const b = wave(t, 13, 1.4);
      const c = wave(t, 12, 2.2);
      const s = wave(t, 10, 0.8);

      if (whiteRef.current) {
        const x = lerp(-16, 16, a);
        const y = lerp(-12, 12, a);
        const scale = lerp(1, 1.07, a);
        whiteRef.current.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${scale})`;
        whiteRef.current.style.opacity = String(lerp(0.45, 0.68, a));
      }

      if (redRef.current) {
        const x = lerp(15, -15, b);
        const y = lerp(-11, 14, b);
        const scale = lerp(1, 1.08, b);
        redRef.current.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${scale})`;
        redRef.current.style.opacity = String(lerp(0.4, 0.62, b));
      }

      if (softRef.current) {
        const x = lerp(-10, 12, c);
        const y = lerp(12, -10, c);
        const scale = lerp(1, 1.06, c);
        softRef.current.style.transform = `translate3d(${x}%, ${y}%, 0) scale(${scale})`;
        softRef.current.style.opacity = String(lerp(0.32, 0.5, c));
      }

      if (logoRef.current) {
        const wx = lerp(5, -6, s);
        const wy = lerp(3, 5, s);
        const rx = lerp(-5, 6, s);
        const ry = lerp(4, 6, s);
        logoRef.current.style.filter = [
          'drop-shadow(0 4px 4px rgba(0, 0, 0, 0.8))',
          `drop-shadow(${wx}px ${wy}px 12px rgba(250, 250, 250, 0.4))`,
          `drop-shadow(${rx}px ${ry}px 16px rgba(139, 26, 26, 0.42))`,
        ].join(' ');
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <Box className={styles.heroLogoContainer}>
      <Box className={styles.heroLogoStage}>
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
      </Box>
    </Box>
  );
}
