// Draws the page preview (exactly what will print) into a host element.
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { renderPage } from "../lib/image";
import { pageOptions } from "../state/pageOptions";
import { usePrintSettings } from "../state/PrintSettings";

/** Preview scale: 616 x 893 px, sharp enough for the on-screen sheet. */
const PREVIEW_SCALE = 0.5;

/** Returns the ref of the element that holds the preview canvas. */
export function usePagePreview() {
  const { i18n } = useTranslation();
  const settings = usePrintSettings();
  const host = useRef<HTMLDivElement>(null);

  // Redraw whenever an option that changes the page changes (serialized to compare by value).
  const optionsKey = JSON.stringify(pageOptions(settings, i18n.language));
  useEffect(() => {
    if (!host.current) return;
    host.current.replaceChildren();
    if (settings.photo)
      host.current.appendChild(
        renderPage(
          settings.photo.bitmap,
          JSON.parse(optionsKey),
          PREVIEW_SCALE,
        ),
      );
  }, [settings.photo, optionsKey]);

  return host;
}
