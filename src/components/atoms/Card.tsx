import type { ReactNode } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  /** `soft`: inner tinted block inside a card. */
  variant?: "raised" | "soft";
  /** Decorative blurred color glow in a corner, as in the design's hero cards. */
  glow?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({
  variant = "raised",
  glow,
  className = "",
  children,
}: CardProps) {
  return (
    <section className={`${styles.card} ${styles[variant]} ${className}`}>
      {glow && <span className={styles.glow} aria-hidden="true" />}
      {children}
    </section>
  );
}
