// The exact JPEG for the connected model (rotated when it expects it upside down).
import { useTranslation } from "react-i18next";
import { buildPrintJpeg } from "../lib/image";
import { modelFromName } from "../lib/printers";
import { jpegQuality, pageOptions } from "../state/pageOptions";
import { usePrintSettings } from "../state/PrintSettings";
import { usePrinter } from "./useBridge";

/** Returns a function that builds the print file from the current editor settings. */
export function usePrintFile(): () => Promise<Blob> {
  const { i18n } = useTranslation();
  const settings = usePrintSettings();
  const printer = usePrinter();
  return () =>
    buildPrintJpeg(settings.photo!.bitmap, {
      ...pageOptions(settings, i18n.language),
      printerRotation: modelFromName(printer?.info?.name).rotation,
      quality: jpegQuality(settings),
    });
}
