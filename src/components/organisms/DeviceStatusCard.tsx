import { useTranslation } from "react-i18next";
import type { BridgeState } from "../../api/types";
import { useRefreshState } from "../../hooks/usePrinterActions";
import { printerErrorText, stageText } from "../../i18n/messages";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Icon } from "../atoms/Icon";
import { ProgressBar } from "../atoms/ProgressBar";
import { StatusDot } from "../atoms/StatusDot";
import { Callout } from "../molecules/Callout";
import { InfoRow } from "../molecules/InfoRow";
import { StatTile } from "../molecules/StatTile";
import styles from "./DeviceStatusCard.module.scss";

/** Identity, battery, details and errors of the connected printer. */
export function DeviceStatusCard({ printer }: { printer: BridgeState }) {
  const { t } = useTranslation();
  const refresh = useRefreshState();
  const status = printer.status;
  const stage = status?.stageCode ?? 0;
  const errors = status?.errors ?? [];
  const healthy = !printer.reconnecting && errors.length === 0;

  return (
    <Card glow>
      <div className={styles.top}>
        <span className={styles.icon}>
          <Icon name="print" size={28} />
          <span className={styles.dot}>
            <StatusDot tone={healthy ? "success" : "warning"} />
          </span>
        </span>
        <div className={styles.identity}>
          <h2 className={styles.name}>{printer.info?.name ?? printer.ip}</h2>
          <p className={`${styles.stage} ${healthy ? "" : styles.warn}`}>
            {printer.reconnecting
              ? t("header.reconnecting")
              : stage === 0
                ? `${stageText(t, 0)} · ${t("status.ready")}`
                : stageText(t, stage)}
          </p>
        </div>
        <Button small icon="sync" onClick={() => refresh()}>
          {t("status.sync")}
        </Button>
      </div>

      {errors.map((e) => (
        <Callout key={e.code} tone="error" icon="error">
          {printerErrorText(t, e.code, e.label)}
        </Callout>
      ))}

      {status && (
        <StatTile
          label={t("status.battery")}
          value={`${status.battery}%`}
          tone={status.battery > 20 ? "success" : "warning"}
          aside={
            <Icon
              name={status.battery > 20 ? "battery_full" : "battery_alert"}
              size={20}
            />
          }
        >
          <ProgressBar
            value={status.battery}
            tone={status.battery > 20 ? "success" : "warning"}
            label={t("status.battery")}
          />
        </StatTile>
      )}

      <Card variant="soft">
        {printer.ip && (
          <InfoRow
            icon="router"
            label={t("status.ip")}
            value={printer.ip}
            mono
          />
        )}
        {printer.info?.sn && (
          <InfoRow
            icon="fingerprint"
            label={t("status.serial")}
            value={printer.info.sn}
            mono
          />
        )}
        {(status?.firmware || printer.info?.firmware) && (
          <InfoRow
            icon="memory"
            label={t("status.firmware")}
            value={`v${status?.firmware || printer.info?.firmware}`}
            mono
          />
        )}
        {status && (
          <InfoRow
            icon="counter_3"
            label={t("status.counter")}
            value={t("status.counterValue", { count: status.printCounter })}
          />
        )}
      </Card>
    </Card>
  );
}
