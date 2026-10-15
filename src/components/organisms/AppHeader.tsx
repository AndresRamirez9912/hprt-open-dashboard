import { useTranslation } from "react-i18next";
import type { Route } from "../../app/router";
import { usePrinter } from "../../hooks/useBridge";
import { modelFromName } from "../../lib/printers";
import { StatusDot } from "../atoms/StatusDot";
import styles from "./AppHeader.module.scss";

/** Top bar: brand, connected model, page subtitle and connection pill. */
export function AppHeader({ route }: { route: Route }) {
  const { t } = useTranslation();
  const printer = usePrinter();
  const battery = printer?.status?.battery;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.titleRow}>
          <span className={styles.name}>{t("app.brand")}</span>
          {printer && (
            <span className={styles.model}>
              {modelFromName(printer.info?.name).id}
            </span>
          )}
        </div>
        <span className={styles.subtitle}>{t(`header.${route}`)}</span>
      </div>
      {printer ? (
        <span
          className={`${styles.pill} ${printer.reconnecting ? styles.warn : ""}`}
        >
          <StatusDot tone={printer.reconnecting ? "warning" : "success"} />
          {printer.reconnecting
            ? t("header.reconnecting")
            : battery != null
              ? t("header.connected", { battery })
              : t("header.connectedNoBattery")}
        </span>
      ) : (
        <span className={`${styles.pill} ${styles.off}`}>
          {t("header.disconnected")}
        </span>
      )}
    </header>
  );
}
