import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagePreview } from "../../hooks/usePagePreview";
import { ZOOM } from "../../lib/filters";
import { PAGE } from "../../lib/printers";
import { usePrintSettings } from "../../state/PrintSettings";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";
import { Segmented } from "../atoms/Segmented";
import { Slider } from "../atoms/Slider";
import { PhotoFileInput } from "../molecules/PhotoFileInput";
import styles from "./PhotoStage.module.scss";

/** Desktop editor stage: toolbar, the sheet on its mat, and zoom / photo controls. */
export function PhotoStage() {
  const { t } = useTranslation();
  const s = usePrintSettings();
  const host = usePagePreview();
  const fileInput = useRef<HTMLInputElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState(false);

  const openPicker = () => fileInput.current?.click();
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void sheet.current?.requestFullscreen();
  };

  return (
    <section className={styles.stage}>
      <div className={styles.toolbar}>
        <div className={styles.group}>
          <Segmented
            label={t("print.fit")}
            value={s.fit}
            onChange={s.setFit}
            options={[
              {
                value: "fill",
                label: (
                  <>
                    <Icon name="crop_free" size={16} />
                    {t("print.fill")}
                  </>
                ),
              },
              {
                value: "fit",
                label: (
                  <>
                    <Icon name="aspect_ratio" size={16} />
                    {t("print.fit")}
                  </>
                ),
              },
            ]}
          />
          <IconButton
            icon="rotate_90_degrees_cw"
            label={t("print.rotate")}
            disabled={!s.photo}
            onClick={s.rotate}
          />
        </div>
        <div className={styles.group}>
          <Checkbox checked={s.autoRotate} onChange={s.setAutoRotate}>
            {t("print.autoRotate")}
          </Checkbox>
          <Button
            variant="text"
            small
            icon="restart_alt"
            disabled={!s.photo}
            onClick={s.resetEdits}
          >
            {t("print.reset")}
          </Button>
        </div>
      </div>

      <div className={styles.mat}>
        <div
          ref={sheet}
          className={styles.sheet}
          style={{ aspectRatio: `${PAGE.mmWidth} / ${PAGE.mmHeight}` }}
        >
          <div ref={host} className={styles.canvasHost} />
          {grid && <div className={styles.grid} aria-hidden="true" />}
          {!s.photo && (
            <div className={styles.empty}>
              <Button
                variant="primary"
                icon="add_photo_alternate"
                onClick={openPicker}
              >
                {t("print.choosePhoto")}
              </Button>
            </div>
          )}
        </div>
        <div className={styles.floating}>
          <IconButton
            floating
            icon="fullscreen"
            label={t("web.print.fullscreen")}
            disabled={!s.photo}
            onClick={toggleFullscreen}
          />
          <IconButton
            floating
            icon={grid ? "grid_off" : "grid_on"}
            label={t("web.print.grid")}
            aria-pressed={grid}
            onClick={() => setGrid(!grid)}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.group}>
          <Button
            variant="tonal"
            icon="add_photo_alternate"
            onClick={openPicker}
          >
            {s.photo ? t("print.changePhoto") : t("print.choosePhoto")}
          </Button>
          <span className={styles.divider} />
          <span className={styles.zoom}>
            <Icon name="zoom_out" size={18} />
            <span className={styles.zoomSlider}>
              <Slider
                value={s.zoom}
                min={ZOOM.min}
                max={ZOOM.max}
                step={ZOOM.step}
                label={t("web.print.zoom")}
                onChange={s.setZoom}
              />
            </span>
            <Icon name="zoom_in" size={18} />
            <b className="tabular">{Math.round(s.zoom * 100)}%</b>
          </span>
        </div>
        <div className={styles.specs}>
          <span className={styles.dot} />
          <span>{t("web.print.size")}</span>
          <span className={styles.sep}>·</span>
          <span>
            {PAGE.width} × {PAGE.height} px
          </span>
          <span className={styles.sep}>·</span>
          <b>300 DPI</b>
          <span className={styles.pill}>{t("web.print.technology")}</span>
        </div>
      </div>
      <PhotoFileInput
        ref={fileInput}
        onFile={(file) => void s.choosePhoto(file)}
      />
    </section>
  );
}
