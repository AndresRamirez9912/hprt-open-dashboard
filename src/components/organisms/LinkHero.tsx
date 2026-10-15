import { useTranslation } from "react-i18next";
import { usePrinter } from "../../hooks/useBridge";
import { useRefreshState } from "../../hooks/usePrinterActions";
import { useBluetooth } from "../../state/Bluetooth";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import styles from "./LinkHero.module.scss";

/** Desktop connectivity header: which links are up, Wi-Fi latency and "Re-sync". */
export function LinkHero() {
  const { t } = useTranslation();
  const printer = usePrinter();
  const bt = useBluetooth();
  const refreshState = useRefreshState();
  const dual = Boolean(printer && bt.ble);
  const busy = bt.busy !== null;

  const resync = () => {
    void refreshState();
    if (bt.ble) void bt.refresh();
  };

  return (
    <section className={styles.hero}>
      <span className={styles.glow} aria-hidden="true" />
      <span className={`${styles.icon} ${printer ? "" : styles.off}`}>
        <Icon
          name={dual ? "hub" : printer ? "sensors" : "sensors_off"}
          size={30}
        />
      </span>
      <div className={styles.text}>
        <div className={styles.titleRow}>
          <h1>
            {dual
              ? t("web.connection.dual")
              : printer
                ? t("connection.active")
                : t("connection.inactive")}
          </h1>
          {printer && !printer.reconnecting && (
            <Badge tone="success" dot>
              {t("web.connection.synced")}
            </Badge>
          )}
        </div>
        <p>
          {printer
            ? t("web.connection.dualHint")
            : t("connection.inactiveHint")}
        </p>
      </div>
      <div className={styles.side}>
        <dl className={styles.stats}>
          <div>
            <dt>{t("web.connection.wifiLatency")}</dt>
            <dd>
              <span className={`${styles.dot} ${printer ? styles.on : ""}`} />
              {printer?.link?.rttAvgMs != null
                ? `${printer.link.rttAvgMs} ms`
                : "–"}
            </dd>
          </div>
          <div>
            <dt>{t("web.connection.bleState")}</dt>
            <dd>
              <span className={`${styles.dot} ${bt.ble ? styles.on : ""}`} />
              {bt.ble
                ? t("web.connection.blePaired")
                : t("web.connection.bleNone")}
            </dd>
          </div>
        </dl>
        <Button
          variant="primary"
          icon="sync"
          iconSpin={busy}
          disabled={busy}
          onClick={resync}
        >
          {t("web.connection.resync")}
        </Button>
      </div>
    </section>
  );
}
