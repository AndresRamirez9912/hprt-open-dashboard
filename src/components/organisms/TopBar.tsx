import { useTranslation } from "react-i18next";
import { usePrinter } from "../../hooks/useBridge";
import { useRefreshState } from "../../hooks/usePrinterActions";
import { useBluetooth } from "../../state/Bluetooth";
import { IconButton } from "../atoms/IconButton";
import { StatusDot } from "../atoms/StatusDot";
import styles from "./TopBar.module.scss";

/** Desktop top bar: the printer and the network it is on, and a refresh button. */
export function TopBar() {
  const { t } = useTranslation();
  const printer = usePrinter();
  const { wifi } = useBluetooth();
  const refresh = useRefreshState();
  // The network name is only known after reading the printer over Bluetooth; the IP otherwise.
  const where = wifi?.ssid && wifi.ip === printer?.ip ? wifi.ssid : printer?.ip;

  return (
    <header className={styles.bar}>
      <span className={styles.chip}>
        {printer ? (
          <StatusDot tone={printer.reconnecting ? "warning" : "success"} />
        ) : (
          <span className={styles.offDot} />
        )}
        {printer
          ? [printer.info?.name, where].filter(Boolean).join(" · ")
          : t("web.offline")}
      </span>
      <IconButton
        icon="refresh"
        label={t("web.refresh")}
        onClick={() => void refresh()}
      />
    </header>
  );
}
