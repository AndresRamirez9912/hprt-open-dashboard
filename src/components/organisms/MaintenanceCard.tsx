import { useTranslation } from "react-i18next";
import type { BridgeState } from "../../api/types";
import { useResetLink } from "../../hooks/usePrinterActions";
import { errorText } from "../../i18n/messages";
import { Card } from "../atoms/Card";
import { Icon } from "../atoms/Icon";
import { Callout } from "../molecules/Callout";
import styles from "./MaintenanceCard.module.scss";

/** "Maintenance & control": reopens the sockets with the same printer. */
export function MaintenanceCard({ printer }: { printer: BridgeState }) {
  const { t } = useTranslation();
  const reset = useResetLink();

  return (
    <Card>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <Icon name="tune" />
          <h2>{t("status.maintenance")}</h2>
          <Icon name="expand_more" className={styles.chevron} />
        </summary>
        <button
          type="button"
          className={styles.action}
          disabled={reset.isPending || printer.printing}
          onClick={() => reset.mutate(printer)}
        >
          <span className={styles.actionIcon}>
            <Icon name="restart_alt" spin={reset.isPending} />
          </span>
          <span className={styles.text}>
            <strong>{t("status.resetLink")}</strong>
            <small>{t("status.resetLinkHint")}</small>
          </span>
          <Icon name="chevron_right" />
        </button>
        {reset.isError && (
          <Callout tone="error">{errorText(t, reset.error)}</Callout>
        )}
      </details>
    </Card>
  );
}
