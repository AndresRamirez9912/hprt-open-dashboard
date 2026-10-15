import { useTranslation } from "react-i18next";
import { usePrintSettings } from "../../state/PrintSettings";
import { AdjustmentSlider } from "../molecules/AdjustmentSlider";

/** Brightness, contrast and saturation sliders bound to the editor. */
export function AdjustmentSliders() {
  const { t } = useTranslation();
  const s = usePrintSettings();
  return (
    <>
      <AdjustmentSlider
        icon="light_mode"
        label={t("print.lab.brightness")}
        value={s.adjustments.brightness}
        onChange={(v) => s.setAdjustment("brightness", v)}
      />
      <AdjustmentSlider
        icon="contrast"
        label={t("print.lab.contrast")}
        value={s.adjustments.contrast}
        onChange={(v) => s.setAdjustment("contrast", v)}
      />
      <AdjustmentSlider
        icon="palette"
        label={t("print.lab.saturation")}
        value={s.adjustments.saturation}
        onChange={(v) => s.setAdjustment("saturation", v)}
      />
    </>
  );
}
