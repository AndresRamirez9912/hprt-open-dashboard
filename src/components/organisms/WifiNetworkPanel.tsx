import { useTranslation } from "react-i18next";
import { useWifiScan } from "../../hooks/usePrinterActions";
import { MANUAL_SSID, useWifiJoinForm } from "../../hooks/useWifiJoinForm";
import { errorText } from "../../i18n/messages";
import { useBluetooth } from "../../state/Bluetooth";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import { Icon } from "../atoms/Icon";
import { TextField } from "../atoms/TextField";
import { Callout } from "../molecules/Callout";
import { SectionHeader } from "../molecules/SectionHeader";
import styles from "./WifiNetworkPanel.module.scss";

/** Desktop "Printing Wi-Fi network": the printer's network and a list to move it to another. */
export function WifiNetworkPanel() {
  const { t } = useTranslation();
  const bt = useBluetooth();
  const scan = useWifiScan();
  const form = useWifiJoinForm();
  const current = bt.wifi?.mode === "STA" && bt.wifi.ssid ? bt.wifi : null;
  const networks = scan.data ?? [];

  return (
    <section className={styles.panel}>
      <SectionHeader
        icon="wifi"
        tone="success"
        title={t("connection.wifi.title")}
        subtitle={t("connection.wifi.subtitle")}
        aside={
          current && (
            <Badge tone="success" dot>
              {t("web.connection.connected")}
            </Badge>
          )
        }
      />

      {current ? (
        <div className={styles.active}>
          <small>{t("web.connection.activeNetwork")}</small>
          <strong>
            {current.ssid}
            {current.security && <Icon name="lock" size={18} />}
          </strong>
          <dl>
            {current.ip && (
              <div>
                <dt>{t("web.connection.ip")}</dt>
                <dd>{current.ip}</dd>
              </div>
            )}
            {current.security && (
              <div>
                <dt>{t("web.connection.security")}</dt>
                <dd>{current.security}</dd>
              </div>
            )}
          </dl>
        </div>
      ) : (
        <p className={styles.muted}>{t("connection.wifi.unknown")}</p>
      )}

      <Callout tone="warning" icon="warning">
        {t("web.connection.only24")}
      </Callout>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          form.join();
        }}
      >
        <div className={styles.formHead}>
          <b>{t("connection.wifi.change")}</b>
          <Button
            variant="text"
            small
            icon="refresh"
            iconSpin={scan.isFetching}
            disabled={scan.isFetching}
            onClick={() => void scan.refetch()}
          >
            {scan.isFetching
              ? t("connection.wifi.scanning")
              : t("connection.wifi.scan")}
          </Button>
        </div>
        {!bt.ble && (
          <Callout tone="warning">{t("connection.wifi.needBle")}</Callout>
        )}
        {scan.isError && (
          <Callout tone="error">{errorText(t, scan.error)}</Callout>
        )}

        <ul
          className={styles.list}
          role="radiogroup"
          aria-label={t("connection.wifi.select")}
        >
          {networks.length === 0 && (
            <li className={styles.muted}>{t("connection.wifi.scanHint")}</li>
          )}
          {networks.map((n) => (
            <li key={n.ssid}>
              <button
                type="button"
                role="radio"
                aria-checked={form.ssid === n.ssid}
                disabled={!n.band24}
                className={`${styles.network} ${form.ssid === n.ssid ? styles.selected : ""}`}
                onClick={() => form.setSsid(n.ssid)}
              >
                <Icon name="wifi" size={18} />
                <span className={styles.name}>{n.ssid}</span>
                {current?.ssid === n.ssid ? (
                  <b className={styles.current}>
                    {t("web.connection.current")}
                  </b>
                ) : (
                  <small>
                    {n.band24 ? `${n.signal}%` : t("connection.wifi.not24")}
                  </small>
                )}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              role="radio"
              aria-checked={form.manual}
              className={`${styles.network} ${form.manual ? styles.selected : ""}`}
              onClick={() => form.setSsid(MANUAL_SSID)}
            >
              <Icon name="edit" size={18} />
              <span className={styles.name}>{t("connection.wifi.manual")}</span>
            </button>
          </li>
        </ul>

        {form.manual && (
          <TextField
            value={form.manualSsid}
            onChange={(e) => form.setManualSsid(e.target.value)}
            placeholder={t("connection.wifi.manualPlaceholder")}
            aria-label={t("connection.wifi.manualPlaceholder")}
          />
        )}
        <TextField
          type={form.showPassword ? "text" : "password"}
          value={form.password}
          onChange={(e) => form.setPassword(e.target.value)}
          placeholder={t("web.connection.networkKey")}
          aria-label={t("connection.wifi.password")}
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
        <Button
          type="submit"
          variant="primary"
          block
          icon={form.joining ? "sync" : undefined}
          iconSpin={form.joining}
          disabled={!form.canJoin}
        >
          {form.joining
            ? t("connection.wifi.joining")
            : t("connection.wifi.join")}
        </Button>
      </form>
    </section>
  );
}
