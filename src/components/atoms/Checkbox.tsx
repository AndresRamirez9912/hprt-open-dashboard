import type { ReactNode } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
}

export function Checkbox({
  checked,
  onChange,
  children,
  disabled,
}: CheckboxProps) {
  return (
    <label className={`${styles.label} ${disabled ? styles.disabled : ""}`}>
      <input
        type="checkbox"
        className={styles.box}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}
