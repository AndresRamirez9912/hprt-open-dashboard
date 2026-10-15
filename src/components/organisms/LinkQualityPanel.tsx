import { useTranslation } from "react-i18next";
import type { BridgeState } from "../../api/types";
import { useLatencyHistory } from "../../hooks/useBridge";
import { useDisconnect, useLinkTest } from "../../hooks/usePrinterActions";
import { LATENCY_HISTORY_SIZE } from "../../hooks/queryKeys";
import { errorText } from "../../i18n/messages";
import { latencyBarPosition, latencyRating } from "../../lib/link";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { Callout } from "../molecules/Callout";
import { LatencyChart } from "../molecules/LatencyChart";
import styles from "./LinkQualityPanel.module.scss";

const RATING_TONE = {
  optimal: "success",
  acceptable: "warning",
  high: "error",
} as const;
const RATING_CLASS = {
  optimal: styles.ok,
  acceptable: styles.warn,
  high: styles.bad,
};

/** Desktop "Wi-Fi link quality": averages, latency scale, history chart and link test. */
export function LinkQualityPanel({ printer }: { printer: BridgeState }) {
  const { t } = useTranslation();
  const history = useLatencyHistory();
  const test = useLinkTest();
  const disconnect = useDisconnect();
  const link = printer.link;
  const avg = link?.rttAvgMs ?? null;
  const rating = latencyRating(avg);
  const ratingText = t(`status.link.${rating}`);
  const report = test.data;

  return (
    <section className={styles.panel}>
      <header className={styles.head}>
        <Icon name="network_check" size={24} className={styles.headIcon} />
        <div>
          <h2>{t("web.status.link")}</h2>
          <p>{t("web.status.linkSubtitle")}</p>
        </div>
      </header>
      {avg != null && (
        <div className={styles.badge}>
          <Badge tone={RATING_TONE[rating]} dot>
            {ratingText}
          </Badge>
        </div>
      )}

      <div className={styles.stats}>
        <div>
          <small>{t("web.status.avg")}</small>
          <b className={`${RATING_CLASS[rating]} tabular`}>
            {avg ?? "–"}
            <i>ms</i>
          </b>
          <span>{t("web.status.avgHint")}</span>
        </div>
        <div>
          <small>{t("web.status.peak")}</small>
          <b className="tabular">
            {link?.rttMaxMs ?? "–"}
            <i>ms</i>
          </b>
          <span>{t("web.status.peakHint")}</span>
        </div>
        <div>
          <small>{t("web.status.loss")}</small>
          <b
            className={`${link && link.lossPct > 0 ? styles.bad : styles.ok} tabular`}
          >
            {link ? link.lossPct.toFixed(1) : "–"}
            <i>%</i>
          </b>
          <span className={link && link.lossPct > 0 ? styles.bad : styles.ok}>
            {link && link.lossPct > 0
              ? t("web.status.lossSome")
              : t("web.status.lossNone")}
          </span>
        </div>
      </div>

      <div className={styles.scale}>
        <div className={styles.scaleHead}>
          <span>{t("web.status.scale")}</span>
          {avg != null && (
            <b className={RATING_CLASS[rating]}>
              {t("web.status.current", { rating: ratingText })}
            </b>
          )}
        </div>
        <div className={styles.bar}>
          {avg != null && (
            <span
              className={styles.marker}
              style={{ left: `${latencyBarPosition(avg)}%` }}
            />
          )}
        </div>
        <div className={styles.legend}>
          <span className={styles.ok}>{t("status.link.legendOptimal")}</span>
          <span className={styles.warn}>
            {t("status.link.legendAcceptable")}
          </span>
          <span className={styles.bad}>{t("status.link.legendCritical")}</span>
        </div>
      </div>

      <div className={styles.history}>
        <div className={styles.scaleHead}>
          <span>
            {t("web.status.history", { count: LATENCY_HISTORY_SIZE })}
          </span>
          <code>{t("web.status.every")}</code>
        </div>
        {history.length ? (
          <LatencyChart
            samples={history}
            slots={LATENCY_HISTORY_SIZE}
            reference={500}
            label={t("web.status.history", { count: LATENCY_HISTORY_SIZE })}
            lostLabel={t("web.status.lostSample")}
          />
        ) : (
          <p className={styles.waiting}>{t("status.link.noSamples")}</p>
        )}
      </div>

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

      <div className={styles.actions}>
        <Button
          icon={test.isPending ? "sync" : "speed"}
          iconSpin={test.isPending}
          disabled={test.isPending}
          onClick={() => test.mutate(printer.ip)}
        >
          {test.isPending ? t("status.link.testing") : t("status.link.test")}
        </Button>
        <Button
          variant="danger"
          icon="link_off"
          disabled={disconnect.isPending}
          onClick={() => disconnect.mutate()}
        >
          {t("status.disconnect")}
        </Button>
      </div>
    </section>
  );
}
