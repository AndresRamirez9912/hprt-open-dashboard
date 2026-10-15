import type { ReactNode } from "react";
import styles from "./Badge.module.scss";

export type Tone = "primary" | "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  tone?: Tone;
  /** Small status dot before the text; `pulse` animates it. */
  dot?: boolean;
  pulse?: boolean;
  mono?: boolean;
  children: ReactNode;
}

export function Badge({
  tone = "neutral",
  dot,
  pulse,
  mono,
  children,
}: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[tone]} ${mono ? styles.mono : ""}`}
    >
      {dot && <span className={`${styles.dot} ${pulse ? styles.pulse : ""}`} />}
      {children}
    </span>
  );
}
