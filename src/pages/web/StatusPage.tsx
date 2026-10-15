import { LinkQualityPanel } from "../../components/organisms/LinkQualityPanel";
import { MaintenancePanel } from "../../components/organisms/MaintenancePanel";
import { StatusHero } from "../../components/organisms/StatusHero";
import { StatusTiles } from "../../components/organisms/StatusTiles";
import { ConnectPrinterCard } from "../../components/organisms/ConnectPrinterCard";
import { usePrinter } from "../../hooks/useBridge";
import styles from "./StatusPage.module.scss";

/** Web printer status: identity, metrics, link quality and maintenance. */
export function StatusPage() {
  const printer = usePrinter();

  if (!printer) {
    return (
      <div className={styles.empty}>
        <ConnectPrinterCard />
      </div>
    );
  }

  return (
    <>
      <StatusHero printer={printer} />
      <StatusTiles printer={printer} />
      <div className={styles.columns}>
        <LinkQualityPanel printer={printer} />
        <MaintenancePanel printer={printer} />
      </div>
    </>
  );
}
