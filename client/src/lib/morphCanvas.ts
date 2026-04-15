export type RGB = { r: number; g: number; b: number };

export type MorphPoint = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sr: number;
  sg: number;
  sb: number;
  tr: number;
  tg: number;
  tb: number;
  seed: number;
};

type SampleOptions = {
  maxPoints: number;
  alphaThreshold?: number;
  sampleJitter?: number;
};

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function easeInOutCubic(t: number) {
  t = clamp01(t);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function createOffscreen(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D context unavailable');
  return { canvas: c, ctx };
}

export function sampleImagePoints(
  img: HTMLImageElement,
  {
    maxPoints,
    alphaThreshold = 32,
    sampleJitter = 0.35,
  }: SampleOptions
) {
  // sample at a smaller resolution to control point count
  const targetArea = Math.max(32 * 32, Math.min(256 * 256, Math.floor(maxPoints * 6)));
  const aspect = img.naturalWidth / img.naturalHeight || 1;
  const h = Math.max(64, Math.floor(Math.sqrt(targetArea / aspect)));
  const w = Math.max(64, Math.floor(h * aspect));

  const { ctx } = createOffscreen(w, h);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, w, h).data;
  } catch {
    // Cross-origin image without CORS headers → canvas becomes tainted.
    // Fallback: generate a synthetic point field with a warm palette.
    const pts: Array<{ x: number; y: number; c: RGB }> = [];
    for (let i = 0; i < maxPoints; i++) {
      const t = i / Math.max(1, maxPoints - 1);
      pts.push({
        x: Math.random(),
        y: Math.random(),
        c: {
          r: (50 + 120 * t + Math.random() * 20) | 0,
          g: (40 + 90 * t + Math.random() * 20) | 0,
          b: (35 + 70 * t + Math.random() * 20) | 0,
        },
      });
    }
    return pts;
  }

  const points: Array<{ x: number; y: number; c: RGB }> = [];
  const total = w * h;
  const stride = Math.max(1, Math.floor(total / (maxPoints * 1.25)));

  // deterministic-ish scan with stride; keep only non-transparent pixels
  for (let i = 0; i < total; i += stride) {
    const px = i % w;
    const py = (i / w) | 0;
    const idx = i * 4;
    const a = data[idx + 3];
    if (a < alphaThreshold) continue;
    points.push({
      x: (px + (Math.random() - 0.5) * sampleJitter) / w,
      y: (py + (Math.random() - 0.5) * sampleJitter) / h,
      c: { r: data[idx], g: data[idx + 1], b: data[idx + 2] },
    });
    if (points.length >= maxPoints) break;
  }

  // if the stride sampling under-filled, fall back to random picks
  while (points.length < Math.min(maxPoints, 6000)) {
    const rx = (Math.random() * w) | 0;
    const ry = (Math.random() * h) | 0;
    const idx = (ry * w + rx) * 4;
    const a = data[idx + 3];
    if (a < alphaThreshold) continue;
    points.push({
      x: (rx + (Math.random() - 0.5) * sampleJitter) / w,
      y: (ry + (Math.random() - 0.5) * sampleJitter) / h,
      c: { r: data[idx], g: data[idx + 1], b: data[idx + 2] },
    });
  }

  return points.slice(0, maxPoints);
}

export function sampleCircleImagePoints(
  img: HTMLImageElement,
  {
    maxPoints,
    alphaThreshold = 32,
    sampleJitter = 0.35,
  }: SampleOptions
) {
  const size = Math.max(64, Math.min(220, Math.floor(Math.sqrt(maxPoints) * 9)));
  const { ctx } = createOffscreen(size, size);

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, 0, 0, size, size);
  ctx.restore();

  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, size, size).data;
  } catch {
    // Cross-origin fallback: random points inside the circle, neutral color.
    const pts: Array<{ x: number; y: number; c: RGB }> = [];
    for (let i = 0; i < maxPoints; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.5;
      pts.push({
        x: 0.5 + Math.cos(a) * r,
        y: 0.5 + Math.sin(a) * r,
        c: { r: 240, g: 230, b: 220 },
      });
    }
    return pts;
  }
  const points: Array<{ x: number; y: number; c: RGB }> = [];

  const total = size * size;
  const stride = Math.max(1, Math.floor(total / (maxPoints * 1.25)));

  for (let i = 0; i < total; i += stride) {
    const px = i % size;
    const py = (i / size) | 0;
    const idx = i * 4;
    const a = data[idx + 3];
    if (a < alphaThreshold) continue;
    points.push({
      x: (px + (Math.random() - 0.5) * sampleJitter) / size,
      y: (py + (Math.random() - 0.5) * sampleJitter) / size,
      c: { r: data[idx], g: data[idx + 1], b: data[idx + 2] },
    });
    if (points.length >= maxPoints) break;
  }

  return points.slice(0, maxPoints);
}

export type CollageLayout = Array<{
  cx: number; // 0..1
  cy: number; // 0..1
  r: number;  // 0..1 (relative to min(viewW, viewH))
}>;

export function defaultCollageLayout(count: number): CollageLayout {
  // a “human” loose shape reminiscent of Luffu’s
  const base: CollageLayout = [
    { cx: 0.16, cy: 0.28, r: 0.085 },
    { cx: 0.28, cy: 0.72, r: 0.095 },
    { cx: 0.44, cy: 0.30, r: 0.090 },
    { cx: 0.62, cy: 0.72, r: 0.105 },
    { cx: 0.78, cy: 0.30, r: 0.090 },
    { cx: 0.86, cy: 0.62, r: 0.080 },
    { cx: 0.52, cy: 0.52, r: 0.120 },
    { cx: 0.10, cy: 0.58, r: 0.070 },
    { cx: 0.92, cy: 0.44, r: 0.070 },
    { cx: 0.36, cy: 0.50, r: 0.080 },
    { cx: 0.68, cy: 0.50, r: 0.080 },
    { cx: 0.50, cy: 0.84, r: 0.070 },
  ];
  return base.slice(0, Math.max(1, Math.min(count, base.length)));
}

export function buildMorphPoints(params: {
  heroPoints: Array<{ x: number; y: number; c: RGB }>;
  headshotPointsByFace: Array<Array<{ x: number; y: number; c: RGB }>>;
  layout: CollageLayout;
  seed?: number;
}) {
  const seed = params.seed ?? 12345;
  const rng = mulberry32(seed);

  // Flatten headshot points into the target space using layout.
  const targetPool: Array<{ x: number; y: number; c: RGB }> = [];
  const faces = Math.min(params.headshotPointsByFace.length, params.layout.length);
  for (let i = 0; i < faces; i++) {
    const facePts = params.headshotPointsByFace[i];
    const { cx, cy, r } = params.layout[i];
    for (const p of facePts) {
      targetPool.push({
        x: cx + (p.x - 0.5) * (r * 2),
        y: cy + (p.y - 0.5) * (r * 2),
        c: p.c,
      });
    }
  }

  // If target pool is small, duplicate it to cover hero points.
  if (targetPool.length === 0) {
    throw new Error('No target points generated');
  }

  const heroPts = params.heroPoints;
  const morphPoints: MorphPoint[] = new Array(heroPts.length);

  for (let i = 0; i < heroPts.length; i++) {
    const s = heroPts[i];
    const t = targetPool[(i * 13 + Math.floor(rng() * 997)) % targetPool.length];
    morphPoints[i] = {
      sx: s.x,
      sy: s.y,
      tx: t.x,
      ty: t.y,
      sr: s.c.r,
      sg: s.c.g,
      sb: s.c.b,
      tr: t.c.r,
      tg: t.c.g,
      tb: t.c.b,
      seed: rng(),
    };
  }

  return morphPoints;
}

export function drawMorphFrame(params: {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  points: MorphPoint[];
  progress: number; // 0..1
  pointSize?: number;
  background?: { r: number; g: number; b: number; a: number };
}) {
  const {
    ctx,
    width,
    height,
    points,
    pointSize = 1.65,
    background = { r: 10, g: 10, b: 10, a: 0.0 },
  } = params;

  const p = clamp01(params.progress);
  const eased = easeInOutCubic(p);

  if (background.a > 0) {
    ctx.fillStyle = `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a})`;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.clearRect(0, 0, width, height);
  }

  // crisp on hi-dpi: caller should size canvas by DPR; here we draw in device pixels.
  ctx.globalCompositeOperation = 'source-over';

  // small “arrival” bloom at end
  const finalBoost = Math.max(0, (p - 0.8) / 0.2);
  const alphaBase = 0.85 + 0.15 * finalBoost;

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    const localDelay = pt.seed * 0.35; // 0..0.35
    const localT = clamp01((eased - localDelay) / (1 - localDelay));
    const t = easeInOutCubic(localT);

    const x = (pt.sx + (pt.tx - pt.sx) * t) * width;
    const y = (pt.sy + (pt.ty - pt.sy) * t) * height;

    const r = (pt.sr + (pt.tr - pt.sr) * t) | 0;
    const g = (pt.sg + (pt.tg - pt.sg) * t) | 0;
    const b = (pt.sb + (pt.tb - pt.sb) * t) | 0;

    const a = alphaBase * (0.15 + 0.85 * t);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;

    // slightly larger toward the end for “headshot cohesion”
    const s = pointSize * (0.8 + 0.35 * t);
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
}

