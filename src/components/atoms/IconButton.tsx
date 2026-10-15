import type { ButtonHTMLAttributes } from "react";
import { Icon } from "./Icon";
import styles from "./IconButton.module.scss";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  /** Accessible name (also shown as tooltip). */
  label: string;
  spin?: boolean;
  floating?: boolean;
}

export function IconButton({
  icon,
  label,
  spin,
  floating,
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`${styles.button} ${floating ? styles.floating : ""} ${className}`}
      {...rest}
    >
      <Icon name={icon} size={20} spin={spin} />
    </button>
  );
}
