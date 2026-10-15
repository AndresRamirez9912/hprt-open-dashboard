import type { ReactNode } from "react";
import { Icon } from "../atoms/Icon";
import styles from "./SectionHeader.module.scss";

interface SectionHeaderProps {
  icon: string;
  /** Color of the round icon holder. */
  tone?: "primary" | "success" | "warning" | "plain";
  title: ReactNode;
  subtitle?: ReactNode;
  /** Badge or button on the right. */
  aside?: ReactNode;
  /** h2 for page sections, h3 inside a card. */
  level?: 2 | 3;
}

export function SectionHeader({
  icon,
  tone = "primary",
  title,
  subtitle,
  aside,
  level = 2,
}: SectionHeaderProps) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <header className={styles.header}>
      <div className={styles.main}>
        <span className={`${styles.icon} ${styles[tone]}`}>
          <Icon name={icon} size={tone === "plain" ? 20 : 18} />
        </span>
        <div className={styles.text}>
          <Heading className={styles.title}>{title}</Heading>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {aside && <div className={styles.aside}>{aside}</div>}
    </header>
  );
}
