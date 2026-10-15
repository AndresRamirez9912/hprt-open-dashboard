import { useTranslation } from "react-i18next";
import { usePrinter } from "../../hooks/useBridge";
import { useRefreshState } from "../../hooks/usePrinterActions";
import { useBluetooth } from "../../state/Bluetooth";
import { Card } from "../atoms/Card";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";
import { StatusDot } from "../atoms/StatusDot";
import styles from "./ActiveLinkCard.module.scss";

/** Summary at the top of Connection: is there a link, and over which Bluetooth / Wi-Fi. */
export function ActiveLinkCard() {
  const { t } = useTranslation();
  const printer = usePrinter();
  const bt = useBluetooth();
  const refreshState = useRefreshState();
  const busy = bt.busy !== null;

  const refresh = () => {
    void refreshState();
    if (bt.ble) void bt.refresh();
  };

  return (
    <Card>
      <div className={styles.top}>
        <span className={`${styles.icon} ${printer ? "" : styles.off}`}>
          <Icon name={printer ? "sensors" : "sensors_off"} size={26} />
        </span>
        <div className={styles.text}>
          <h2 className={styles.title}>
            {printer && (
              <StatusDot
                tone={printer.reconnecting ? "warning" : "success"}
                ping
              />
            )}
            {printer ? t("connection.active") : t("connection.inactive")}
          </h2>
          <p>
            {printer
              ? t("connection.activeHint")
              : t("connection.inactiveHint")}
          </p>
        </div>
        <IconButton
          icon="sync"
          label={t("connection.refresh")}
          spin={busy}
          disabled={busy}
          onClick={refresh}
        />
      </div>

      {(bt.ble || bt.wifi?.ssid) && (
        <div className={styles.tiles}>
          {bt.ble && (
            <div className={styles.tile}>
              <Icon name="bluetooth" className={styles.blue} />
              <span>
                <small>{t("connection.bluetooth")}</small>
                <strong>{bt.ble.name}</strong>
              </span>
            </div>
          )}
          {bt.wifi?.ssid && (
            <div className={styles.tile}>
              <Icon name="wifi" className={styles.green} />
              <span>
                <small>{t("connection.wifi24")}</small>
                <strong>{bt.wifi.ssid}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
