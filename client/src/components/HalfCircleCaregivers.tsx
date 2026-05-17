import { useEffect, useMemo, useRef, useState } from 'react';
import { easeInOutCubic } from '@/lib/morphCanvas';

type Props = {
  headshotSrcs: string[];
  heroImageSrc: string;
  title: string;
  subtitle?: string;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;

    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener?.('change', onChange);
    return () => media.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

const QUOTES = [
  "Finally got my claim approved",
  "Saved us over $12,000",
  "She fought like family",
  "Didn't know I could appeal",
  "Worth every penny",
  "Like having a doctor friend",
];

export function HalfCircleCaregivers({
  headshotSrcs,
  heroImageSrc,
  title,
  subtitle,
}: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  const faces = useMemo(() => {
    // Luffu section shows 6 headshots in the arc.
    return headshotSrcs.filter(Boolean).slice(0, 6);
  }, [headshotSrcs]);

  // Fixed start and end coordinates (percent space) to make the animation
  // deterministic and match the reference composition.
  const startPositions = useMemo(() => {
    // index 0.5 (left->right)
    return [
      { x: 0.16, y: 0.12, s: 0.8 }, // teenager standing far left
      { x: 0.239, y: 0.295, s: 0.8 }, // girl kicking ball (head bent low)
      { x: 0.40, y: 0.44, s: 0.85 }, // boy running center
      { x: 0.76, y: 0.22, s: 0.9 }, // woman striped shirt right
      { x: 0.835, y: 0.19, s: 0.85 }, // man teal polo far right
    ];
  }, []);

  const arcPositions = useMemo(() => {
    // Final half circle layout (arc above a flat bottom).
    // Tuned for a full-viewport sticky container.
    const n = 6;
    const cx = 0.50;
    const cy = 0.66;
    const rx = 0.40;
    const ry = 0.24;

    const positions: Array<{ x: number; y: number; s: number }> = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const angle = Math.PI * (1 - t); // left->right
      const x = cx + Math.cos(angle) * rx;
      const y = cy - Math.sin(angle) * ry;
      const s = 0.92 + 0.10 * (1 - Math.abs(t - 0.5) * 2);
      positions.push({ x, y, s });
    }
    return positions;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const raw = total <= 0 ? 0 : scrolled / total;
        setProgress(clamp01(raw));
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Timing window: start forming after a short scroll, settle fully mid-scroll.
  const t = reducedMotion ? 1 : easeInOutCubic(clamp01((progress - 0.14) / 0.48));

  // Fade the hero background away as the faces form the arc.
  const heroFade = reducedMotion
    ? 0
    : 1 - easeInOutCubic(clamp01((progress - 0.28) / 0.48));

  const thanksReveal = reducedMotion ? 1 : easeInOutCubic(clamp01((progress - 0.33) / 0.22));

  // Quote bubbles appear after arc settles.
  const quoteReveal = reducedMotion ? 1 : easeInOutCubic(clamp01((progress - 0.60) / 0.12));

  // Faces + quotes converge to center and fade out.
  const convergeT = reducedMotion ? 0 : easeInOutCubic(clamp01((progress - 0.74) / 0.18));

  return (
    <div ref={sectionRef} className="halfCircle-caregivers" aria-label="Caregivers who do it all">
      <div className="halfCircle-caregivers__sticky">
        <img
          src={heroImageSrc}
          alt=""
          aria-hidden="true"
          className="halfCircle-caregivers__heroImage"
          loading="eager"
          decoding="async"
        />
        <div className="halfCircle-caregivers__bg" aria-hidden="true" style={{ opacity: 1 - heroFade }} />

        <div
          className="halfCircle-caregivers__head"
          style={{
            opacity: thanksReveal * (1 - convergeT),
            transform: `translateY(${20 - thanksReveal * 20}px)`,
          }}
        >
          <h3 className="font-display text-3xl text-foreground">{title}</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="halfCircle-caregivers__faces" aria-hidden="true">
          {faces.map((src, i) => {
            const a = arcPositions[i];
            const s = startPositions[i];
            if (!a || !s) return null;

            const arcX = s.x + (a.x - s.x) * t;
            const arcY = s.y + (a.y - s.y) * t;
            const x = arcX + (0.50 - a.x) * convergeT;
            const y = arcY + (0.90 - a.y) * convergeT;
            const scale = s.s + (a.s - s.s) * t;
            const faceOpacity = 1 - convergeT;
            const quotePlacement = i === 2 || i === 3 ? 'above' : i >= faces.length / 2 ? 'left' : 'right';
            const quoteOpacity = quoteReveal * (1 - convergeT);

            return (
              <div
                key={`${src}-${i}`}
                className="halfCircle-caregivers__faceWrap"
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`,
                  transform: `translate(-50%, -80%) scale(${scale})`,
                  opacity: faceOpacity,
                }}
              >
                <div className="halfCircle-caregivers__face">
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </div>
                <div
                  className={`halfCircle-caregivers__quote halfCircle-caregivers__quote--${quotePlacement}`}
                  style={{ opacity: quoteOpacity }}
                >
                  {QUOTES[i]}
                </div>
              </div>
            );
          })}
        </div>

        <p
          className="halfCircle-caregivers__thanks"
          aria-live="polite"
          style={{
            opacity: thanksReveal * (1 - convergeT),
            transform: `translate(-50%, ${20 - thanksReveal * 20}px)`,
          }}
        >
          Your mind is brimming with questions, concerns, and an ever changing list of who-needs-what-when. Brivon's advocates learn your rhythms and stays on top of it all, so you can focus on being in the moment.
        </p>
      </div>
    </div>
  );
}

