import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { easeInOutCubic } from '@/lib/morphCanvas';

type Props = {
  headshotSrcs: string[];
  heroImageSrc: string;
  heroTitle?: ReactNode;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  // Image-space fractions [x, y] for each person's head in the hero image.
  // When provided, start positions are computed dynamically to stay aligned
  // with the actual heads regardless of viewport size.
  headPositions?: Array<[number, number]>;
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

// Per-face avatar scale factors — aesthetic, not geometric.
const FACE_SCALES = [0.8, 0.8, 0.85, 0.9, 0.85, 0.85];

// Fallback start positions used when headPositions prop is absent.
const FALLBACK_START: Array<{ x: number; y: number; s: number }> = [
  { x: 0.16,  y: 0.12,  s: 0.8  },
  { x: 0.239, y: 0.295, s: 0.8  },
  { x: 0.40,  y: 0.44,  s: 0.85 },
  { x: 0.76,  y: 0.22,  s: 0.9  },
  { x: 0.835, y: 0.19,  s: 0.85 },
];

// Convert an image-space fraction to a viewport-space fraction, accounting
// for object-fit:cover and the given object-position (as 0–1 fractions).
function imageToViewport(
  fx: number, fy: number,
  imgW: number, imgH: number,
  conW: number, conH: number,
  posX = 0.5, posY = 0.3,
): { x: number; y: number } {
  const scale = Math.max(conW / imgW, conH / imgH);
  const renderW = imgW * scale;
  const renderH = imgH * scale;
  const offsetX = conW * posX - renderW * posX;
  const offsetY = conH * posY - renderH * posY;
  return {
    x: (offsetX + fx * renderW) / conW,
    y: (offsetY + fy * renderH) / conH,
  };
}

export function HalfCircleCaregivers({
  headshotSrcs,
  heroImageSrc,
  heroTitle,
  title,
  subtitle,
  children,
  headPositions,
}: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);
  const [imageNatSize, setImageNatSize] = useState<{ w: number; h: number } | null>(null);
  const [containerSize, setContainerSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  const faces = useMemo(() => {
    return headshotSrcs.filter(Boolean).slice(0, 6);
  }, [headshotSrcs]);

  const startPositions = useMemo(() => {
    if (!headPositions || !imageNatSize) return FALLBACK_START;

    // faceWrap uses translate(-50%, -80%): the avatar face center (at 50% of
    // element height) appears 30% of face-diameter above the positioning point.
    // Shift the positioning point down by that amount so the face center lands
    // exactly on the image face center.
    const facePx = Math.min(116, Math.max(72, containerSize.w * 0.11));
    const yShift = (0.3 * facePx) / containerSize.h;

    return headPositions.map(([fx, fy], i) => {
      const { x, y } = imageToViewport(
        fx, fy,
        imageNatSize.w, imageNatSize.h,
        containerSize.w, containerSize.h,
      );
      return { x, y: y + yShift, s: FACE_SCALES[i] ?? 0.85 };
    });
  }, [headPositions, imageNatSize, containerSize]);

  const arcPositions = useMemo(() => {
    const n = 6;
    const cx = 0.50;
    const cy = 0.66;
    const rx = 0.40;
    const ry = 0.24;

    const positions: Array<{ x: number; y: number; s: number }> = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const angle = Math.PI * (1 - t);
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
        setContainerSize({ w: window.innerWidth, h: window.innerHeight });
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const raw = total <= 0 ? 0 : scrolled / total;
        setProgress(clamp01(raw));
      });
    };

    // If the image is already loaded (cached), read natural size immediately.
    const img = imgRef.current;
    if (img?.naturalWidth) {
      setImageNatSize({ w: img.naturalWidth, h: img.naturalHeight });
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const t = reducedMotion ? 1 : easeInOutCubic(clamp01((progress - 0.14) / 0.48));

  const heroFade = reducedMotion
    ? 0
    : 1 - easeInOutCubic(clamp01((progress - 0.28) / 0.48));

  const thanksReveal = reducedMotion ? 1 : easeInOutCubic(clamp01((progress - 0.33) / 0.22));

  const quoteReveal = reducedMotion ? 1 : easeInOutCubic(clamp01((progress - 0.60) / 0.12));

  const convergeT = reducedMotion ? 0 : easeInOutCubic(clamp01((progress - 0.74) / 0.18));

  const titleOpacity = reducedMotion ? 0 : 1 - easeInOutCubic(clamp01((progress - 0.14) / 0.22));

  return (
    <div ref={sectionRef} className="halfCircle-caregivers" aria-label="Caregivers who do it all">
      <div className="halfCircle-caregivers__sticky">
        <img
          ref={imgRef}
          src={heroImageSrc}
          alt=""
          aria-hidden="true"
          className="halfCircle-caregivers__heroImage"
          loading="eager"
          decoding="async"
          onLoad={(e) => {
            const img = e.currentTarget;
            setImageNatSize({ w: img.naturalWidth, h: img.naturalHeight });
          }}
        />
        <div className="halfCircle-caregivers__bg" aria-hidden="true" style={{ opacity: 1 - heroFade }} />

        {heroTitle && (
          <div
            className="halfCircle-caregivers__heroTitle"
            style={{ opacity: titleOpacity }}
          >
            {heroTitle}
          </div>
        )}

        <div
          className="halfCircle-caregivers__head"
          style={{
            opacity: thanksReveal * (1 - convergeT),
            transform: `translateY(${20 - thanksReveal * 20}px)`,
          }}
        >
          <h3 className="font-display text-3xl text-foreground">{title}</h3>
          {subtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
          {children}
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
        </p>
      </div>
    </div>
  );
}
