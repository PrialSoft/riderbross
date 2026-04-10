'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';

import styles from './MarcasCarousel.module.css';

/** Píxeles por segundo (desplazamiento hacia la izquierda) */
const SPEED_PX_S = 100;

/** Opcional: en `.env.local` pon `NEXT_PUBLIC_MARCAS_ASSET_VERSION=2` y reinicia `npm run dev` para invalidar caché del optimizador al cambiar PNG con el mismo nombre. */
const MARCAS_ASSET_QUERY =
  typeof process.env.NEXT_PUBLIC_MARCAS_ASSET_VERSION === "string" &&
  process.env.NEXT_PUBLIC_MARCAS_ASSET_VERSION.trim() !== ""
    ? `?v=${encodeURIComponent(process.env.NEXT_PUBLIC_MARCAS_ASSET_VERSION.trim())}`
    : "";

function marcaSrc(file: string): string {
  return `/marcas/${encodeURIComponent(file)}${MARCAS_ASSET_QUERY}`;
}

const MARCAS: { file: string; label: string }[] = [
  { file: 'aprila.png', label: 'Aprilia' },
  { file: 'Bajaj.png', label: 'Bajaj' },
  { file: 'benelli.png', label: 'Benelli' },
  { file: 'beta.png', label: 'Beta' },
  { file: 'BMW.png', label: 'BMW' },
  { file: 'CF Moto.png', label: 'CF Moto' },
  { file: 'Ducati.png', label: 'Ducati' },
  { file: 'Gilera.png', label: 'Gilera' },
  { file: 'Harley Davidson.png', label: 'Harley-Davidson' },
  { file: 'honda.png', label: 'Honda' },
  { file: 'hERO.png', label: 'Hero' },
  { file: 'Husqvarna.png', label: 'Husqvarna' },
  { file: 'kawasaki.png', label: 'Kawasaki' },
  { file: 'KTM.png', label: 'KTM' },
  { file: 'Kymco.png', label: 'Kymco' },
  { file: 'mondial.png', label: 'Mondial' },
  { file: 'motomel.png', label: 'Motomel' },
  { file: 'MV Agusta.png', label: 'MV Agusta' },
  { file: 'Royal Enfield.png', label: 'Royal Enfield' },
  { file: 'suzuki.png', label: 'Suzuki' },
  { file: 'sym.png', label: 'SYM' },
  { file: 'tvs.png', label: 'TVS' },
  { file: 'vespa.png', label: 'Vespa' },
  { file: 'yamaha.png', label: 'Yamaha' },
  { file: 'zontes.png', label: 'Zontes' },
];

function LogoItem({
  file,
  label,
  decorative,
}: {
  file: string;
  label: string;
  decorative?: boolean;
}) {
  const src = marcaSrc(file);
  return (
    <div className={styles.logoWrap}>
      <Image
        src={src}
        alt={decorative ? '' : label}
        width={480}
        height={240}
        className={styles.logo}
        sizes="(max-width: 600px) 28vw, (max-width: 900px) 28vw, 26vw"
      />
    </div>
  );
}

function LogoStrip({ stripKey, decorative }: { stripKey: string; decorative?: boolean }) {
  return (
    <div
      className={decorative ? `${styles.group} ${styles.duplicate}` : styles.group}
      aria-hidden={decorative}
      data-marca-strip={decorative ? 'b' : 'a'}
    >
      {MARCAS.map(({ file, label }) => (
        <LogoItem
          key={`${stripKey}-${file}`}
          file={file}
          label={label}
          decorative={decorative}
        />
      ))}
    </div>
  );
}

export function MarcasCarousel() {
  const moverRef = useRef<HTMLDivElement>(null);
  const loopPxRef = useRef(0);
  const offsetPxRef = useRef(0);
  const pausedHoverRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const measureLoop = useCallback(() => {
    const mover = moverRef.current;
    if (!mover) return;
    const stripA = mover.querySelector<HTMLElement>('[data-marca-strip="a"]');
    const wA = stripA?.getBoundingClientRect().width ?? 0;
    const half = mover.scrollWidth / 2;
    let next = wA > 2 ? wA : half > 2 ? half : 0;
    if (next <= 0 && mover.scrollWidth > 4) {
      next = mover.scrollWidth / 2;
    }
    loopPxRef.current = next;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReduce = () => {
      reduceMotionRef.current = mq.matches;
    };
    syncReduce();
    mq.addEventListener('change', syncReduce);

    const mover = moverRef.current;
    if (!mover) {
      mq.removeEventListener('change', syncReduce);
      return;
    }

    measureLoop();
    const ro = new ResizeObserver(() => {
      measureLoop();
    });
    ro.observe(mover);

    const speed = () => (reduceMotionRef.current ? SPEED_PX_S * 0.2 : SPEED_PX_S);

    const tick = (now: number) => {
      const last = lastTsRef.current;
      lastTsRef.current = now;
      const dt = last != null ? Math.min((now - last) / 1000, 0.1) : 0;

      let loopW = loopPxRef.current;
      if (loopW <= 0) {
        measureLoop();
        loopW = loopPxRef.current;
      }

      if (loopW > 0 && dt > 0 && !pausedHoverRef.current) {
        offsetPxRef.current += speed() * dt;
        while (offsetPxRef.current >= loopW) {
          offsetPxRef.current -= loopW;
        }
        mover.style.transform = `translate3d(${-offsetPxRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      mq.removeEventListener('change', syncReduce);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      ro.disconnect();
      mover.style.transform = '';
      lastTsRef.current = null;
    };
  }, [measureLoop]);

  return (
    <section className={styles.section} aria-label="Marcas de motocicletas">
      <div
        className={styles.viewport}
        onMouseEnter={() => {
          pausedHoverRef.current = true;
        }}
        onMouseLeave={() => {
          pausedHoverRef.current = false;
        }}
      >
        <div className={styles.mover} ref={moverRef}>
          <LogoStrip stripKey="a" />
          <LogoStrip stripKey="b" decorative />
        </div>
      </div>
    </section>
  );
}
