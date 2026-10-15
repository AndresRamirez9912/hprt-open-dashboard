import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { usePrintSettings } from "../../state/PrintSettings";
import { Button } from "../atoms/Button";
import styles from "./PrintActions.module.scss";

interface PrintActionsProps {
  canPrint: boolean;
  hasPrinter: boolean;
  busy: boolean;
  onPrint: () => void;
  onPreview: () => void;
  /** Text of the print button; the mobile design's by default. */
  label?: ReactNode;
  /** Pill inside the print button; the number of copies by default. */
  badge?: ReactNode;
}

/** The big "Print now" action and the real preview button. */
export function PrintActions({
  canPrint,
  hasPrinter,
  busy,
  onPrint,
  onPreview,
  label,
  badge,
}: PrintActionsProps) {
  const { t } = useTranslation();
  const s = usePrintSettings();
  const hint = !s.photo
    ? t("print.needPhoto")
    : !hasPrinter
      ? t("print.needPrinter")
      : busy
        ? t("print.job.busy")
        : null;

  return (
    <section className={styles.dock}>
      <Button
        variant="hero"
        icon="print"
        block
        disabled={!canPrint || busy}
        onClick={onPrint}
      >
        {label ?? t("print.printNow")}
        {badge !== null && (
          <span className={styles.badge}>
            {badge ?? t("print.copiesBadge", { count: s.copies })}
          </span>
        )}
      </Button>
      {hint && <p className={styles.hint}>{hint}</p>}
      <Button
        variant="surface"
        icon="visibility"
        block
        disabled={!s.photo}
        onClick={onPreview}
      >
        {t("print.realPreview")}
      </Button>
    </section>
  );
}
