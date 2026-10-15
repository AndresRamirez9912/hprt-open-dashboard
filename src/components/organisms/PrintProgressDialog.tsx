import { useTranslation } from "react-i18next";
import { useJobEvent, usePrinter } from "../../hooks/useBridge";
import { useCancelPrint } from "../../hooks/usePrinterActions";
import { usePrintProgress } from "../../hooks/usePrint";
import { bridgeMessageText, errorText, stageText } from "../../i18n/messages";
import { jobProgress } from "../../lib/jobProgress";
import { usePrintJob } from "../../state/PrintJob";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { ProgressBar } from "../atoms/ProgressBar";
import { Dialog } from "../molecules/Dialog";
import styles from "./PrintProgressDialog.module.scss";

/**
 * Modal shown from the moment a print starts until the user closes the result.
 * "Continue" puts it aside (the job keeps running) so another photo can be prepared.
 */
export function PrintProgressDialog() {
  const { t } = useTranslation();
  const { status, result, error, minimized, minimize, close } = usePrintJob();
  const printer = usePrinter();
  const printerName = printer?.info?.name ?? printer?.ip ?? "";
  const job = useJobEvent();
  const progress = usePrintProgress();
  const cancel = useCancelPrint();
  const pct = Math.round(jobProgress(job));

  const step = (() => {
    if (!job || job.phase === "claim")
      return job?.label
        ? bridgeMessageText(t, job.label)
        : t("print.job.claiming");
    if (job.phase === "sending")
      return `${t("print.job.sendingPhoto")} · ${job.progress ?? 0}%${job.rate ? ` · ${job.rate} KB/s` : ""}`;
    if (job.phase === "sent") return t("print.job.sent");
    if (job.phase === "stage" && job.stageCode != null)
      return stageText(t, job.stageCode);
    return "";
  })();

  return (
    <Dialog
      open={status !== "idle" && !minimized}
      onClose={status === "pending" ? minimize : close}
      label={t("print.printNow")}
    >
      {status === "pending" && (
        <>
          <span className={styles.icon}>
            <Icon name="sync" size={32} spin />
          </span>
          <div>
            <h4 className={styles.title}>
              {t("print.job.sending", { name: printerName })}
            </h4>
            {progress.copies > 1 && (
              <p className={styles.sub}>
                {t("print.job.copyOf", {
                  copy: progress.copy,
                  copies: progress.copies,
                })}
              </p>
            )}
          </div>
          <ProgressBar value={pct} label={step} />
          <div className={styles.row}>
            <span>{t("print.job.step", { step })}</span>
            <span className="tabular">{pct}%</span>
          </div>
          <div className={styles.actions}>
            <Button
              variant="danger"
              onClick={() => cancel.mutate()}
              disabled={cancel.isPending}
            >
              {t("print.job.cancel")}
            </Button>
            <Button variant="primary" icon="edit" onClick={minimize}>
              {t("print.job.continue")}
            </Button>
          </div>
          <p className={styles.sub}>{t("print.job.continueHint")}</p>
        </>
      )}

      {status === "success" && (
        <>
          <span className={`${styles.icon} ${styles.ok}`}>
            <Icon name="check_circle" size={32} filled />
          </span>
          <h4 className={styles.title}>
            {result?.unconfirmed
              ? t("print.job.doneUnconfirmed")
              : t("print.job.done")}
          </h4>
          <Button variant="primary" block onClick={close}>
            {t("print.close")}
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <span className={`${styles.icon} ${styles.bad}`}>
            <Icon name="error" size={32} filled />
          </span>
          <div>
            <h4 className={styles.title}>{t("print.job.failed")}</h4>
            <p className={styles.sub}>{errorText(t, error)}</p>
          </div>
          <Button variant="tonal" block onClick={close}>
            {t("print.close")}
          </Button>
        </>
      )}
    </Dialog>
  );
}
