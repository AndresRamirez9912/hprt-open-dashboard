import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePrinter } from "../../hooks/useBridge";
import { useConnect, useDiscover } from "../../hooks/usePrinterActions";
import { errorText } from "../../i18n/messages";
import { Button } from "../atoms/Button";
import { Card } from "../atoms/Card";
import { TextField } from "../atoms/TextField";
import { Callout } from "../molecules/Callout";
import { FoundPrinterItem } from "../molecules/FoundPrinterItem";
import { SectionHeader } from "../molecules/SectionHeader";
import styles from "./ConnectPrinterCard.module.scss";

/** First connection over the LAN: search (UDP broadcast from the bridge) or type the IP. */
export function ConnectPrinterCard() {
  const { t } = useTranslation();
  const printer = usePrinter();
  const discover = useDiscover();
  const connect = useConnect();
  const [ip, setIp] = useState("");
  const found = discover.data ?? [];

  return (
    <Card>
      <SectionHeader
        icon="print_connect"
        title={t("connection.connect.title")}
        subtitle={t("connection.connect.subtitle")}
      />

      <Button
        variant="tonal"
        icon={discover.isPending ? "sync" : "travel_explore"}
        iconSpin={discover.isPending}
        block
        disabled={discover.isPending}
        onClick={() => discover.mutate()}
      >
        {discover.isPending
          ? t("connection.connect.searching")
          : t("connection.connect.search")}
      </Button>

      {discover.isSuccess && found.length === 0 && (
        <Callout tone="warning">{t("connection.connect.none")}</Callout>
      )}
      {discover.isError && (
        <Callout tone="error">{errorText(t, discover.error)}</Callout>
      )}
      {found.length > 0 && (
        <ul className={styles.list}>
          {found.map((p) => (
            <FoundPrinterItem
              key={p.ip}
              name={p.name || p.ip}
              detail={`${p.ip}${p.sn ? ` · ${p.sn}` : ""}`}
              actionLabel={
                printer?.ip === p.ip
                  ? t("printer.online")
                  : t("connection.connect.connect")
              }
              disabled={connect.isPending || printer?.ip === p.ip}
              onConnect={() =>
                connect.mutate({ ip: p.ip, name: p.name, sn: p.sn })
              }
            />
          ))}
        </ul>
      )}

      <form
        className={styles.manual}
        onSubmit={(e) => {
          e.preventDefault();
          connect.mutate({ ip: ip.trim() });
        }}
      >
        <TextField
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder={t("connection.connect.ipPlaceholder")}
          aria-label={t("connection.connect.ipPlaceholder")}
          inputMode="decimal"
          className={styles.field}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!ip.trim() || connect.isPending}
        >
          {connect.isPending
            ? t("connection.connect.connecting")
            : t("connection.connect.connect")}
        </Button>
      </form>
      {connect.isError && (
        <Callout tone="error">{errorText(t, connect.error)}</Callout>
      )}
    </Card>
  );
}
