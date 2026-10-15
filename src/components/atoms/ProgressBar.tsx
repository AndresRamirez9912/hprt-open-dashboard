import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  /** 0..100 */
  value: number;
  tone?: "primary" | "success" | "warning";
  label?: string;
}

export function ProgressBar({
  value,
  tone = "primary",
  label,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={`${styles.fill} ${styles[tone]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
