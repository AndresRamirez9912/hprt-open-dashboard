import { Trans, useTranslation } from "react-i18next";
import { usePrinter } from "../../hooks/useBridge";
import { useConnect } from "../../hooks/usePrinterActions";
import { errorText } from "../../i18n/messages";
import { isBluetoothAvailable } from "../../lib/ble";
import { useBluetooth } from "../../state/Bluetooth";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Callout } from "../molecules/Callout";
import { InfoRow } from "../molecules/InfoRow";
import { SectionHeader } from "../molecules/SectionHeader";
import styles from "./BluetoothCard.module.scss";

/** Pairing over Web Bluetooth: identity of the printer and its Wi-Fi setup. */
export function BluetoothCard() {
  const { t } = useTranslation();
  const bt = useBluetooth();
  const printer = usePrinter();
  const connect = useConnect();

  if (!isBluetoothAvailable()) {
    return (
      <Card>
        <SectionHeader
          icon="bluetooth_disabled"
          tone="plain"
          title={t("connection.ble.title")}
        />
        <Callout tone="warning">{t("connection.ble.unavailable")}</Callout>
      </Card>
    );
  }

  const reading = bt.busy === "pairing" || bt.busy === "reading";
  const printerIp = bt.wifi?.mode === "STA" ? bt.wifi.ip : "";
  const canUse = bt.ble && printerIp && printer?.ip !== printerIp;

  return (
    <Card>
      <SectionHeader
        icon="bluetooth"
        title={t("connection.ble.title")}
        subtitle={
          <span className={bt.ble ? styles.ok : ""}>
            {bt.ble
              ? t("connection.ble.paired")
              : t("connection.ble.notPaired")}
          </span>
        }
        aside={bt.btFirmware && <Badge tone="success">v{bt.btFirmware}</Badge>}
      />
      <Callout>
        <Trans i18nKey="connection.ble.info" />
      </Callout>

      {bt.ble && (
        <div className={styles.rows}>
          <InfoRow label={t("connection.ble.device")} value={bt.ble.name} />
          {bt.serial && (
            <InfoRow
              label={t("connection.ble.serial")}
              value={bt.serial}
              mono
            />
          )}
          {bt.btFirmware && (
            <InfoRow
              label={t("connection.ble.firmware")}
              value={bt.btFirmware}
              mono
            />
          )}
        </div>
      )}

      {reading && (
        <Callout icon="bluetooth_searching">
          {t("connection.ble.reading")}
        </Callout>
      )}
      {bt.error != null && (
        <Callout tone="error">{errorText(t, bt.error)}</Callout>
      )}
      {connect.isError && (
        <Callout tone="error">{errorText(t, connect.error)}</Callout>
      )}

      {canUse && (
        <Button
          variant="primary"
          icon="print"
          block
          disabled={connect.isPending}
          onClick={() =>
            connect.mutate({
              ip: printerIp,
              name: bt.ble?.name,
              sn: bt.serial || undefined,
            })
          }
        >
          {connect.isPending
            ? t("connection.connect.connecting")
            : `${t("connection.ble.usePrinter")} · ${printerIp}`}
        </Button>
      )}

      {bt.ble ? (
        <div className={styles.actions}>
          <Button
            variant="primary"
            icon="sync"
            iconSpin={reading}
            disabled={bt.busy !== null}
            onClick={() => void bt.refresh()}
          >
            {t("connection.ble.reconnect")}
          </Button>
          <Button
            variant="tonal"
            icon="bluetooth_searching"
            disabled={bt.busy !== null}
            onClick={() => void bt.pair()}
          >
            {t("connection.ble.findOther")}
          </Button>
        </div>
      ) : (
        <Button
          variant="primary"
          icon="bluetooth_searching"
          block
          disabled={bt.busy !== null}
          onClick={() => void bt.pair()}
        >
          {t("connection.ble.find")}
        </Button>
      )}
    </Card>
  );
}
