import { useTranslation } from "react-i18next";
import { useJobEvent, usePrinter } from "../../hooks/useBridge";
import { useBluetooth } from "../../state/Bluetooth";
import { Icon } from "../atoms/Icon";
import styles from "./ArchitectureCard.module.scss";

/** How the app reaches the printer: Wi-Fi TCP for photos and commands, BLE for setup. */
export function ArchitectureCard() {
  const { t } = useTranslation();
  const printer = usePrinter();
  const job = useJobEvent();
  const bt = useBluetooth();

  return (
    <section className={styles.card}>
      <small className={styles.kicker}>{t("web.connection.flow")}</small>
      <h2>{t("web.connection.architecture")}</h2>
      <div className={styles.flow}>
        <div className={styles.node}>
          <span className={`${styles.nodeIcon} ${styles.primary}`}>
            <Icon name="computer" />
          </span>
          <span>
            <strong>{t("web.connection.client")}</strong>
            <small>{t("web.connection.clientHint")}</small>
          </span>
        </div>

        <div className={styles.links}>
          <div className={styles.link}>
            <span>{t("web.connection.wifiLink")}</span>
            <b className={printer ? styles.on : ""}>
              {job?.rate
                ? t("web.connection.lastRate", { rate: job.rate })
                : printer
                  ? t("web.connection.active")
                  : t("web.connection.inactive")}
            </b>
            <span
              className={`${styles.line} ${printer ? styles.lineOn : ""}`}
            />
          </div>
          <div className={styles.link}>
            <span>{t("web.connection.bleLink")}</span>
            <b className={bt.ble ? styles.on : ""}>
              {bt.ble
                ? t("web.connection.active")
                : t("web.connection.inactive")}
            </b>
            <span className={`${styles.line} ${bt.ble ? styles.lineOn : ""}`} />
          </div>
        </div>

        <div className={styles.node}>
          <span className={`${styles.nodeIcon} ${styles.success}`}>
            <Icon name="print" />
          </span>
          <span>
            <strong>{printer?.info?.name ?? bt.ble?.name ?? "CP4x"}</strong>
            <small className={printer ? styles.on : ""}>
              {!printer
                ? t("web.connection.printerOff")
                : printer.printing
                  ? t("web.connection.printerBusy")
                  : t("web.connection.printerReady")}
            </small>
          </span>
        </div>
      </div>
    </section>
  );
}
