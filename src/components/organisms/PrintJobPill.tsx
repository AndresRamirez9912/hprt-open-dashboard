import { useTranslation } from "react-i18next";
import { useJobEvent } from "../../hooks/useBridge";
import { usePrintProgress } from "../../hooks/usePrint";
import { jobProgress } from "../../lib/jobProgress";
import { usePrintJob } from "../../state/PrintJob";
import { Icon } from "../atoms/Icon";
import styles from "./PrintJobPill.module.scss";

/** Floating reminder of a print running in the background; opens the progress dialog. */
export function PrintJobPill({
  aboveNavBar = false,
}: {
  aboveNavBar?: boolean;
}) {
  const { t } = useTranslation();
  const job = usePrintJob();
  const event = useJobEvent();
  const progress = usePrintProgress();
  if (!job.minimized || job.status === "idle") return null;

  const pct = Math.round(jobProgress(event));
  const text =
    job.status === "pending"
      ? `${t("print.job.pill", { pct })}${progress.copies > 1 ? ` · ${t("print.job.copyOf", { copy: progress.copy, copies: progress.copies })}` : ""}`
      : job.status === "success"
        ? t("print.job.done")
        : t("print.job.failed");

  return (
    <button
      type="button"
      className={`${styles.pill} ${aboveNavBar ? styles.aboveNavBar : ""} ${styles[job.status]}`}
      onClick={job.restore}
    >
      <Icon
        name={
          job.status === "pending"
            ? "sync"
            : job.status === "success"
              ? "check_circle"
              : "error"
        }
        spin={job.status === "pending"}
        size={18}
      />
      <span>{text}</span>
      {job.status === "pending" && (
        <span className={styles.track} aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </span>
      )}
    </button>
  );
}
