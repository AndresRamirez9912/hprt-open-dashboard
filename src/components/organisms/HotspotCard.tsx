import { Trans, useTranslation } from "react-i18next";
import { useConnectThroughHotspot } from "../../hooks/usePrinterActions";
import { errorText } from "../../i18n/messages";
import { AP_PASSWORD } from "../../lib/ble";
import { useBluetooth } from "../../state/Bluetooth";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Callout } from "../molecules/Callout";
import { CopyButton } from "../molecules/CopyButton";
import { SectionHeader } from "../molecules/SectionHeader";
import styles from "./HotspotCard.module.scss";

/** The printer's own access point: enable it over Bluetooth, then connect through it. */
export function HotspotCard({ copyable = false }: { copyable?: boolean }) {
  const { t } = useTranslation();
  const bt = useBluetooth();
  const connect = useConnectThroughHotspot();
  const active = bt.wifi?.mode === "AP";
  const ssid = active ? bt.wifi!.ssid : "";
  const switching = bt.busy === "hotspot";

  return (
    <Card>
      <SectionHeader
        icon="wifi_tethering"
        tone="warning"
        title={t("connection.hotspot.title")}
        subtitle={t("connection.hotspot.subtitle")}
      />
      <p className={styles.story}>
        <Trans i18nKey="connection.hotspot.story" />
      </p>

      <Card variant="soft">
        <div className={styles.apHead}>
          <span>{t("connection.hotspot.own")}</span>
          <Badge tone={active ? "success" : "warning"} dot={active}>
            {active
              ? t("connection.hotspot.active")
              : t("connection.hotspot.activable")}
          </Badge>
        </div>
        <div className={styles.fields}>
          <div className={styles.field}>
            <small>{t("connection.hotspot.ssid")}</small>
            <span className={styles.value}>
              <strong className={ssid ? styles.ssid : styles.muted}>
                {ssid || t("connection.hotspot.ssidUnknown")}
              </strong>
              {copyable && ssid && (
                <CopyButton
                  text={ssid}
                  label={t("web.connection.copy")}
                  copiedLabel={t("web.connection.copied")}
                />
              )}
            </span>
          </div>
          <div className={styles.field}>
            <small>{t("connection.hotspot.password")}</small>
            <span className={styles.value}>
              <strong className="tabular">{AP_PASSWORD}</strong>
              {copyable && (
                <CopyButton
                  text={AP_PASSWORD}
                  label={t("web.connection.copy")}
                  copiedLabel={t("web.connection.copied")}
                />
              )}
            </span>
          </div>
        </div>
      </Card>

      {switching && (
        <Callout icon="sync">{t("connection.hotspot.switching")}</Callout>
      )}
      {!bt.ble && !active && (
        <Callout tone="warning">{t("connection.wifi.needBle")}</Callout>
      )}

      {active ? (
        <>
          <Callout tone="warning" icon="timer">
            {t("connection.hotspot.steps", { ssid })}
          </Callout>
          {connect.isError && (
            <Callout tone="error">{errorText(t, connect.error)}</Callout>
          )}
          <Button
            variant="primary"
            icon={connect.isPending ? "sync" : "link"}
            iconSpin={connect.isPending}
            block
            disabled={connect.isPending}
            onClick={() =>
              connect.mutate({
                hotspotSsid: ssid,
                name: bt.ble?.name,
                sn: bt.serial || undefined,
              })
            }
          >
            {connect.isPending
              ? t("connection.connect.connecting")
              : t("connection.hotspot.connectThrough")}
          </Button>
        </>
      ) : (
        <Button
          variant="surface"
          icon="router"
          block
          disabled={!bt.ble || bt.busy !== null}
          onClick={() => void bt.enableHotspot()}
        >
          {t("connection.hotspot.use")}
        </Button>
      )}
    </Card>
  );
}
