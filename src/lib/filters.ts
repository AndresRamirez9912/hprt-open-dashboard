// Creative color presets ("Color filters" of the desktop editor). They are CSS/canvas filter
// functions, applied before the lab adjustments both in the preview and in the print file.
export const COLOR_FILTERS = {
  original: "",
  vivid: "saturate(150%) contrast(110%)",
  polaroid: "sepia(25%) contrast(105%) brightness(105%)",
  bw: "grayscale(100%)",
  warm: "sepia(40%) hue-rotate(-10deg)",
  cinema: "contrast(125%) saturate(125%)",
} as const;

export type ColorFilter = keyof typeof COLOR_FILTERS;
export const COLOR_FILTER_IDS = Object.keys(COLOR_FILTERS) as ColorFilter[];

/** Photo zoom range (1 = the photo exactly fills or fits the sheet). */
export const ZOOM = { min: 1, max: 1.8, step: 0.05 };
