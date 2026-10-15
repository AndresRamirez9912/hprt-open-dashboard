import { useTranslation } from "react-i18next";
import { hrefFor } from "../../app/router";
import { DeviceStatusCard } from "../../components/organisms/DeviceStatusCard";
import { LinkQualityCard } from "../../components/organisms/LinkQualityCard";
import { MaintenanceCard } from "../../components/organisms/MaintenanceCard";
import { PrinterQuickBar } from "../../components/organisms/PrinterQuickBar";
import { ShortcutRow } from "../../components/molecules/ShortcutRow";
import { usePrinter } from "../../hooks/useBridge";
import { useLogEntries } from "../../hooks/useLogEntries";
import styles from "./Page.module.scss";

/** Printer status: identity, battery, link quality and maintenance. */
export function StatusPage() {
  const { t } = useTranslation();
  const printer = usePrinter();
  const logCount = useLogEntries().length;

  return (
    <div className={styles.page}>
      {printer ? (
        <>
          <DeviceStatusCard printer={printer} />
          <LinkQualityCard printer={printer} />
          <MaintenanceCard printer={printer} />
        </>
      ) : (
        <PrinterQuickBar />
      )}
      <ShortcutRow
        href={hrefFor("logs")}
        icon="description"
        label={t("status.logsActive")}
        value={<code>{t("status.events", { count: logCount })}</code>}
      />
    </div>
  );
}
