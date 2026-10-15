// Builds the print image: the photo placed on the 100 x 148 mm sheet, with lab adjustments,
// optional date stamp and the extra rotation some printer models need.
import { COLOR_FILTERS, type ColorFilter } from "./filters";
import { PAGE, PX_PER_MM, SAFE_MARGIN_MM } from "./printers";

export type FitMode = "fill" | "fit";
export type QuarterTurns = 0 | 1 | 2 | 3;

export interface Adjustments {
  /** -50..50, 0 = unchanged */
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface DateStamp {
  text: string;
  /** CSS hex color */
  color: string;
  /** Font size in mm on paper; shrunk if the date does not fit the photo. */
  sizeMm: number;
}

export interface PageOptions {
  fit: FitMode;
  /** Rotate landscape photos 90° so they use the whole portrait sheet. */
  autoRotate: boolean;
  /** Manual rotation chosen by the user, in quarter turns clockwise. */
  turns: QuarterTurns;
  /** Creative preset applied before the adjustments. */
  colorFilter: ColorFilter;
  adjustments: Adjustments;
  /** Extra enlargement around the centre (1 = none); crops the photo. */
  zoom: number;
  stamp: DateStamp | null;
}

export const NO_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
};

export async function loadImage(file: Blob): Promise<ImageBitmap> {
  return createImageBitmap(file, { imageOrientation: "from-image" });
}

/**
 * Draws the photo on a portrait page canvas exactly as it will look on paper.
 * `scale` < 1 renders a lighter version for on-screen previews.
 */
export function renderPage(
  img: ImageBitmap,
  opts: PageOptions,
  scale = 1,
): HTMLCanvasElement {
  const W = Math.round(PAGE.width * scale);
  const H = Math.round(PAGE.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, W, H);

  // Total rotation = manual turns + one more turn if the result is landscape and autoRotate is on.
  let turns = opts.turns as number;
  const landscape =
    turns % 2 === 0 ? img.width > img.height : img.height > img.width;
  if (opts.autoRotate && landscape) turns += 1;
  turns %= 4;
  const sideways = turns % 2 === 1;

  // Size of the photo once rotated onto the page, then scaled to fill or fit it.
  const srcW = sideways ? img.height : img.width;
  const srcH = sideways ? img.width : img.height;
  const k =
    (opts.fit === "fill"
      ? Math.max(W / srcW, H / srcH)
      : Math.min(W / srcW, H / srcH)) * opts.zoom;

  // Draw in the photo's own frame: origin at the page centre, axes turned with the photo.
  const w = img.width * k;
  const h = img.height * k;
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate((turns * Math.PI) / 2);
  ctx.imageSmoothingQuality = "high";
  ctx.filter = cssFilter(opts.colorFilter, opts.adjustments);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.filter = "none";
  if (opts.stamp?.text)
    drawStamp(ctx, opts.stamp, { w, h, W, H, turns, scale });
  ctx.restore();
  return canvas;
}

function cssFilter(preset: ColorFilter, a: Adjustments) {
  return `${COLOR_FILTERS[preset]} brightness(${100 + a.brightness}%) contrast(${100 + a.contrast}%) saturate(${100 + a.saturation}%)`;
}

const STAMP_PADDING_MM = 3;

/**
 * Draws the date in the bottom-right corner of the photo, in the photo's frame, so it reads
 * upright relative to the photo in any orientation. The box is the part of the photo that is
 * inside the printer's safe area (white bands of "Fit" and cut edges excluded).
 */
function drawStamp(
  ctx: CanvasRenderingContext2D,
  stamp: DateStamp,
  g: {
    w: number;
    h: number;
    W: number;
    H: number;
    turns: number;
    scale: number;
  },
) {
  const mm = PX_PER_MM * g.scale;
  const safe = safeAreaInPhotoFrame(g.W, g.H, g.turns, mm);
  const pad = STAMP_PADDING_MM * mm;
  const box = {
    x0: Math.max(safe.x0, -g.w / 2) + pad,
    x1: Math.min(safe.x1, g.w / 2) - pad,
    y0: Math.max(safe.y0, -g.h / 2) + pad,
    y1: Math.min(safe.y1, g.h / 2) - pad,
  };
  const boxW = box.x1 - box.x0;
  const boxH = box.y1 - box.y0;
  if (boxW <= 0 || boxH <= 0) return;

  const family = "'DejaVu Sans Mono', 'Courier New', ui-monospace, monospace";
  let size = stamp.sizeMm * mm;
  ctx.font = `700 ${size}px ${family}`;
  size *= Math.min(
    1,
    (boxW * 0.95) / ctx.measureText(stamp.text).width,
    (boxH * 0.9) / size,
  );
  ctx.font = `700 ${size}px ${family}`;

  ctx.textAlign = "right";
  ctx.textBaseline = "alphabetic";
  const x = box.x1;
  const y = box.y1 - size * 0.08;
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.strokeStyle = outlineFor(stamp.color);
  ctx.strokeText(stamp.text, x, y);
  ctx.fillStyle = stamp.color;
  ctx.fillText(stamp.text, x, y);
}

/**
 * The printer's safe area (page minus SAFE_MARGIN_MM) in the rotated photo frame.
 * canvas.rotate(turns * 90°) maps a photo-frame point to the page as:
 * 0: (x, y)   1: (-y, x)   2: (-x, -y)   3: (y, -x)
 */
function safeAreaInPhotoFrame(W: number, H: number, turns: number, mm: number) {
  const m = SAFE_MARGIN_MM;
  const L = m.left * mm;
  const R = m.right * mm;
  const T = m.top * mm;
  const B = m.bottom * mm;
  switch (turns) {
    case 1:
      return { x0: -H / 2 + T, x1: H / 2 - B, y0: -W / 2 + R, y1: W / 2 - L };
    case 2:
      return { x0: -W / 2 + R, x1: W / 2 - L, y0: -H / 2 + B, y1: H / 2 - T };
    case 3:
      return { x0: -H / 2 + B, x1: H / 2 - T, y0: -W / 2 + L, y1: W / 2 - R };
    default:
      return { x0: -W / 2 + L, x1: W / 2 - R, y0: -H / 2 + T, y1: H / 2 - B };
  }
}

/** Thin edge that contrasts with the text color, so the date reads on any photo. */
function outlineFor(hex: string) {
  const m = hex.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return "rgba(0, 0, 0, 0.45)";
  const n = parseInt(m[1], 16);
  const luminance =
    (0.2126 * ((n >> 16) & 255) +
      0.7152 * ((n >> 8) & 255) +
      0.0722 * (n & 255)) /
    255;
  return luminance > 0.45 ? "rgba(0, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.6)";
}

/**
 * The exact JPEG sent to the printer: the page, plus the rotation the model needs
 * (most CP4x models expect it upside down).
 */
export async function buildPrintJpeg(
  img: ImageBitmap,
  opts: PageOptions & { printerRotation: 0 | 180; quality: number },
): Promise<Blob> {
  const page = renderPage(img, opts);
  let out = page;
  if (opts.printerRotation === 180) {
    out = document.createElement("canvas");
    out.width = page.width;
    out.height = page.height;
    const ctx = out.getContext("2d")!;
    ctx.translate(page.width, page.height);
    ctx.rotate(Math.PI);
    ctx.drawImage(page, 0, 0);
  }
  return new Promise((resolve, reject) =>
    out.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("JPEG encoding failed"))),
      "image/jpeg",
      opts.quality,
    ),
  );
}
