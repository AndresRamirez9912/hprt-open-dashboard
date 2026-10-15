// HPRT CP4x Wi-Fi printer models. All print a 100 x 148 mm sheet at 300 dpi (11.8 px/mm).
// `rotation` is the extra rotation the printer expects the image to have.
export interface PrinterModel {
  id: string;
  label: string;
  rotation: 0 | 180;
}

export const PAGE = { width: 1232, height: 1786, mmWidth: 100, mmHeight: 148 };

export const PX_PER_MM = 11.8;

/** Edge strips cut off or not printed, in mm (1232 px = 104.4 mm on a 100 mm sheet). */
export const SAFE_MARGIN_MM = { left: 2, top: 0.8, right: 2, bottom: 2.55 };

export const MODELS: PrinterModel[] = [
  { id: "CP4100", label: "HPRT CP4100", rotation: 180 },
  { id: "AMO47", label: "AMO47", rotation: 180 },
  { id: "CP4000L", label: "HPRT CP4000L", rotation: 180 },
  { id: "WPP01", label: "WPP01", rotation: 180 },
  { id: "YP01", label: "YP01", rotation: 180 },
  { id: "CP6000", label: "HPRT CP6000", rotation: 0 },
  { id: "ZEVA_1966", label: "Zeva 1966", rotation: 0 },
];

/** Model from the name the printer announces (e.g. "CP4100-16DD"); CP4100 when unknown. */
export function modelFromName(name?: string | null): PrinterModel {
  const n = (name ?? "").toUpperCase().replace(/[\s_-]/g, "");
  return MODELS.find((m) => n.startsWith(m.id.replace(/_/g, ""))) ?? MODELS[0];
}
