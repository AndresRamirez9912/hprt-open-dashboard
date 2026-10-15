// Turns the editor settings into the options of the print image (pure function).
import { formatStampDate } from "../lib/exif";
import type { PageOptions } from "../lib/image";
import {
  QUALITIES,
  STAMP_COLORS,
  type usePrintSettings,
} from "./PrintSettings";

type Settings = ReturnType<typeof usePrintSettings>;

/** Size of the date on paper. */
export const STAMP_SIZE_MM = 5;

export function stampColorHex(s: Settings): string {
  return s.stampColor === "custom" ? s.customColor : STAMP_COLORS[s.stampColor];
}

/** The date printed on the photo: the one the user set, or the photo's own. */
export function stampDate(s: Settings): Date | null {
  return s.stampDate ?? s.photo?.date ?? null;
}

export function stampText(s: Settings, locale: string): string {
  const date = stampDate(s);
  return s.photo && date ? formatStampDate(date, s.stampFormat, locale) : "";
}

export function pageOptions(s: Settings, locale: string): PageOptions {
  return {
    fit: s.fit,
    autoRotate: s.autoRotate,
    turns: s.turns,
    colorFilter: s.colorFilter,
    adjustments: s.adjustments,
    zoom: s.zoom,
    stamp:
      s.stampEnabled && s.photo
        ? {
            text: stampText(s, locale),
            color: stampColorHex(s),
            sizeMm: STAMP_SIZE_MM,
          }
        : null,
  };
}

export function jpegQuality(s: Settings): number {
  return QUALITIES.find((q) => q.id === s.quality)!.jpeg;
}
