import { useTranslation } from "react-i18next";
import { useBridgeOnline, usePrinter } from "../../hooks/useBridge";
import type { ClassifiedLog } from "../../lib/logs";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import styles from "./LogsHeader.module.scss";

interface LogsHeaderProps {
  entries: ClassifiedLog[];
  paused: boolean;
  onTogglePause: () => void;
  onClear: () => void;
  onDownload: () => void;
}

/** Desktop logs header: bridge status, link figures and the console actions. */
export function LogsHeader({
  entries,
  paused,
  onTogglePause,
  onClear,
  onDownload,
}: LogsHeaderProps) {
  const { t } = useTranslation();
  const online = useBridgeOnline();
  const printer = usePrinter();
  const link = printer?.link;
  const packets = entries.filter(
    (e) => e.msg.startsWith("cmd rx") || e.msg.startsWith("cmd tx"),
  ).length;

  const stats = [
    {
      label: t("logs.latency"),
      value: link?.rttAvgMs != null ? `${link.rttAvgMs} ms` : "–",
      tone: styles.warn,
    },
    { label: t("web.logs.txrx"), value: packets.toLocaleString(), tone: "" },
    {
      label: t("logs.loss"),
      value: link ? `${link.lossPct.toFixed(1)}%` : "–",
      tone: styles.ok,
    },
    {
      label: t("web.logs.entries"),
      value: entries.length.toLocaleString(),
      tone: styles.primary,
    },
  ];

  return (
    <section className={styles.header}>
      <div className={styles.identity}>
        <span className={styles.icon}>
          <Icon name="terminal" />
        </span>
        <div>
          <div className={styles.titleRow}>
            <h1>{online ? t("logs.bridgeOnline") : t("logs.bridgeOffline")}</h1>
            <Badge tone={online ? "success" : "error"} dot>
              {online ? t("logs.online") : t("logs.offline")}
            </Badge>
          </div>
          <p>
            {printer
              ? t("web.logs.target", {
                  name: [printer.info?.name, printer.ip]
                    .filter(Boolean)
                    .join(" · "),
                })
              : t("logs.noPrinter")}
          </p>
        </div>
      </div>
      <div className={styles.side}>
        <dl className={styles.stats}>
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd className={`${s.tone} tabular`}>{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.actions}>
          <Button
            variant="surface"
            icon={paused ? "play_circle" : "pause_circle"}
            onClick={onTogglePause}
          >
            {paused ? t("web.logs.resume") : t("web.logs.pause")}
          </Button>
          <Button variant="surface" icon="delete_sweep" onClick={onClear}>
            {t("logs.clear")}
          </Button>
          <Button
            variant="primary"
            icon="download"
            disabled={entries.length === 0}
            onClick={onDownload}
          >
            {t("web.logs.export")}
          </Button>
        </div>
      </div>
    </section>
  );
}
