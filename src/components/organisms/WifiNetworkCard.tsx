import { useTranslation } from "react-i18next";
import { useWifiScan } from "../../hooks/usePrinterActions";
import { MANUAL_SSID, useWifiJoinForm } from "../../hooks/useWifiJoinForm";
import { errorText } from "../../i18n/messages";
import { useBluetooth } from "../../state/Bluetooth";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { Checkbox } from "../atoms/Checkbox";
import { Icon } from "../atoms/Icon";
import { Select } from "../atoms/Select";
import { TextField } from "../atoms/TextField";
import { Callout } from "../molecules/Callout";
import { SectionHeader } from "../molecules/SectionHeader";
import styles from "./WifiNetworkCard.module.scss";

/** The printer's Wi-Fi network, and changing it over Bluetooth. */
export function WifiNetworkCard() {
  const { t } = useTranslation();
  const bt = useBluetooth();
  const scan = useWifiScan();
  const form = useWifiJoinForm();
  const onNetwork = bt.wifi?.mode === "STA" && bt.wifi.ssid;

  return (
    <Card>
      <SectionHeader
        icon="wifi"
        tone="success"
        title={t("connection.wifi.title")}
        subtitle={t("connection.wifi.subtitle")}
        aside={
          onNetwork && <Icon name="verified" className={styles.verified} />
        }
      />

      {onNetwork ? (
        <div className={styles.network}>
          <div>
            <small>{t("connection.wifi.localNetwork")}</small>
            <strong>{bt.wifi!.ssid}</strong>
          </div>
          {bt.wifi!.ip && (
            <div className={styles.ip}>
              <span>{t("connection.wifi.assignedIp")}</span>
              <code>{bt.wifi!.ip}</code>
            </div>
          )}
        </div>
      ) : (
        <p className={styles.unknown}>{t("connection.wifi.unknown")}</p>
      )}

      <details className={styles.details}>
        <summary className={styles.summary}>
          <Icon name="tune" />
          <span className={styles.summaryText}>
            {t("connection.wifi.change")}
          </span>
          <Icon name="expand_more" className={styles.chevron} />
        </summary>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            form.join();
          }}
        >
          {!bt.ble && (
            <Callout tone="warning">{t("connection.wifi.needBle")}</Callout>
          )}

          <label className={styles.label} htmlFor="wifi-ssid">
            {t("connection.wifi.select")}
          </label>
          <div className={styles.row}>
            <Select
              id="wifi-ssid"
              value={form.ssid}
              onChange={(e) => form.setSsid(e.target.value)}
              className={styles.grow}
            >
              <option value="" disabled>
                {scan.data
                  ? t("connection.wifi.select")
                  : t("connection.wifi.scanHint")}
              </option>
              {scan.data?.map((n) => (
                <option key={n.ssid} value={n.ssid} disabled={!n.band24}>
                  {n.ssid} · {n.signal}%
                  {n.band24 ? "" : ` (${t("connection.wifi.not24")})`}
                </option>
              ))}
              <option value={MANUAL_SSID}>{t("connection.wifi.manual")}</option>
            </Select>
            <Button
              icon="wifi_find"
              iconSpin={scan.isFetching}
              disabled={scan.isFetching}
              onClick={() => void scan.refetch()}
            >
              {scan.isFetching
                ? t("connection.wifi.scanning")
                : t("connection.wifi.scan")}
            </Button>
          </div>
          {scan.isError && (
            <Callout tone="error">{errorText(t, scan.error)}</Callout>
          )}

          {form.manual && (
            <TextField
              value={form.manualSsid}
              onChange={(e) => form.setManualSsid(e.target.value)}
              placeholder={t("connection.wifi.manualPlaceholder")}
              aria-label={t("connection.wifi.manualPlaceholder")}
            />
          )}

          <label className={styles.label} htmlFor="wifi-password">
            {t("connection.wifi.password")}
          </label>
          <TextField
            id="wifi-password"
            type={form.showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => form.setPassword(e.target.value)}
            placeholder={t("connection.wifi.passwordPlaceholder")}
            autoComplete="off"
            disabled={!form.secured}
            trailing={
              <button
                type="button"
                className={styles.eye}
                aria-label={t("connection.wifi.showPassword")}
                aria-pressed={form.showPassword}
                onClick={form.toggleShowPassword}
              >
                <Icon
                  name={form.showPassword ? "visibility_off" : "visibility"}
                  size={18}
                />
              </button>
            }
          />
          <Checkbox checked={form.secured} onChange={form.setSecured}>
            {t("connection.wifi.wpa")}
          </Checkbox>
          <Callout tone="warning" icon="warning">
            {t("connection.wifi.only24")}
          </Callout>

          <Button
            type="submit"
            variant="primary"
            icon={form.joining ? "sync" : "wifi_add"}
            iconSpin={form.joining}
            block
            disabled={!form.canJoin}
          >
            {form.joining
              ? t("connection.wifi.joining")
              : t("connection.wifi.join")}
          </Button>
        </form>
      </details>
    </Card>
  );
}
