import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  COLOR_FILTER_IDS,
  COLOR_FILTERS,
  type ColorFilter,
} from "../../lib/filters";
import { usePrintSettings } from "../../state/PrintSettings";
import styles from "./ColorFilters.module.scss";

const THUMB_PX = 96;

/** Round thumbnail of the photo with one preset applied. */
function FilterThumb({
  bitmap,
  filter,
}: {
  bitmap: ImageBitmap | null;
  filter: ColorFilter;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !bitmap) return;
    const side = Math.min(bitmap.width, bitmap.height); // centre square of the photo
    ctx.filter = COLOR_FILTERS[filter] || "none";
    ctx.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      THUMB_PX,
      THUMB_PX,
    );
  }, [bitmap, filter]);
  return (
    <canvas
      ref={canvas}
      width={THUMB_PX}
      height={THUMB_PX}
      className={styles.thumb}
      style={bitmap ? undefined : { filter: COLOR_FILTERS[filter] }}
    />
  );
}

/** Creative color presets with live thumbnails of the chosen photo. */
export function ColorFilters() {
  const { t } = useTranslation();
  const s = usePrintSettings();
  const bitmap = s.photo?.bitmap ?? null;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <h3>{t("web.print.filters.title")}</h3>
        <span className={styles.live}>{t("web.print.filters.live")}</span>
      </div>
      <div
        className={styles.grid}
        role="radiogroup"
        aria-label={t("web.print.filters.title")}
      >
        {COLOR_FILTER_IDS.map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={s.colorFilter === id}
            className={`${styles.option} ${s.colorFilter === id ? styles.on : ""}`}
            onClick={() => s.setColorFilter(id)}
          >
            <FilterThumb bitmap={bitmap} filter={id} />
            <span>{t(`web.print.filters.${id}`)}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
