// Editor state: the chosen photo and every option that shapes the print file.
// Plain useState in one provider; components read it with usePrintSettings().
import { createContext, useContext, useState, type ReactNode } from "react";
import { ZOOM, type ColorFilter } from "../lib/filters";
import { readExifDate, type DateFormat } from "../lib/exif";
import {
  loadImage,
  NO_ADJUSTMENTS,
  type Adjustments,
  type FitMode,
  type QuarterTurns,
} from "../lib/image";

export interface Photo {
  bitmap: ImageBitmap;
  name: string;
  /** Capture date from EXIF, or the file date when the photo has none. */
  date: Date;
  dateFromExif: boolean;
}

export type StampColor = "white" | "gold" | "custom";
export const STAMP_COLORS: Record<Exclude<StampColor, "custom">, string> = {
  white: "#ffffff",
  gold: "#ffb95f",
};

/** Transfer quality: JPEG quality and the approximate file size it gives. */
export const QUALITIES = [
  { id: "low", jpeg: 0.8, sizeLabel: "~0.25 MB" },
  { id: "standard", jpeg: 0.92, sizeLabel: "~0.5 MB" },
  { id: "max", jpeg: 1, sizeLabel: "~2 MB" },
] as const;
export type QualityId = (typeof QUALITIES)[number]["id"];

export const MAX_COPIES = 20;

interface PrintSettings {
  photo: Photo | null;
  fit: FitMode;
  autoRotate: boolean;
  turns: QuarterTurns;
  zoom: number;
  colorFilter: ColorFilter;
  adjustments: Adjustments;
  stampEnabled: boolean;
  /** Date typed or picked by the user; null = the photo's own date. */
  stampDate: Date | null;
  stampFormat: DateFormat;
  stampColor: StampColor;
  customColor: string;
  quality: QualityId;
  copies: number;
}

interface PrintSettingsApi extends PrintSettings {
  choosePhoto: (file: File) => Promise<void>;
  setFit: (fit: FitMode) => void;
  setAutoRotate: (on: boolean) => void;
  rotate: () => void;
  setZoom: (zoom: number) => void;
  setColorFilter: (filter: ColorFilter) => void;
  setAdjustment: (key: keyof Adjustments, value: number) => void;
  resetAdjustments: () => void;
  /** "Reset": back to the photo as loaded (no rotation, zoom, filter or adjustments). */
  resetEdits: () => void;
  setStampEnabled: (on: boolean) => void;
  /** null goes back to the photo's own date. */
  setStampDate: (date: Date | null) => void;
  setStampFormat: (format: DateFormat) => void;
  setStampColor: (color: StampColor) => void;
  setCustomColor: (hex: string) => void;
  setQuality: (quality: QualityId) => void;
  setCopies: (copies: number) => void;
}

const Context = createContext<PrintSettingsApi | null>(null);

const INITIAL: PrintSettings = {
  photo: null,
  fit: "fill",
  autoRotate: true,
  turns: 0,
  zoom: 1,
  colorFilter: "original",
  adjustments: NO_ADJUSTMENTS,
  stampEnabled: false,
  stampDate: null,
  stampFormat: "dmy",
  stampColor: "white",
  customColor: "#ffb95f",
  quality: "standard",
  copies: 1,
};

export function PrintSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PrintSettings>(INITIAL);
  const update = (patch: Partial<PrintSettings>) =>
    setSettings((s) => ({ ...s, ...patch }));

  const api: PrintSettingsApi = {
    ...settings,
    choosePhoto: async (file) => {
      const [bitmap, exifDate] = await Promise.all([
        loadImage(file),
        readExifDate(file).catch(() => null),
      ]);
      settings.photo?.bitmap.close();
      update({
        photo: {
          bitmap,
          name: file.name,
          date: exifDate ?? new Date(file.lastModified),
          dateFromExif: !!exifDate,
        },
        turns: 0,
        zoom: 1,
        stampDate: null,
      });
    },
    setFit: (fit) => update({ fit }),
    setAutoRotate: (autoRotate) => update({ autoRotate }),
    rotate: () =>
      setSettings((s) => ({
        ...s,
        turns: ((s.turns + 1) % 4) as QuarterTurns,
      })),
    setZoom: (zoom) =>
      update({ zoom: Math.max(ZOOM.min, Math.min(ZOOM.max, zoom)) }),
    setColorFilter: (colorFilter) => update({ colorFilter }),
    setAdjustment: (key, value) =>
      setSettings((s) => ({
        ...s,
        adjustments: { ...s.adjustments, [key]: value },
      })),
    resetAdjustments: () => update({ adjustments: NO_ADJUSTMENTS }),
    resetEdits: () =>
      update({
        adjustments: NO_ADJUSTMENTS,
        turns: 0,
        zoom: 1,
        colorFilter: "original",
      }),
    setStampEnabled: (stampEnabled) => update({ stampEnabled }),
    setStampDate: (stampDate) => update({ stampDate }),
    setStampFormat: (stampFormat) => update({ stampFormat }),
    setStampColor: (stampColor) => update({ stampColor }),
    setCustomColor: (customColor) =>
      update({ customColor, stampColor: "custom" }),
    setQuality: (quality) => update({ quality }),
    setCopies: (copies) =>
      update({ copies: Math.max(1, Math.min(MAX_COPIES, copies)) }),
  };

  return <Context.Provider value={api}>{children}</Context.Provider>;
}

export function usePrintSettings(): PrintSettingsApi {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error(
      "usePrintSettings must be used inside <PrintSettingsProvider>",
    );
  return ctx;
}
