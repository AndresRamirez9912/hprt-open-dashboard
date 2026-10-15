import type { ReactNode } from "react";
import styles from "./StatTile.module.scss";

interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  tone?: "primary" | "success" | "warning" | "plain";
  /** Content under the value (e.g. a progress bar). */
  children?: ReactNode;
  aside?: ReactNode;
}

export function StatTile({
  label,
  value,
  tone = "plain",
  aside,
  children,
}: StatTileProps) {
  return (
    <div className={styles.tile}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        {aside}
      </div>
      <span className={`${styles.value} ${styles[tone]} tabular`}>{value}</span>
      {children}
    </div>
  );
}
