import type { ReactNode } from "react";
import { Icon } from "../atoms/Icon";
import styles from "./InfoRow.module.scss";

interface InfoRowProps {
  icon?: string;
  label: ReactNode;
  value: ReactNode;
  mono?: boolean;
}

/** Label on the left, value on the right (device details lists). */
export function InfoRow({ icon, label, value, mono }: InfoRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>
        {icon && <Icon name={icon} size={18} />}
        {label}
      </span>
      <span className={`${styles.value} ${mono ? styles.mono : ""}`}>
        {value}
      </span>
    </div>
  );
}
