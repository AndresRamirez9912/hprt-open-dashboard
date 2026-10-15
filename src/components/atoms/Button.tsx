import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./Button.module.scss";

type Variant = "primary" | "hero" | "tonal" | "surface" | "danger" | "text";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: string;
  iconSpin?: boolean;
  block?: boolean;
  small?: boolean;
  children?: ReactNode;
}

/** Pill button. `hero` is the big print action; `tonal` the porcelain secondary button. */
export function Button({
  variant = "tonal",
  icon,
  iconSpin,
  block,
  small,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${styles[variant]} ${block ? styles.block : ""} ${small ? styles.small : ""} ${className}`}
      {...rest}
    >
      {icon && (
        <Icon
          name={icon}
          size={variant === "hero" ? 26 : small ? 16 : 20}
          spin={iconSpin}
        />
      )}
      {children}
    </button>
  );
}
