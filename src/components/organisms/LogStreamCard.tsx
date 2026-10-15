import { useTranslation } from "react-i18next";
import { useBridgeOnline, usePrinter } from "../../hooks/useBridge";
import type { ClassifiedLog } from "../../lib/logs";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Icon } from "../atoms/Icon";
import styles from "./LogStreamCard.module.scss";

interface LogStreamCardProps {
  entries: ClassifiedLog[];
  paused: boolean;
  onTogglePause: () => void;
  onClear: () => void;
  onDownload: () => void;
}

/** Bridge connection, link figures and the console controls. */
export function LogStreamCard({
  entries,
  paused,
  onTogglePause,
  onClear,
  onDownload,
}: LogStreamCardProps) {
  const { t } = useTranslation();
  const online = useBridgeOnline();
  const printer = usePrinter();
  const link = printer?.link;
  const packets = entries.filter(
    (e) => e.msg.startsWith("cmd rx") || e.msg.startsWith("cmd tx"),
  ).length;

  return (
    <Card>
      <div className={styles.top}>
        <span className={`${styles.icon} ${online ? "" : styles.off}`}>
          <Icon name={online ? "cloud_done" : "cloud_off"} />
        </span>
        <div className={styles.text}>
          <span className={styles.titleRow}>
            <strong>
              {online ? t("logs.bridgeOnline") : t("logs.bridgeOffline")}
            </strong>
            <Badge tone={online ? "success" : "error"}>
              {online ? t("logs.online") : t("logs.offline")}
            </Badge>
          </span>
          <small>
            {printer
              ? [printer.info?.name, printer.ip].filter(Boolean).join(" · ")
              : t("logs.noPrinter")}
          </small>
        </div>
        <Button
          small
          icon={paused ? "play_arrow" : "pause"}
          onClick={onTogglePause}
        >
          {paused ? t("logs.resume") : t("logs.pause")}
        </Button>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <small>{t("logs.latency")}</small>
          <b className={`${styles.warn} tabular`}>
            {link?.rttAvgMs != null ? `${Math.round(link.rttAvgMs)} ms` : "–"}
          </b>
        </div>
        <div className={styles.stat}>
          <small>{t("logs.packets")}</small>
          <b className={`${styles.primary} tabular`}>
            {packets.toLocaleString()}
          </b>
        </div>
        <div className={styles.stat}>
          <small>{t("logs.loss")}</small>
          <b className={`${styles.ok} tabular`}>
            {link ? `${link.lossPct.toFixed(1)} %` : "–"}
          </b>
        </div>
      </div>

      <div className={styles.actions}>
        <Button small icon="delete_sweep" onClick={onClear}>
          {t("logs.clear")}
        </Button>
        <Button
          small
          icon="download"
          disabled={entries.length === 0}
          onClick={onDownload}
        >
          {t("logs.download")}
        </Button>
        <span className={styles.count}>
          {t("logs.count", { count: entries.length })}
        </span>
      </div>
    </Card>
  );
}
