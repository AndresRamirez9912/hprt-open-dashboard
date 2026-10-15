import type { ReactNode } from "react";
import { Icon } from "../atoms/Icon";
import styles from "./MetricTile.module.scss";

type Tone = "primary" | "success" | "warning" | "error" | "plain";

interface MetricTileProps {
  label: ReactNode;
  icon: string;
  iconTone?: Tone;
  value: ReactNode;
  unit?: ReactNode;
  hint?: ReactNode;
  hintTone?: Tone;
  /** Under the hint (e.g. a progress bar). */
  children?: ReactNode;
}

/** Big-number tile of the desktop status row. */
export function MetricTile({
  label,
  icon,
  iconTone = "plain",
  value,
  unit,
  hint,
  hintTone = "plain",
  children,
}: MetricTileProps) {
  return (
    <div className={styles.tile}>
      <div className={styles.top}>
        <span>{label}</span>
        <span className={`${styles.icon} ${styles[iconTone]}`}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className={styles.value}>
        <b className="tabular">{value}</b>
        {unit && <small>{unit}</small>}
      </div>
      {hint && (
        <p className={`${styles.hint} ${styles[`text-${hintTone}`]}`}>{hint}</p>
      )}
      {children}
    </div>
  );
}
