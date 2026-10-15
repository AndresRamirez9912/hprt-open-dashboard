import { useTranslation } from "react-i18next";
import type { BridgeState } from "../../api/types";
import { ProgressBar } from "../atoms/ProgressBar";
import { MetricTile } from "../molecules/MetricTile";
import styles from "./StatusTiles.module.scss";

/** Desktop metric row: battery and print queue (the only ones the printer reports). */
export function StatusTiles({ printer }: { printer: BridgeState }) {
  const { t } = useTranslation();
  const battery = printer.status?.battery;
  const low = battery != null && battery <= 20;

  return (
    <div className={styles.row}>
      {battery != null && (
        <MetricTile
          label={t("web.status.battery")}
          icon={low ? "battery_alert" : "battery_full"}
          iconTone={low ? "warning" : "success"}
          value={battery}
          unit="%"
          hint={low ? t("web.status.batteryLow") : t("web.status.batteryOk")}
          hintTone={low ? "warning" : "success"}
        >
          <ProgressBar
            value={battery}
            tone={low ? "warning" : "success"}
            label={t("web.status.battery")}
          />
        </MetricTile>
      )}
      <MetricTile
        label={t("web.status.queue")}
        icon="inventory_2"
        iconTone={printer.printing ? "primary" : "plain"}
        value={
          printer.printing
            ? t("web.status.queueBusy")
            : t("web.status.queueEmpty")
        }
        hint={
          printer.printing
            ? t("web.status.queueBusyHint")
            : t("web.status.queueEmptyHint")
        }
      />
    </div>
  );
}
