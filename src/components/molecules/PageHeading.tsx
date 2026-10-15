import type { ReactNode } from "react";
import styles from "./PageHeading.module.scss";

interface PageHeadingProps {
  title: ReactNode;
  /** Small pill after the title (e.g. the printer model). */
  chip?: ReactNode;
  subtitle?: ReactNode;
}

/** Title row of a desktop page. */
export function PageHeading({ title, chip, subtitle }: PageHeadingProps) {
  return (
    <div className={styles.heading}>
      <div className={styles.titleRow}>
        <h1>{title}</h1>
        {chip && <span className={styles.chip}>{chip}</span>}
      </div>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
