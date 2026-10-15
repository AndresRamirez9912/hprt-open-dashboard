import { useTranslation } from "react-i18next";
import type { BridgeState } from "../../api/types";
import { hrefFor } from "../../app/router";
import { useLogEntries } from "../../hooks/useLogEntries";
import { useResetLink } from "../../hooks/usePrinterActions";
import { errorText } from "../../i18n/messages";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { Callout } from "../molecules/Callout";
import styles from "./MaintenancePanel.module.scss";

/** Desktop "Maintenance & control": reset the link and the last protocol event. */
export function MaintenancePanel({ printer }: { printer: BridgeState }) {
  const { t } = useTranslation();
  const reset = useResetLink();
  const entries = useLogEntries();
  const last = entries[entries.length - 1];

  return (
    <section className={styles.panel}>
      <header className={styles.head}>
        <Icon name="build" size={24} className={styles.accent} />
        <h2>{t("status.maintenance")}</h2>
      </header>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <strong>{t("status.resetLink")}</strong>
          <Button
            small
            disabled={reset.isPending || printer.printing}
            iconSpin={reset.isPending}
            icon={reset.isPending ? "sync" : undefined}
            onClick={() => reset.mutate(printer)}
          >
            {t("web.status.reset")}
          </Button>
        </div>
        <p>{t("status.resetLinkHint")}</p>
        {reset.isError && (
          <Callout tone="error">{errorText(t, reset.error)}</Callout>
        )}
      </div>

      <div className={styles.block}>
        <div className={styles.blockHead}>
          <strong>{t("web.status.lastEvent")}</strong>
          {last && <code>{new Date(last.t).toLocaleTimeString()}</code>}
        </div>
        <p className={styles.mono}>{last ? last.msg : t("logs.empty")}</p>
        <a className={styles.link} href={hrefFor("logs")}>
          <Icon name="receipt_long" size={18} />
          {t("web.status.allLogs")}
          <Icon name="arrow_forward" size={18} />
        </a>
      </div>
    </section>
  );
}
