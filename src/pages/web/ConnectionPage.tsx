import { ArchitectureCard } from "../../components/organisms/ArchitectureCard";
import { BluetoothCard } from "../../components/organisms/BluetoothCard";
import { ConnectPrinterCard } from "../../components/organisms/ConnectPrinterCard";
import { EventsRow } from "../../components/organisms/EventsRow";
import { HotspotCard } from "../../components/organisms/HotspotCard";
import { LinkHero } from "../../components/organisms/LinkHero";
import { WifiNetworkPanel } from "../../components/organisms/WifiNetworkPanel";
import styles from "./ConnectionPage.module.scss";

/** Web connectivity: link summary, the three channels, how they fit together and the log. */
export function ConnectionPage() {
  return (
    <>
      <LinkHero />
      <ConnectPrinterCard />
      <div className={styles.columns}>
        <BluetoothCard />
        <WifiNetworkPanel />
        <HotspotCard copyable />
      </div>
      <ArchitectureCard />
      <EventsRow />
    </>
  );
}
