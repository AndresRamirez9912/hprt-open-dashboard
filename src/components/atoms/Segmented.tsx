import type { ReactNode } from "react";
import styles from "./Segmented.module.scss";

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  /** `floating`: translucent pill over the photo. */
  floating?: boolean;
}

/** Pill-shaped single choice (radio group). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  floating,
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`${styles.group} ${floating ? styles.floating : ""}`}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          className={`${styles.option} ${o.value === value ? styles.on : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
