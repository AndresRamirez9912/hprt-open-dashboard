import { useTranslation } from "react-i18next";
import {
  MAX_COPIES,
  QUALITIES,
  usePrintSettings,
  type QualityId,
} from "../../state/PrintSettings";
import { Icon } from "../atoms/Icon";
import { Select } from "../atoms/Select";
import { Stepper } from "../molecules/Stepper";
import styles from "./PrintOptions.module.scss";

interface PrintOptionsProps {
  title?: string;
  copiesHint?: string;
}

/** Transfer quality and number of copies. */
export function PrintOptions({ title, copiesHint }: PrintOptionsProps) {
  const { t } = useTranslation();
  const s = usePrintSettings();
  const quality = QUALITIES.find((q) => q.id === s.quality)!;

  return (
    <section className={styles.card}>
      <div className={styles.title}>
        <Icon name="tune" className={styles.accent} />
        <h3>{title ?? t("print.options.title")}</h3>
      </div>

      <label className={styles.field}>
        <span className={styles.labelRow}>
          <b>{t("print.options.quality")}</b>
          <small>
            {t("print.options.transfer", { size: quality.sizeLabel })}
          </small>
        </span>
        <Select
          value={s.quality}
          onChange={(e) => s.setQuality(e.target.value as QualityId)}
        >
          {QUALITIES.map((q) => (
            <option key={q.id} value={q.id}>
              {t(`print.options.${q.id}`)}
            </option>
          ))}
        </Select>
      </label>

      <div className={styles.copies}>
        <span className={styles.copiesText}>
          <b>{t("print.options.copies")}</b>
          <small>{copiesHint ?? t("print.options.copiesHint")}</small>
        </span>
        <Stepper
          value={s.copies}
          min={1}
          max={MAX_COPIES}
          onChange={s.setCopies}
          lessLabel={t("print.options.less")}
          moreLabel={t("print.options.more")}
        />
      </div>
    </section>
  );
}
