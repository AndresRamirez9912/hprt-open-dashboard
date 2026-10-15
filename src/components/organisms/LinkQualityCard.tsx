import { useTranslation } from "react-i18next";
import type { BridgeState } from "../../api/types";
import { useDisconnect, useLinkTest } from "../../hooks/usePrinterActions";
import { errorText } from "../../i18n/messages";
import { latencyBarPosition, latencyRating } from "../../lib/link";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Callout } from "../molecules/Callout";
import { SectionHeader } from "../molecules/SectionHeader";
import styles from "./LinkQualityCard.module.scss";

const RATING_TONE = {
  optimal: "success",
  acceptable: "warning",
  high: "error",
} as const;

/** Heartbeat latency and loss measured by the bridge, the ping test and "Disconnect". */
export function LinkQualityCard({ printer }: { printer: BridgeState }) {
  const { t } = useTranslation();
  const test = useLinkTest();
  const disconnect = useDisconnect();
  const link = printer.link;
  const avg = link?.rttAvgMs ?? null;
  const rating = latencyRating(avg);
  const report = test.data;

  return (
    <Card>
      <SectionHeader
        icon="network_check"
        tone="warning"
        title={t("status.link.title")}
        subtitle={t("status.link.subtitle")}
        aside={
          avg != null && (
            <Badge tone={RATING_TONE[rating]} dot>
              {t(`status.link.${rating}`)}
            </Badge>
          )
        }
      />

      <Card variant="soft">
        <div className={styles.head}>
          <span>{t("status.link.heartbeat")}</span>
          {link && <b>{t("status.link.lost", { pct: link.lossPct })}</b>}
        </div>
        {avg == null ? (
          <p className={styles.waiting}>{t("status.link.noSamples")}</p>
        ) : (
          <>
            <div className={styles.numbers}>
              <span>
                <b className={`${styles.big} tabular`}>{Math.round(avg)}</b>{" "}
                {t("status.link.avg")}
              </span>
              {link?.rttMaxMs != null && (
                <span className={styles.peak}>
                  <b className="tabular">{Math.round(link.rttMaxMs)} ms</b>
                  <small>{t("status.link.peak")}</small>
                </span>
              )}
            </div>
            <div className={styles.bar}>
              <span
                className={styles.marker}
                style={{ left: `${latencyBarPosition(avg)}%` }}
              />
            </div>
          </>
        )}
        <div className={styles.legend}>
          <span>{t("status.link.legendOptimal")}</span>
          <span>{t("status.link.legendAcceptable")}</span>
          <span className={styles.critical}>
            {t("status.link.legendCritical")}
          </span>
        </div>
      </Card>

      <Callout>{t("status.link.info")}</Callout>

      {report?.ping && (
        <Callout
          tone={report.ping.lossPct > 0 ? "warning" : "success"}
          icon="speed"
        >
          {t("status.link.result", {
            loss: report.ping.lossPct,
            min: report.ping.rttMinMs ?? "–",
            avg: report.ping.rttAvgMs ?? "–",
            max: report.ping.rttMaxMs ?? "–",
          })}
          {report.pcWifi && (
            <>
              <br />
              {t("status.link.host", {
                ssid: report.pcWifi.ssid,
                signal: report.pcWifi.signal,
                freq: report.pcWifi.freq,
              })}
            </>
          )}
        </Callout>
      )}
      {test.isError && (
        <Callout tone="error">{errorText(t, test.error)}</Callout>
      )}

      <Button
        variant="tonal"
        icon={test.isPending ? "sync" : "speed"}
        iconSpin={test.isPending}
        block
        disabled={test.isPending}
        onClick={() => test.mutate(printer.ip)}
      >
        {test.isPending ? t("status.link.testing") : t("status.link.test")}
      </Button>
      <Button
        variant="danger"
        icon="link_off"
        block
        disabled={disconnect.isPending}
        onClick={() => disconnect.mutate()}
      >
        {t("status.disconnect")}
      </Button>
    </Card>
  );
}
