import { useTranslation } from "react-i18next";
import { usePrintSettings } from "../../state/PrintSettings";
import { Checkbox } from "../atoms/Checkbox";
import { Icon } from "../atoms/Icon";
import { AdjustmentSliders } from "./AdjustmentSliders";
import { DateStampOptions } from "./DateStampOptions";
import styles from "./LabAdjustments.module.scss";

/** "Lab adjustments" accordion (mobile): brightness, contrast, saturation and the date stamp. */
export function LabAdjustments() {
  const { t } = useTranslation();
  const s = usePrintSettings();

  return (
    <details className={styles.panel} open>
      <summary className={styles.summary}>
        <span className={styles.title}>
          <Icon name="tune" className={styles.accent} />
          <h3>{t("print.lab.title")}</h3>
        </span>
        <span className={styles.summaryEnd}>
          <button
            type="button"
            className={styles.zero}
            onClick={(e) => {
              e.preventDefault(); // do not toggle the accordion
              s.resetAdjustments();
            }}
          >
            {t("print.lab.zero")}
          </button>
          <Icon name="expand_more" className={styles.chevron} />
        </span>
      </summary>

      <div className={styles.body}>
        <AdjustmentSliders />
        <div className={styles.stamp}>
          <div className={styles.stampHead}>
            <Checkbox checked={s.stampEnabled} onChange={s.setStampEnabled}>
              <b>{t("print.stamp.toggle")}</b>
            </Checkbox>
            <Icon
              name="history_toggle_off"
              size={18}
              className={styles.accent}
            />
          </div>
          <DateStampOptions />
        </div>
      </div>
    </details>
  );
}
