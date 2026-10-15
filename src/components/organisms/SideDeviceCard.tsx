import { useTranslation } from "react-i18next";
import { hrefFor } from "../../app/router";
import { usePrinter } from "../../hooks/useBridge";
import { Icon } from "../atoms/Icon";
import { ProgressBar } from "../atoms/ProgressBar";
import styles from "./SideDeviceCard.module.scss";

/** Small device summary at the bottom of the desktop side bar. */
export function SideDeviceCard() {
  const { t } = useTranslation();
  const printer = usePrinter();
  const battery = printer?.status?.battery;
  const state = !printer
    ? "disconnected"
    : printer.reconnecting
      ? "reconnecting"
      : "connected";

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>{t("web.device.title")}</span>
        <span className={`${styles.state} ${styles[state]}`}>
          <span className={styles.dot} />
          {t(`web.device.${state}`)}
        </span>
      </div>
      {battery != null && (
        <div className={styles.row}>
          <div className={styles.line}>
            <span>
              <Icon
                name={battery > 20 ? "battery_full" : "battery_alert"}
                size={16}
              />
              {t("web.device.battery")}
            </span>
            <b className="tabular">{battery}%</b>
          </div>
          <ProgressBar
            value={battery}
            tone={battery > 20 ? "success" : "warning"}
            label={t("web.device.battery")}
          />
        </div>
      )}
      {!printer && (
        <a className={styles.link} href={hrefFor("connection")}>
          {t("web.device.connect")}
          <Icon name="arrow_forward" size={16} />
        </a>
      )}
    </section>
  );
}
