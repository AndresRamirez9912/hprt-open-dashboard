import { useTranslation } from "react-i18next";
import type { BridgeState } from "../../api/types";
import { useRefreshState } from "../../hooks/usePrinterActions";
import { printerErrorText, stageText } from "../../i18n/messages";
import { modelFromName } from "../../lib/printers";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { StatusDot } from "../atoms/StatusDot";
import { Callout } from "../molecules/Callout";
import styles from "./StatusHero.module.scss";

/** Desktop status header: identity, stage, key facts and "Sync". */
export function StatusHero({ printer }: { printer: BridgeState }) {
  const { t } = useTranslation();
  const refresh = useRefreshState();
  const status = printer.status;
  const stage = status?.stageCode ?? 0;
  const errors = status?.errors ?? [];
  const healthy = !printer.reconnecting && errors.length === 0;
  const firmware = status?.firmware || printer.info?.firmware;

  const facts = [
    { label: t("web.status.ip"), value: printer.ip, mono: true },
    { label: t("web.status.serial"), value: printer.info?.sn, mono: true },
    {
      label: t("web.status.firmware"),
      value: firmware && `v${firmware}`,
      mono: true,
    },
    {
      label: t("web.status.counter"),
      value:
        status && t("web.status.counterValue", { count: status.printCounter }),
      accent: true,
    },
  ].filter((f) => f.value);

  return (
    <section className={styles.hero}>
      <span className={styles.glow} aria-hidden="true" />
      <div className={styles.identity}>
        <span className={styles.icon}>
          <Icon name="print" size={32} />
          <span className={styles.dot}>
            <StatusDot tone={healthy ? "success" : "warning"} />
          </span>
        </span>
        <div className={styles.text}>
          <h1>
            {printer.info?.name
              ? modelFromName(printer.info.name).label
              : printer.ip}
          </h1>
          <Badge tone={healthy ? "success" : "warning"} dot>
            {printer.reconnecting
              ? t("header.reconnecting")
              : stage === 0
                ? `${stageText(t, 0)} · ${t("status.ready")}`
                : stageText(t, stage)}
          </Badge>
          <p>{t("web.status.description")}</p>
        </div>
      </div>

      <div className={styles.side}>
        <dl className={styles.facts}>
          {facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd
                className={f.mono ? styles.mono : f.accent ? styles.accent : ""}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
        <Button variant="primary" icon="sync" onClick={() => void refresh()}>
          {t("status.sync")}
        </Button>
      </div>

      {errors.length > 0 && (
        <div className={styles.errors}>
          {errors.map((e) => (
            <Callout key={e.code} tone="error" icon="error">
              {printerErrorText(t, e.code, e.label)}
            </Callout>
          ))}
        </div>
      )}
    </section>
  );
}
