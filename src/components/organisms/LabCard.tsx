import { useTranslation } from "react-i18next";
import { usePrintSettings } from "../../state/PrintSettings";
import { Icon } from "../atoms/Icon";
import { AdjustmentSliders } from "./AdjustmentSliders";
import styles from "./WebCard.module.scss";

/** Desktop "Lab adjustments" card. */
export function LabCard() {
  const { t } = useTranslation();
  const s = usePrintSettings();
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <h3>
          <Icon name="tune" className={styles.accent} />
          {t("web.print.lab")}
        </h3>
        <button
          type="button"
          className={styles.link}
          onClick={s.resetAdjustments}
        >
          {t("web.print.resetLab")}
        </button>
      </div>
      <AdjustmentSliders />
    </section>
  );
}
