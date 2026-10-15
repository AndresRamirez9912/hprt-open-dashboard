import { useTranslation } from "react-i18next";
import { hrefFor } from "../../app/router";
import { ShortcutRow } from "../../components/molecules/ShortcutRow";
import { ActiveLinkCard } from "../../components/organisms/ActiveLinkCard";
import { BluetoothCard } from "../../components/organisms/BluetoothCard";
import { ConnectPrinterCard } from "../../components/organisms/ConnectPrinterCard";
import { HotspotCard } from "../../components/organisms/HotspotCard";
import { WifiNetworkCard } from "../../components/organisms/WifiNetworkCard";
import { useLogEntries } from "../../hooks/useLogEntries";
import styles from "./Page.module.scss";

/** Connecting to the printer: LAN, Bluetooth, its Wi-Fi network and its hotspot. */
export function ConnectionPage() {
  const { t } = useTranslation();
  const logCount = useLogEntries().length;

  return (
    <div className={styles.page}>
      <ActiveLinkCard />
      <ConnectPrinterCard />
      <BluetoothCard />
      <WifiNetworkCard />
      <HotspotCard />
      <ShortcutRow
        href={hrefFor("logs")}
        icon="terminal"
        label={t("connection.logs", { count: logCount })}
      />
    </div>
  );
}
