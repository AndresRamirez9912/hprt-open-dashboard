import { useTranslation } from "react-i18next";
import { usePrintSettings } from "../../state/PrintSettings";
import { Checkbox } from "../atoms/Checkbox";
import { DateStampOptions } from "./DateStampOptions";
import styles from "./WebCard.module.scss";

/** Desktop "Stamp date" card. */
export function DateStampCard() {
  const { t } = useTranslation();
  const s = usePrintSettings();
  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <Checkbox checked={s.stampEnabled} onChange={s.setStampEnabled}>
          <span className={styles.checkTitle}>{t("web.print.stamp")}</span>
        </Checkbox>
        <span className={styles.hint}>{t("web.print.stampCorner")}</span>
      </div>
      <DateStampOptions colorLabel={t("web.print.stampColor")} />
    </section>
  );
}
