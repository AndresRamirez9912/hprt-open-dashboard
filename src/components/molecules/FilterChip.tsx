import type { ReactNode } from "react";
import styles from "./FilterChip.module.scss";

interface FilterChipProps {
  active: boolean;
  onClick: () => void;
  /** Color dot for the category (none for "all"). */
  dot?: "primary" | "success" | "warning" | "violet";
  children: ReactNode;
}

export function FilterChip({
  active,
  onClick,
  dot,
  children,
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`${styles.chip} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      {dot && <span className={`${styles.dot} ${styles[dot]}`} />}
      {children}
    </button>
  );
}
