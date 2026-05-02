import { useEffect, useMemo, useRef, useState } from 'react';
import { easeInOutCubic } from '@/lib/morphCanvas';

type HeadshotSrc = string | { src: string; objectPosition?: string };

function headshotUrl(h: HeadshotSrc): string {
  return typeof h === 'string' ? h : h.src;
}
function headshotPos(h: HeadshotSrc): string {
  return typeof h === 'string' ? 'center' : (h.objectPosition ?? 'center');
}

type Props = {
  heroImageSrc: string;
  headshotSrcs: HeadshotSrc[];
  heightVh?: number;
};

// Fixed template to mirror the hero composition:
// same count and locked positions instead of adaptive auto-layout.
const Morphed_head = [
  { cx: 0.08, cy: 0.15, r: 0.090 },
  { cx: 0.20, cy: 0.65, r: 0.095 },
  { cx: 0.38, cy: 0.20, r: 0.090 },
  { cx: 0.58, cy: 0.68, r: 0.100 },
  { cx: 0.74, cy: 0.18, r: 0.090 },
  { cx: 0.88, cy: 0.58, r: 0.090 },
] as const;

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

export function ScrollMorphHero({
  heroImageSrc,
  headshotSrcs,
  heightVh = 300,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [uiProgress, setUiProgress] = useState(0);

  const headshots = useMemo(() => {
    // lock count to matched hero template
    return headshotSrcs.filter(Boolean).slice(0, Morphed_head.length);
  }, [headshotSrcs]);
  const faceLayout = Morphed_head.slice(0, headshots.length);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const totalScroll = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const next = clamp01(totalScroll <= 0 ? 0 : scrolled / totalScroll);
      setUiProgress((prev) => (Math.abs(prev - next) > 0.01 ? next : prev));
    };
    computeProgress();
    window.addEventListener('scroll', computeProgress, { passive: true });
    window.addEventListener('resize', computeProgress);

    return () => {
      window.removeEventListener('scroll', computeProgress);
      window.removeEventListener('resize', computeProgress);
    };
  }, []);

  // Tuned to match Luffu-style switch timing:
  // hold hero longer, transition around mid-late scroll, then settle into faces.
  // Fade the hero background during scroll (so it's clearly noticeable).
  // Luffu-like handoff: later than the midpoint, but not so late that it feels static.
  const heroSceneOpacity = 1 - easeInOutCubic(clamp01((uiProgress - 0.30) / 0.28));
  // Faces should remain pinned and visible on top of the hero background.
  // We only apply a subtle early scale so it still feels like a reveal.
  const facesScale = reducedMotion ? 1 : 0.96 + easeInOutCubic(clamp01(uiProgress / 0.22)) * 0.06;

  return (
    <section
      ref={(el) => {
        sectionRef.current = el;
      }}
      className="morph-hero"
      style={{ height: `${Math.max(220, heightVh)}vh` }}
      aria-label="Intro"
    >
      <div className="morph-hero__sticky">
        <div className="morph-hero__bg" aria-hidden="true" style={{ opacity: heroSceneOpacity }} />

        <div className="morph-hero__scene morph-hero__scene--hero" style={{ opacity: heroSceneOpacity }}>
          <img
            src={heroImageSrc}
            alt=""
            className="morph-hero__heroImage"
            loading="eager"
            decoding="async"
            aria-hidden="true"
          />
        </div>

        <div
          className="morph-hero__scene morph-hero__scene--faces"
          aria-hidden="true"
        >
          <div className="morph-hero__faceLayer">
            {headshots.slice(0, faceLayout.length).map((src, i) => {
              const spot = faceLayout[i];
              if (!spot) return null;
              // Use viewport-relative sizing so circles feel like true scene elements,
              // not small UI avatars.
              const size = `${(spot.r * 200).toFixed(2)}vmin`;
              return (
                <div
                  key={`${headshotUrl(src)}-face-${i}`}
                  className="morph-hero__face"
                  style={{
                    left: `${spot.cx * 100}%`,
                    top: `${spot.cy * 100}%`,
                    width: size,
                    height: size,
                    opacity: 1,
                    transform: `translate(-50%, -50%) scale(${facesScale})`,
                  }}
                >
                  <img src={headshotUrl(src)} alt="" loading="lazy" decoding="async" style={{ objectPosition: headshotPos(src) }} />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

