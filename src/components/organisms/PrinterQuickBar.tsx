import { useTranslation } from "react-i18next";
import { hrefFor } from "../../app/router";
import { usePrinter } from "../../hooks/useBridge";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icon";
import styles from "./PrinterQuickBar.module.scss";

/** Compact connected-printer bar at the top of the Print page. */
export function PrinterQuickBar() {
  const { t } = useTranslation();
  const printer = usePrinter();

  if (!printer) {
    return (
      <a
        href={hrefFor("connection")}
        className={`${styles.bar} ${styles.empty}`}
      >
        <span className={styles.icon}>
          <Icon name="print_disabled" size={22} />
        </span>
        <span className={styles.text}>
          <strong>{t("printer.none")}</strong>
          <small>{t("printer.goConnect")}</small>
        </span>
        <Icon name="chevron_right" />
      </a>
    );
  }

  const battery = printer.status?.battery;
  return (
    <div className={styles.bar}>
      <span className={styles.icon}>
        <Icon name="print" size={22} />
      </span>
      <span className={styles.text}>
        <span className={styles.nameRow}>
          <strong>{printer.info?.name ?? printer.ip}</strong>
          {printer.reconnecting ? (
            <Badge tone="warning" dot pulse>
              {t("header.reconnecting")}
            </Badge>
          ) : (
            <Badge tone="success" dot pulse>
              {t("printer.online")}
            </Badge>
          )}
        </span>
        <small>{t("printer.technology")}</small>
      </span>
      {battery != null && (
        <span className={styles.battery}>
          <Icon
            name={battery > 20 ? "battery_full" : "battery_alert"}
            size={16}
          />
          <b className="tabular">{battery}%</b>
        </span>
      )}
    </div>
  );
}
