import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePagePreview } from "../../hooks/usePagePreview";
import { PAGE } from "../../lib/printers";
import { usePrintSettings } from "../../state/PrintSettings";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";
import { Segmented } from "../atoms/Segmented";
import { PhotoFileInput } from "../molecules/PhotoFileInput";
import styles from "./PhotoCanvas.module.scss";

/** The photo on its paper sheet, exactly as it will print, with framing and rotation controls. */
export function PhotoCanvas() {
  const { t } = useTranslation();
  const settings = usePrintSettings();
  const host = usePagePreview();
  const fileInput = useRef<HTMLInputElement>(null);

  const openPicker = () => fileInput.current?.click();

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className={styles.paper}>
          <Icon name="aspect_ratio" className={styles.accent} />
          {t("print.paper")}
        </span>
        <span className={styles.px}>
          {PAGE.width} × {PAGE.height} px
        </span>
      </div>

      <div
        className={styles.sheet}
        style={{ aspectRatio: `${PAGE.mmWidth} / ${PAGE.mmHeight}` }}
      >
        <div ref={host} className={styles.canvasHost} />
        {settings.photo ? (
          <>
            <div className={styles.topControls}>
              <Segmented
                floating
                label={t("print.fit")}
                value={settings.fit}
                onChange={settings.setFit}
                options={[
                  { value: "fill", label: t("print.fill") },
                  { value: "fit", label: t("print.fit") },
                ]}
              />
              <IconButton
                floating
                icon="rotate_90_degrees_cw"
                label={t("print.rotate")}
                onClick={settings.rotate}
              />
            </div>
            <button
              type="button"
              className={styles.change}
              onClick={openPicker}
            >
              <Icon
                name="add_photo_alternate"
                size={16}
                className={styles.accent}
              />
              {t("print.changePhoto")}
            </button>
          </>
        ) : (
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
        <PhotoFileInput
          ref={fileInput}
          onFile={(file) => void settings.choosePhoto(file)}
        />
      </div>

      <div className={styles.foot}>
        <Checkbox
          checked={settings.autoRotate}
          onChange={settings.setAutoRotate}
        >
          {t("print.autoRotate")}
        </Checkbox>
        <Button
          variant="text"
          onClick={settings.resetEdits}
          disabled={!settings.photo}
        >
          {t("print.reset")}
        </Button>
      </div>
    </section>
  );
}
