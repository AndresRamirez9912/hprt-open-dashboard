import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./TextField.module.scss";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Element shown inside the field on the right (e.g. a show-password button). */
  trailing?: ReactNode;
}

export function TextField({
  trailing,
  className = "",
  ...rest
}: TextFieldProps) {
  return (
    <div className={`${styles.wrap} ${className}`}>
      <input
        className={`${styles.input} ${trailing ? styles.withTrailing : ""}`}
        {...rest}
      />
      {trailing && <span className={styles.trailing}>{trailing}</span>}
    </div>
  );
}
