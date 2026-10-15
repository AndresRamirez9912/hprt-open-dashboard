import { Icon } from "../atoms/Icon";
import styles from "./Stepper.module.scss";

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  lessLabel: string;
  moreLabel: string;
}

/** − value + counter (number of copies). */
export function Stepper({
  value,
  min,
  max,
  onChange,
  lessLabel,
  moreLabel,
}: StepperProps) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.button}
        aria-label={lessLabel}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Icon name="remove" size={18} />
      </button>
      <span className={`${styles.value} tabular`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.button}
        aria-label={moreLabel}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Icon name="add" size={18} />
      </button>
    </div>
  );
}
