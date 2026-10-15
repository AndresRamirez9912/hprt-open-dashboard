import type { SelectHTMLAttributes } from "react";
import { Icon } from "./Icon";
import styles from "./Select.module.scss";

/** Pill select with the design's chevron. Children are <option> elements. */
export function Select({
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`${styles.wrap} ${className}`}>
      <select className={styles.select} {...rest}>
        {children}
      </select>
      <Icon name="expand_more" className={styles.chevron} />
    </div>
  );
}
