import type { ReactNode } from "react";
import { Icon } from "../atoms/Icon";
import styles from "./ShortcutRow.module.scss";

interface ShortcutRowProps {
  href: string;
  icon: string;
  label: ReactNode;
  /** Small value on the right (e.g. "6 eventos"); a chevron is shown otherwise. */
  value?: ReactNode;
}

/** Full-width link row (e.g. to the protocol log). */
export function ShortcutRow({ href, icon, label, value }: ShortcutRowProps) {
  return (
    <a href={href} className={styles.row}>
      <span className={styles.label}>
        <Icon name={icon} size={20} />
        {label}
      </span>
      {value ? (
        <span className={styles.value}>{value}</span>
      ) : (
        <Icon name="chevron_right" size={18} />
      )}
    </a>
  );
}
