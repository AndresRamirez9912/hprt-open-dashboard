import { Icon } from "../atoms/Icon";
import styles from "./NavItem.module.scss";

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  active: boolean;
  /** `tab`: bottom bar (mobile). `side`: row in the desktop side bar. */
  variant?: "tab" | "side";
}

export function NavItem({
  href,
  icon,
  label,
  active,
  variant = "tab",
}: NavItemProps) {
  return (
    <a
      href={href}
      className={`${styles[variant]} ${active ? styles.active : ""}`}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        name={icon}
        size={variant === "side" ? 22 : 24}
        filled={active && variant === "tab"}
      />
      <span className={styles.label}>{label}</span>
    </a>
  );
}
