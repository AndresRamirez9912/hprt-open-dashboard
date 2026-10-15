import styles from "./Icon.module.scss";

interface IconProps {
  /** Material Symbols name, e.g. "print". */
  name: string;
  size?: number;
  filled?: boolean;
  spin?: boolean;
  className?: string;
}

/** Decorative icon (hidden from screen readers; give the parent an accessible label). */
export function Icon({
  name,
  size = 20,
  filled = false,
  spin = false,
  className = "",
}: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${styles.icon} ${spin ? styles.spin : ""} ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}`,
      }}
    >
      {name}
    </span>
  );
}
