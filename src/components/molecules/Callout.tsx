import type { ReactNode } from "react";
import { Icon } from "../atoms/Icon";
import styles from "./Callout.module.scss";

interface CalloutProps {
  icon?: string;
  tone?: "info" | "warning" | "error" | "success";
  children: ReactNode;
}

/** Short explanatory or status message in a tinted block. */
export function Callout({
  icon = "info",
  tone = "info",
  children,
}: CalloutProps) {
  return (
    <div
      className={`${styles.callout} ${styles[tone]}`}
      role={tone === "error" ? "alert" : undefined}
    >
      <Icon name={icon} size={18} className={styles.icon} />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
